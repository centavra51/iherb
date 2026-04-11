import csv
import html
import json
from pathlib import Path

from pipeline_utils import clean, slugify, title_case


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "keywords.csv"
TEMPLATE_FILE = ROOT / "templates" / "page.template.html"
CSS_FILE = ROOT / "templates" / "programmatic.css"
DIST_DIR = ROOT / "dist"
ASSETS_DIR = DIST_DIR / "assets"
SITE_URL = "https://iherbs.com.md/"
PUBLISHABLE_STATUSES = {"", "ready", "published", "publish"}


def read_rows():
    with DATA_FILE.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    filtered = []
    for row in rows:
        status = clean(row.get("status", "")).lower()
        if status not in PUBLISHABLE_STATUSES:
            continue
        normalized = dict(row)
        keyword = clean(normalized.get("keyword", ""))
        normalized["slug"] = clean(normalized.get("slug", "")) or slugify(keyword)
        normalized["h1"] = clean(normalized.get("h1", "")) or keyword
        normalized["title"] = clean(normalized.get("title", "")) or f"{keyword} | iherbs.com.md"
        normalized["meta_description"] = clean(normalized.get("meta_description", "")) or (
            f"Подборка и SEO-страница по запросу «{keyword}» для сайта iherbs.com.md."
        )
        filtered.append(normalized)
    return filtered


def ensure_dirs():
    DIST_DIR.mkdir(exist_ok=True)
    ASSETS_DIR.mkdir(exist_ok=True)


def render_benefits(raw: str) -> str:
    items = [item.strip() for item in clean(raw).split("|") if item.strip()]
    return "\n".join(f'<div class="benefit">{html.escape(item)}</div>' for item in items)


def render_image(image_url: str, alt_text: str, frame_class: str) -> str:
    url = clean(image_url)
    alt = html.escape(alt_text)
    if url:
        escaped_url = html.escape(url, quote=True)
        return (
            f'<div class="{frame_class}">'
            f'<img src="{escaped_url}" alt="{alt}" loading="lazy">'
            f"</div>"
        )
    return (
        f'<div class="{frame_class}">'
        '<div class="image-fallback">'
        f"<span>{alt}</span>"
        "</div>"
        "</div>"
    )


def short_answer(row) -> str:
    keyword = clean(row["keyword"])
    category = clean(row["category"]).lower()
    page_type = clean(row.get("page_type", ""))
    entity_name = clean(row.get("entity_name", "")) or keyword

    type_specific_copy = {
        "brand": (
            f"Страница по бренду «{entity_name}» должна собирать линейки, FAQ, связки на ингредиенты "
            "и навигацию по каталогу."
        ),
        "ingredient": (
            f"Страница по ингредиенту «{entity_name}» лучше работает, когда отдельно раскрывает критерии выбора, "
            "формы выпуска и соседние сценарии применения."
        ),
        "symptom": (
            f"Страница по сценарию «{entity_name}» должна аккуратно объяснять контекст выбора и соседние решения "
            "без медицинских обещаний."
        ),
        "audience": (
            f"Страница под аудиторию «{entity_name}» позволяет показать релевантные критерии выбора, форму приема "
            "и FAQ именно для этого сегмента."
        ),
        "form_factor": (
            f"Страница по форм-фактору «{entity_name}» должна сравнивать удобство приема, маркировку и сценарии "
            "использования конкретной формы выпуска."
        ),
    }

    if page_type in type_specific_copy:
        return (
            f"{type_specific_copy[page_type]} Для кластера «{category}» это помогает точнее совпадать с формулировкой пользователя."
        )

    return (
        f"Если вы продвигаете запрос «{keyword}», лучше всего работает отдельная страница под этот интент: "
        f"с кратким ответом, блоком выбора, FAQ, связанными материалами и понятным CTA. "
        f"Для кластера «{category}» это помогает точнее совпадать с формулировкой пользователя."
    )


def translit_slug_title(slug: str) -> str:
    return title_case(slug.replace("-", " ").strip())


def make_schema(row, canonical_url):
    faq_items = []
    for index in range(1, 4):
        question = clean(row.get(f"faq_q{index}", ""))
        answer = clean(row.get(f"faq_a{index}", ""))
        if not question or not answer:
            continue
        faq_items.append(
            {
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answer,
                },
            }
        )

    schema = [
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": clean(row["title"]),
            "url": canonical_url,
            "description": clean(row["meta_description"]),
            "inLanguage": "ru",
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Главная",
                    "item": SITE_URL,
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": clean(row["category"]),
                    "item": SITE_URL,
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": clean(row["keyword"]),
                    "item": canonical_url,
                },
            ],
        },
    ]
    if faq_items:
        schema.append(
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faq_items,
            }
        )
    return json.dumps(schema, ensure_ascii=False)


def related_links(rows, current_row):
    same_category = [
        row for row in rows if row["slug"] != current_row["slug"] and row["category"] == current_row["category"]
    ]
    fallback = [row for row in rows if row["slug"] != current_row["slug"]]
    selected = (same_category or fallback)[:4]

    links = []
    for row in selected:
        label = html.escape(clean(row["h1"]))
        href = f"../{clean(row['slug'])}/"
        links.append(f'<a href="{href}">{label}</a>')
    return "\n".join(links)


def render_page(row, rows, template):
    slug = clean(row["slug"])
    canonical_url = f"{SITE_URL}{slug}/"
    replacements = {
        "{{TITLE}}": html.escape(clean(row["title"])),
        "{{META_DESCRIPTION}}": html.escape(clean(row["meta_description"])),
        "{{CANONICAL_URL}}": canonical_url,
        "{{SCHEMA_JSON}}": make_schema(row, canonical_url),
        "{{ASSET_PREFIX}}": "../",
        "{{SITE_ROOT}}": "../",
        "{{CATEGORY}}": html.escape(clean(row["category"])),
        "{{INTENT}}": html.escape(clean(row["intent"])),
        "{{KEYWORD}}": html.escape(clean(row["keyword"])),
        "{{H1}}": html.escape(clean(row["h1"])),
        "{{INTRO}}": html.escape(clean(row["intro"])),
        "{{SHORT_ANSWER}}": html.escape(short_answer(row)),
        "{{BENEFIT_ITEMS}}": render_benefits(row["benefits"]),
        "{{HOW_TO_CHOOSE}}": html.escape(clean(row["how_to_choose"])),
        "{{FAQ_Q1}}": html.escape(clean(row["faq_q1"])),
        "{{FAQ_A1}}": html.escape(clean(row["faq_a1"])),
        "{{FAQ_Q2}}": html.escape(clean(row["faq_q2"])),
        "{{FAQ_A2}}": html.escape(clean(row["faq_a2"])),
        "{{FAQ_Q3}}": html.escape(clean(row["faq_q3"])),
        "{{FAQ_A3}}": html.escape(clean(row["faq_a3"])),
        "{{CTA_PRIMARY}}": html.escape(clean(row["cta_primary"])),
        "{{CTA_SECONDARY}}": html.escape(clean(row["cta_secondary"])),
        "{{RELATED_LINKS}}": related_links(rows, row),
        "{{HERO_IMAGE}}": render_image(row.get("image_url", ""), clean(row["h1"]), "hero-image-frame"),
        "{{SIDEBAR_IMAGE}}": render_image(row.get("image_url", ""), clean(row["keyword"]), "sidebar-image-frame"),
    }

    output = template
    for old, new in replacements.items():
        output = output.replace(old, new)
    return output


def build_hub(rows):
    cards = []
    for row in rows:
        cards.append(
            f"""
            <article class="card">
              <h2><a href="./{html.escape(clean(row['slug']))}/">{html.escape(clean(row['h1']))}</a></h2>
              <p>{html.escape(clean(row['intro']))}</p>
              <p><strong>Категория:</strong> {html.escape(clean(row['category']))}</p>
            </article>
            """
        )

    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SEO Hub | iherbs.com.md</title>
  <meta name="description" content="Карта сгенерированных SEO-страниц для iherbs.com.md">
  <link rel="stylesheet" href="./assets/programmatic.css">
</head>
<body>
  <header class="page-header">
    <div class="wrap topbar">
      <a class="brand" href="../index.html">iherbs.com.md</a>
      <nav class="topnav">
        <a href="../index.html">Лендинг</a>
        <a href="./sitemap.xml">Sitemap</a>
      </nav>
    </div>
  </header>
  <main class="wrap">
    <article class="page">
      <section class="hero">
        <p class="eyebrow">Programmatic SEO</p>
        <h1>Каталог сгенерированных страниц под long-tail запросы</h1>
        <p class="lead">Ниже находится hub-страница, которая помогает быстрее проверить структуру кластера и логически связать ключевые страницы между собой.</p>
      </section>
      <section class="main-column" style="margin-top:20px;">
        {''.join(cards)}
      </section>
    </article>
  </main>
</body>
</html>
"""


def build_sitemap(rows):
    items = []
    items.append(f"<url><loc>{SITE_URL}</loc></url>")
    for row in rows:
        items.append(f"<url><loc>{SITE_URL}{clean(row['slug'])}/</loc></url>")
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(items)
        + "\n</urlset>\n"
    )


def build_robots():
    return f"""User-agent: *
Allow: /

Sitemap: {SITE_URL}sitemap.xml
"""


def main():
    rows = read_rows()
    if not rows:
        raise ValueError("No publishable rows found in data/keywords.csv")
    ensure_dirs()
    template = TEMPLATE_FILE.read_text(encoding="utf-8")
    css = CSS_FILE.read_text(encoding="utf-8")

    (ASSETS_DIR / "programmatic.css").write_text(css, encoding="utf-8")

    for row in rows:
        slug = clean(row["slug"])
        if not slug:
            slug = clean(row["keyword"])
        if not slug:
            continue
        output_dir = DIST_DIR / slug
        output_dir.mkdir(parents=True, exist_ok=True)
        page_html = render_page(row, rows, template)
        (output_dir / "index.html").write_text(page_html, encoding="utf-8")

    (DIST_DIR / "index.html").write_text(build_hub(rows), encoding="utf-8")
    (DIST_DIR / "sitemap.xml").write_text(build_sitemap(rows), encoding="utf-8")
    (DIST_DIR / "robots.txt").write_text(build_robots(), encoding="utf-8")
    print(f"Generated {len(rows)} pages into {DIST_DIR}")


if __name__ == "__main__":
    main()
