import itertools

from pipeline_utils import DATA_DIR, IDEA_HEADERS, load_seed_terms, slugify, write_csv_rows


OUTPUT_FILE = DATA_DIR / "generated_keyword_ideas.csv"


def add_rows(rows: list[dict[str, str]], keywords: list[tuple[str, str, str, str]]) -> None:
    for keyword, page_type, entity_type, entity_name in keywords:
        rows.append(
            {
                "keyword": keyword,
                "slug": slugify(keyword),
                "category": "",
                "intent": "",
                "page_type": page_type,
                "entity_type": entity_type,
                "entity_name": entity_name,
                "cluster_label": f"{page_type}:{slugify(entity_name)}",
                "source": "seed_generator",
                "source_url": "",
                "impressions": "",
                "clicks": "",
                "ctr": "",
                "position": "",
            }
        )


def main() -> None:
    seeds = load_seed_terms()
    ingredients = seeds.get("ingredients") or seeds.get("products", [])
    audiences = seeds.get("audiences", [])
    symptoms = seeds.get("symptoms", []) or seeds.get("benefits", [])
    form_factors = seeds.get("form_factors") or seeds.get("formats", [])
    brands = seeds.get("brands", [])

    rows: list[dict[str, str]] = []

    add_rows(
        rows,
        [
            (f"{ingredient} {audience}", "audience", "audience", audience)
            for ingredient, audience in itertools.product(ingredients, audiences)
        ],
    )
    add_rows(
        rows,
        [
            (f"{ingredient} {symptom}", "symptom", "symptom", symptom)
            for ingredient, symptom in itertools.product(ingredients, symptoms)
        ],
    )
    add_rows(
        rows,
        [
            (f"{ingredient} {form_factor}", "form_factor", "form_factor", form_factor)
            for ingredient, form_factor in itertools.product(ingredients, form_factors)
        ],
    )
    add_rows(rows, [(ingredient, "ingredient", "ingredient", ingredient) for ingredient in ingredients])
    add_rows(rows, [(brand, "brand", "brand", brand) for brand in brands])
    add_rows(
        rows,
        [
            (f"{brand} {ingredient}", "brand", "brand", brand)
            for brand, ingredient in itertools.product(brands, ingredients)
        ],
    )

    unique_rows: list[dict[str, str]] = []
    seen: set[str] = set()
    for row in rows:
        slug = row["slug"]
        if slug in seen:
            continue
        seen.add(slug)
        unique_rows.append(row)

    write_csv_rows(OUTPUT_FILE, IDEA_HEADERS, unique_rows)
    print(f"Generated {len(unique_rows)} keyword ideas into {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
