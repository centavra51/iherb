import csv
import json
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

PAGE_HEADERS = [
    "slug",
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
    "page_type",
    "entity_type",
    "entity_name",
    "cluster_label",
    "source",
    "source_url",
    "impressions",
    "clicks",
    "ctr",
    "position",
]

IDEA_HEADERS = [
    "keyword",
    "slug",
    "category",
    "intent",
    "page_type",
    "entity_type",
    "entity_name",
    "cluster_label",
    "source",
    "source_url",
    "impressions",
    "clicks",
    "ctr",
    "position",
]

TRANSLIT_MAP = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "e",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "y",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "h",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "sch",
    "ъ": "",
    "ы": "y",
    "ь": "",
    "э": "e",
    "ю": "yu",
    "я": "ya",
}


def clean(text: str | None) -> str:
    return (text or "").strip()


def slugify(text: str) -> str:
    lowered = clean(text).lower()
    transliterated = "".join(TRANSLIT_MAP.get(char, char) for char in lowered)
    normalized = []
    for char in transliterated:
        if char.isalnum():
            normalized.append(char)
        elif char in {" ", "-", "/", "_"}:
            normalized.append("-")
    slug = "".join(normalized)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-")


def title_case(value: str) -> str:
    text = clean(value)
    return text[:1].upper() + text[1:] if text else ""


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        return [{clean(key): clean(value) for key, value in row.items() if key} for row in reader]


def write_csv_rows(path: Path, fieldnames: list[str], rows: Iterable[dict[str, str]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({header: clean(row.get(header, "")) for header in fieldnames})


def load_seed_terms() -> dict[str, list[str]]:
    seed_file = DATA_DIR / "seed_terms.json"
    return json.loads(seed_file.read_text(encoding="utf-8"))


def find_match(keyword: str, values: Iterable[str]) -> str:
    lowered = f" {clean(keyword).lower()} "
    ranked = sorted((clean(value) for value in values if clean(value)), key=len, reverse=True)
    for value in ranked:
        candidate = value.lower()
        if candidate in lowered:
            return value
    return ""


def detect_intent(keyword: str, page_type: str = "") -> str:
    lowered = clean(keyword).lower()
    commercial_markers = [
        "купить",
        "цена",
        "лучший",
        "лучшие",
        "бренд",
        "отзывы",
        "сравнить",
        "выбрать",
        "для",
        "в капсулах",
        "в порошке",
        "в каплях",
    ]
    informational_markers = [
        "что это",
        "польза",
        "зачем",
        "как принимать",
        "побочные",
        "симптом",
        "дефицит",
        "признаки",
    ]

    if page_type in {"brand", "audience", "form_factor"}:
        return "commercial"
    if page_type == "symptom":
        return "mixed"
    if any(marker in lowered for marker in informational_markers):
        return "informational"
    if any(marker in lowered for marker in commercial_markers):
        return "commercial"
    return "mixed"


def classify_keyword(keyword: str, seeds: dict[str, list[str]]) -> dict[str, str]:
    keyword_clean = clean(keyword)
    brands = seeds.get("brands", [])
    ingredients = seeds.get("ingredients") or seeds.get("products", [])
    symptoms = seeds.get("symptoms", [])
    audiences = seeds.get("audiences", [])
    form_factors = seeds.get("form_factors") or seeds.get("formats", [])

    brand_match = find_match(keyword_clean, brands)
    ingredient_match = find_match(keyword_clean, ingredients)
    symptom_match = find_match(keyword_clean, symptoms)
    audience_match = find_match(keyword_clean, audiences)
    form_match = find_match(keyword_clean, form_factors)

    if brand_match:
        page_type = "brand"
        entity_type = "brand"
        entity_name = brand_match
        category = title_case(brand_match)
    elif symptom_match:
        page_type = "symptom"
        entity_type = "symptom"
        entity_name = symptom_match
        category = "Симптомы и сценарии"
    elif audience_match:
        page_type = "audience"
        entity_type = "audience"
        entity_name = audience_match
        category = "Аудитории"
    elif form_match:
        page_type = "form_factor"
        entity_type = "form_factor"
        entity_name = form_match
        category = "Форм-факторы"
    elif ingredient_match:
        page_type = "ingredient"
        entity_type = "ingredient"
        entity_name = ingredient_match
        category = title_case(ingredient_match)
    else:
        page_type = "generic"
        entity_type = "topic"
        entity_name = keyword_clean
        category = "SEO-кластер"

    cluster_base = entity_name or brand_match or ingredient_match or symptom_match or audience_match or form_match or keyword_clean
    cluster_label = f"{page_type}:{slugify(cluster_base)}"

    return {
        "keyword": keyword_clean,
        "slug": slugify(keyword_clean),
        "category": category,
        "intent": detect_intent(keyword_clean, page_type),
        "page_type": page_type,
        "entity_type": entity_type,
        "entity_name": entity_name,
        "cluster_label": cluster_label,
    }
