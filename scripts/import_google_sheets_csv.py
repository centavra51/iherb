from pathlib import Path

from pipeline_utils import PAGE_HEADERS, clean, read_csv_rows, write_csv_rows


ROOT = Path(__file__).resolve().parents[1]
IMPORT_FILE = ROOT / "data" / "google_sheets_export.csv"
OUTPUT_FILE = ROOT / "data" / "keywords.csv"

REQUIRED_HEADERS = [
    "keyword",
    "category",
    "intent",
    "title",
    "meta_description",
    "h1",
    "intro",
    "benefits",
    "how_to_choose",
    "faq_q1",
    "faq_a1",
    "faq_q2",
    "faq_a2",
    "faq_q3",
    "faq_a3",
    "cta_primary",
    "cta_secondary",
    "image_url",
    "body_md",
    "status",
]


def main() -> None:
    if not IMPORT_FILE.exists():
        raise FileNotFoundError(
            f"Missing {IMPORT_FILE}. Export your Google Sheet as CSV and save it there first."
        )

    rows = read_csv_rows(IMPORT_FILE)
    if not rows:
        raise ValueError(f"No rows found in {IMPORT_FILE}")

    source_headers = set(rows[0].keys())
    missing = [header for header in REQUIRED_HEADERS if header not in source_headers]
    if missing:
        raise ValueError("Google Sheets export is missing required columns: " + ", ".join(missing))

    normalized_rows = []
    for row in rows:
        if not clean(row.get("keyword")):
            continue
        normalized_rows.append({header: clean(row.get(header, "")) for header in PAGE_HEADERS})

    write_csv_rows(OUTPUT_FILE, PAGE_HEADERS, normalized_rows)
    print(f"Imported {len(normalized_rows)} rows from Google Sheets into {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
