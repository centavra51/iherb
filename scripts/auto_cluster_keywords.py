import argparse
from pathlib import Path

from pipeline_utils import DATA_DIR, IDEA_HEADERS, classify_keyword, load_seed_terms, read_csv_rows, write_csv_rows


DEFAULT_INPUT = DATA_DIR / "search_console_ideas.csv"
DEFAULT_OUTPUT = DATA_DIR / "clusters.csv"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Auto-cluster raw keyword ideas into page types and entity groups.")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Normalized idea CSV to cluster.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Where to save clustered rows.")
    return parser.parse_args()


def merge_cluster_data(row: dict[str, str], cluster_data: dict[str, str]) -> dict[str, str]:
    merged = {**row}
    for key, value in cluster_data.items():
        if value:
            merged[key] = value
    if not merged.get("source"):
        merged["source"] = "auto_cluster"
    return merged


def dedupe_rows(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    seen: set[str] = set()
    unique_rows: list[dict[str, str]] = []
    for row in rows:
        key = row["keyword"].lower()
        if key in seen:
            continue
        seen.add(key)
        unique_rows.append(row)
    return unique_rows


def main() -> None:
    args = parse_args()
    seeds = load_seed_terms()
    rows = read_csv_rows(args.input)
    clustered_rows = [merge_cluster_data(row, classify_keyword(row.get("keyword", ""), seeds)) for row in rows]
    unique_rows = dedupe_rows(clustered_rows)
    write_csv_rows(args.output, IDEA_HEADERS, unique_rows)
    print(f"Clustered {len(unique_rows)} keywords into {args.output}")


if __name__ == "__main__":
    main()
