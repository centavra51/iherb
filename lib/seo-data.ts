import fs from "node:fs";
import path from "node:path";
import { parseRichText, slugifyCyrillic, type RichBlock } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export type SeoPage = {
  slug: string;
  keyword: string;
  category: string;
  intent: string;
  pageType: string;
  entityType: string;
  entityName: string;
  clusterLabel: string;
  source: string;
  sourceUrl: string;
  impressions: string;
  clicks: string;
  ctr: string;
  position: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  benefits: string[];
  howToChoose: string;
  faq: { question: string; answer: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
  imageUrl: string;
  status: string;
  bodyMd: string;
  richContent: RichBlock[];
};

const DATA_FILE = path.join(process.cwd(), "data", "keywords.csv");
const PUBLISHABLE_STATUSES = new Set(["", "ready", "published", "publish"]);

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(current);
      current = "";
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

function readRawRows(): Record<string, string>[] {
  const file = fs.readFileSync(DATA_FILE, "utf8").replace(/^\uFEFF/, "");
  const [headerRow, ...dataRows] = parseCsv(file);

  return dataRows.map((cells) => {
    const record: Record<string, string> = {};
    headerRow.forEach((header, index) => {
      record[clean(header)] = clean(cells[index]);
    });
    return record;
  });
}

export function getSeoPages(): SeoPage[] {
  return readRawRows()
    .filter((row) => PUBLISHABLE_STATUSES.has(clean(row.status).toLowerCase()))
    .filter((row) => clean(row.keyword))
    .map((row) => ({
      slug: clean(row.slug) || slugifyCyrillic(clean(row.keyword)),
      keyword: clean(row.keyword),
      category: clean(row.category),
      intent: clean(row.intent),
      pageType: clean(row.page_type),
      entityType: clean(row.entity_type),
      entityName: clean(row.entity_name),
      clusterLabel: clean(row.cluster_label),
      source: clean(row.source),
      sourceUrl: clean(row.source_url),
      impressions: clean(row.impressions),
      clicks: clean(row.clicks),
      ctr: clean(row.ctr),
      position: clean(row.position),
      title: clean(row.title) || `${clean(row.keyword)} | ${siteConfig.name}`,
      metaDescription:
        clean(row.meta_description) ||
        `Подборка и SEO-страница по запросу «${clean(row.keyword)}» для сайта ${siteConfig.name}.`,
      h1: clean(row.h1) || clean(row.keyword),
      intro: clean(row.intro),
      benefits: clean(row.benefits).split("|").map(clean).filter(Boolean),
      howToChoose: clean(row.how_to_choose),
      faq: [
        { question: clean(row.faq_q1), answer: clean(row.faq_a1) },
        { question: clean(row.faq_q2), answer: clean(row.faq_a2) },
        { question: clean(row.faq_q3), answer: clean(row.faq_a3) }
      ].filter((item) => item.question && item.answer),
      ctaPrimary: clean(row.cta_primary),
      ctaSecondary: clean(row.cta_secondary),
      imageUrl: clean(row.image_url),
      status: clean(row.status),
      bodyMd: clean(row.body_md),
      richContent: parseRichText(clean(row.body_md))
    }));
}

export function getSeoPageBySlug(slug: string): SeoPage | undefined {
  return getSeoPages().find((page) => page.slug === slug);
}

export function getRelatedPages(page: SeoPage, limit = 4): SeoPage[] {
  const allPages = getSeoPages();
  const sameCategory = allPages.filter(
    (item) => item.slug !== page.slug && item.category === page.category
  );

  return (sameCategory.length > 0
    ? sameCategory
    : allPages.filter((item) => item.slug !== page.slug)
  ).slice(0, limit);
}
