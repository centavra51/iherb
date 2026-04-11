import argparse
import json
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from pipeline_utils import DATA_DIR, IDEA_HEADERS, clean, slugify, write_csv_rows


DEFAULT_INPUT = DATA_DIR / "search_console_export.csv"
DEFAULT_OUTPUT = DATA_DIR / "search_console_ideas.csv"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import query ideas from Google Search Console CSV export or Search Analytics API."
    )
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Path to CSV export from Search Console.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Where to save normalized ideas CSV.")
    parser.add_argument("--site-url", default="", help="Search Console property URL for API mode.")
    parser.add_argument("--access-token", default="", help="OAuth access token for Search Console API mode.")
    parser.add_argument("--start-date", default="2026-01-01", help="API mode start date, format YYYY-MM-DD.")
    parser.add_argument("--end-date", default="2026-04-11", help="API mode end date, format YYYY-MM-DD.")
    parser.add_argument("--row-limit", type=int, default=250, help="API mode query limit.")
    return parser.parse_args()


def normalize_metric(value: str) -> str:
    return clean(value).replace("%", "").replace(",", ".")


def pick_value(row: dict[str, str], aliases: list[str]) -> str:
    lowered = {clean(key).lower(): clean(value) for key, value in row.items() if key}
    for alias in aliases:
        if alias.lower() in lowered:
            return lowered[alias.lower()]
    return ""


def normalize_row(keyword: str, page: str, clicks: str, impressions: str, ctr: str, position: str) -> dict[str, str]:
    keyword_clean = clean(keyword)
    if not keyword_clean:
        return {}

    return {
        "keyword": keyword_clean,
        "slug": slugify(keyword_clean),
        "category": "",
        "intent": "",
        "page_type": "",
        "entity_type": "",
        "entity_name": "",
        "cluster_label": "",
        "source": "search_console",
        "source_url": clean(page),
        "impressions": clean(impressions),
        "clicks": clean(clicks),
        "ctr": normalize_metric(ctr),
        "position": normalize_metric(position),
    }


def import_from_csv(input_path: Path) -> list[dict[str, str]]:
    if not input_path.exists():
        raise FileNotFoundError(
            f"Missing {input_path}. Export the Queries report from Search Console as CSV or use API mode."
        )

    import csv

    with input_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = []
        for row in reader:
            normalized = normalize_row(
                keyword=pick_value(row, ["query", "top queries", "queries", "запрос", "query string"]),
                page=pick_value(row, ["page", "top pages", "страница", "landing page"]),
                clicks=pick_value(row, ["clicks", "клики"]),
                impressions=pick_value(row, ["impressions", "показы"]),
                ctr=pick_value(row, ["ctr", "site ctr", "ctr (%)"]),
                position=pick_value(row, ["position", "average position", "средняя позиция"]),
            )
            if normalized:
                rows.append(normalized)
    return rows


def import_from_api(site_url: str, access_token: str, start_date: str, end_date: str, row_limit: int) -> list[dict[str, str]]:
    if not site_url or not access_token:
        raise ValueError("API mode requires both --site-url and --access-token.")

    endpoint = (
        "https://searchconsole.googleapis.com/webmasters/v3/sites/"
        + urllib.parse.quote(site_url, safe="")
        + "/searchAnalytics/query"
    )
    payload = json.dumps(
        {
            "startDate": start_date,
            "endDate": end_date,
            "dimensions": ["query", "page"],
            "rowLimit": row_limit,
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        endpoint,
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Search Console API request failed: {error.code} {body}") from error

    rows = []
    for item in data.get("rows", []):
        keys = item.get("keys", [])
        normalized = normalize_row(
            keyword=keys[0] if len(keys) > 0 else "",
            page=keys[1] if len(keys) > 1 else "",
            clicks=str(item.get("clicks", "")),
            impressions=str(item.get("impressions", "")),
            ctr=str(item.get("ctr", "")),
            position=str(item.get("position", "")),
        )
        if normalized:
            rows.append(normalized)
    return rows


def dedupe_rows(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    best_by_keyword: dict[str, dict[str, str]] = {}
    for row in rows:
        keyword = row["keyword"].lower()
        current = best_by_keyword.get(keyword)
        if not current:
            best_by_keyword[keyword] = row
            continue
        current_impressions = float(current.get("impressions") or 0)
        next_impressions = float(row.get("impressions") or 0)
        if next_impressions > current_impressions:
            best_by_keyword[keyword] = row
    return sorted(best_by_keyword.values(), key=lambda item: float(item.get("impressions") or 0), reverse=True)


def main() -> None:
    args = parse_args()
    rows = (
        import_from_api(args.site_url, args.access_token, args.start_date, args.end_date, args.row_limit)
        if args.site_url or args.access_token
        else import_from_csv(args.input)
    )
    unique_rows = dedupe_rows(rows)
    write_csv_rows(args.output, IDEA_HEADERS, unique_rows)
    print(f"Imported {len(unique_rows)} Search Console ideas into {args.output}")


if __name__ == "__main__":
    main()
