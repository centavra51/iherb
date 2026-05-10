import csv
import html
import json
from pathlib import Path

from pipeline_utils import clean, slugify


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
            f"Подборка по теме «{keyword}» с понятным объяснением, что сравнивать перед выбором добавки."
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
    intro = clean(row.get("intro", ""))
    if intro:
        return (
            f"{intro} Подборка по теме «{keyword}» помогает быстрее понять, какие варианты стоит сравнить "
            "в первую очередь и на какие характеристики смотреть перед покупкой."
        )

    return (
        f"Подборка по теме «{keyword}» помогает быстрее отсеять неподходящие варианты и перейти к тем добавкам, "
        "которые удобнее сравнивать по форме, дозировке и составу."
    )


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
                "acceptedAnswer": {"@type": "Answer", "text": answer},
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
                {"@type": "ListItem", "position": 1, "name": "Главная", "item": SITE_URL},
                {"@type": "ListItem", "position": 2, "name": clean(row["category"]), "item": SITE_URL},
                {"@type": "ListItem", "position": 3, "name": clean(row["keyword"]), "item": canonical_url},
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
  <title>Подборки добавок | iherbs.com.md</title>
  <meta name="description" content="Каталог подборок по витаминам, минералам, пробиотикам и другим популярным добавкам.">
  <link rel="stylesheet" href="./assets/programmatic.css">
</head>
<body>
  <header class="page-header">
    <div class="wrap topbar">
      <a class="brand" href="../index.html">iherbs.com.md</a>
      <nav class="topnav">
        <a href="../index.html">Главная</a>
        <a href="./sitemap.xml">Sitemap</a>
      </nav>
    </div>
  </header>
  <main class="wrap">
    <article class="page">
      <section class="hero">
        <p class="eyebrow">Витрина добавок</p>
        <h1>Каталог подборок по популярным витаминам, минералам и БАДам</h1>
        <p class="lead">Ниже собраны страницы по востребованным темам: магний, омега-3, витамин D3, пробиотики, коллаген, железо, цинк и другие категории, которые удобно развивать под партнерские офферы.</p>
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
    items = [f"<url><loc>{SITE_URL}</loc></url>"]
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
