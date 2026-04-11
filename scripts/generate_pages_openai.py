import argparse
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

from pipeline_utils import (
    DATA_DIR,
    PAGE_HEADERS,
    classify_keyword,
    clean,
    load_seed_terms,
    read_csv_rows,
    title_case,
    write_csv_rows,
)


DEFAULT_INPUT = DATA_DIR / "clusters.csv"
DEFAULT_OUTPUT = DATA_DIR / "keywords.generated.csv"
API_URL = "https://api.openai.com/v1/chat/completions"
DEFAULT_MODEL = "gpt-4.1-nano"

SYSTEM_PROMPT = """You create Russian-language SEO landing page data for a wellness supplements site.
Return only valid JSON with these string keys:
title, meta_description, h1, intro, benefits, how_to_choose, faq_q1, faq_a1, faq_q2, faq_a2, faq_q3, faq_a3, cta_primary, cta_secondary, body_md, image_url.
Rules:
- Keep claims careful and non-medical.
- benefits must be a string with 3 short points separated by |
- body_md should contain 2 markdown sections with headings starting with ## and bullet lists
- Keep copy specific to the page type and user intent
- Use the provided site name exactly when mentioning the site. Never invent another brand, store, company, or domain.
- Do not invent external URLs, product links, citations, or image URLs.
- Set image_url to an empty string unless the user explicitly provides a real image URL in the input.
- Avoid ad-like slogans, exaggerated claims, and generic marketing copy.
- Prefer comparison/helpful SEO copy over sales copy.
- Do not wrap JSON in markdown fences
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate page rows with OpenAI based on clustered keywords.")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Clustered keyword CSV.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Output CSV with ready page rows.")
    parser.add_argument("--model", default=os.getenv("OPENAI_MODEL", DEFAULT_MODEL), help="OpenAI model name.")
    parser.add_argument("--api-key", default=os.getenv("OPENAI_API_KEY", ""), help="OpenAI API key.")
    parser.add_argument("--site-name", default="iherbs.com.md", help="Site name used in metadata.")
    parser.add_argument("--limit", type=int, default=0, help="Process only the first N rows.")
    parser.add_argument("--delay", type=float, default=0.4, help="Delay between API calls in seconds.")
    parser.add_argument("--fallback-only", action="store_true", help="Generate deterministic draft copy without API.")
    parser.add_argument("--status", default="draft", help="Status to assign to generated rows.")
    return parser.parse_args()


def build_user_prompt(row: dict[str, str]) -> str:
    payload = {
        "keyword": row.get("keyword", ""),
        "category": row.get("category", ""),
        "intent": row.get("intent", ""),
        "page_type": row.get("page_type", ""),
        "entity_type": row.get("entity_type", ""),
        "entity_name": row.get("entity_name", ""),
        "cluster_label": row.get("cluster_label", ""),
        "source_metrics": {
            "impressions": row.get("impressions", ""),
            "clicks": row.get("clicks", ""),
            "ctr": row.get("ctr", ""),
            "position": row.get("position", ""),
        },
        "site_name": row.get("site_name", "iherbs.com.md"),
        "constraints": {
            "site_name_must_stay_exact": True,
            "image_url_must_be_empty_if_unknown": True,
            "no_external_brand_invention": True,
            "tone": "careful, editorial, SEO-focused",
        },
    }
    return json.dumps(payload, ensure_ascii=False)


def call_openai(api_key: str, model: str, row: dict[str, str]) -> dict[str, str]:
    body = json.dumps(
        {
            "model": model,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(row)},
            ],
            "temperature": 0.7,
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        API_URL,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI API request failed: {error.code} {body}") from error

    content = payload["choices"][0]["message"]["content"]
    parsed = json.loads(content)
    return {key: clean(value) for key, value in parsed.items()}


def build_fallback_copy(row: dict[str, str], site_name: str) -> dict[str, str]:
    keyword = clean(row.get("keyword"))
    category = clean(row.get("category")) or "Каталог"
    page_type = clean(row.get("page_type"))
    entity_name = clean(row.get("entity_name")) or keyword

    type_label = {
        "brand": "по бренду",
        "ingredient": "по ингредиенту",
        "symptom": "по симптому",
        "audience": "по аудитории",
        "form_factor": "по форм-фактору",
    }.get(page_type, "по запросу")

    return {
        "title": f"{title_case(keyword)}: как выбрать и сравнить | {site_name}",
        "meta_description": f"Страница {type_label} «{keyword}»: структура выбора, FAQ и связанные подборки для {site_name}.",
        "h1": f"{title_case(keyword)}: как сравнить варианты и не смешать интенты",
        "intro": f"Эта страница собрана под запрос «{keyword}» и помогает быстро понять, какие критерии сравнения важны в кластере «{category}».",
        "benefits": "Проверяйте состав и дозировку|Сравнивайте сценарий приема|Смотрите на форму выпуска и маркировку",
        "how_to_choose": f"Для страницы по теме «{entity_name}» полезно отделять базовые критерии выбора, формат приема и ожидания аудитории, чтобы запрос закрывался без дублирования соседних URL.",
        "faq_q1": f"Когда имеет смысл делать отдельную страницу под «{keyword}»?",
        "faq_a1": "Когда у запроса есть самостоятельный интент, отличимый набор критериев выбора и полезный контент, который не дублирует соседние страницы.",
        "faq_q2": f"Что сравнивать на странице про «{entity_name}» в первую очередь?",
        "faq_a2": "Обычно смотрят на состав, форму выпуска, дозировку на порцию, размер упаковки и понятность маркировки.",
        "faq_q3": "Почему важна автокластеризация до генерации страниц?",
        "faq_a3": "Она помогает не смешивать разные намерения пользователя в одном URL и уменьшает риск каннибализации между страницами.",
        "cta_primary": f"Открыть подборки по теме {entity_name}",
        "cta_secondary": f"Смотреть соседние страницы кластера {category}",
        "body_md": (
            "## Что проверить перед публикацией\n"
            "- Совпадает ли интент страницы с формулировкой запроса\n"
            "- Есть ли отдельная ценность по сравнению с соседними URL\n"
            "- Понятны ли пользователю критерии выбора\n"
            "## Как усилить страницу\n"
            "- Добавить связки с близкими кластерами и related pages\n"
            "- Уточнить формулировки под аудиторию и сценарий применения\n"
            "- Держать тон аккуратным и без медицинских обещаний"
        ),
        "image_url": "",
    }


def normalize_page_row(row: dict[str, str], generated: dict[str, str], status: str) -> dict[str, str]:
    page_row = {header: "" for header in PAGE_HEADERS}
    page_row.update({key: clean(row.get(key, "")) for key in page_row})
    page_row.update({key: clean(generated.get(key, "")) for key in generated})
    site_name = clean(row.get("site_name")) or "iherbs.com.md"

    for field in ["title", "meta_description", "intro", "how_to_choose", "faq_a1", "faq_a2", "faq_a3", "body_md"]:
        value = clean(page_row.get(field))
        if not value:
            continue
        value = value.replace("Wellness Supplements", site_name)
        value = value.replace("wellness-supplements.ru", site_name)
        value = value.replace("wellness-supplements.example.com", site_name)
        page_row[field] = value

    page_row["image_url"] = ""

    benefits = [clean(item) for item in clean(page_row.get("benefits")).split("|") if clean(item)]
    page_row["benefits"] = "|".join(benefits[:3])

    page_row["slug"] = clean(row.get("slug"))
    page_row["keyword"] = clean(row.get("keyword"))
    page_row["category"] = clean(row.get("category"))
    page_row["intent"] = clean(row.get("intent"))
    page_row["page_type"] = clean(row.get("page_type"))
    page_row["entity_type"] = clean(row.get("entity_type"))
    page_row["entity_name"] = clean(row.get("entity_name"))
    page_row["cluster_label"] = clean(row.get("cluster_label"))
    page_row["source"] = clean(row.get("source")) or "openai"
    page_row["source_url"] = clean(row.get("source_url"))
    page_row["impressions"] = clean(row.get("impressions"))
    page_row["clicks"] = clean(row.get("clicks"))
    page_row["ctr"] = clean(row.get("ctr"))
    page_row["position"] = clean(row.get("position"))
    page_row["status"] = status
    return page_row


def main() -> None:
    args = parse_args()
    rows = read_csv_rows(args.input)
    seeds = load_seed_terms()
    source_rows = [dict(row, **classify_keyword(row.get("keyword", ""), seeds), site_name=args.site_name) for row in rows]
    if args.limit > 0:
        source_rows = source_rows[: args.limit]

    output_rows = []
    for row in source_rows:
        generated = (
            build_fallback_copy(row, args.site_name)
            if args.fallback_only or not args.api_key
            else call_openai(args.api_key, args.model, row)
        )
        output_rows.append(normalize_page_row(row, generated, args.status))
        if not args.fallback_only and args.api_key and args.delay > 0:
            time.sleep(args.delay)

    write_csv_rows(args.output, PAGE_HEADERS, output_rows)
    print(f"Generated {len(output_rows)} page rows into {args.output}")


if __name__ == "__main__":
    main()
