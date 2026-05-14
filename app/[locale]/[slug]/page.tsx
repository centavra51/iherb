import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductShelf } from "../../../components/product-shelf";
import { SeoHero } from "../../../components/seo-hero";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { getCardsForPage } from "../../../lib/curated-products";
import { getLocalePath, isLocale, locales, type Locale } from "../../../lib/i18n";
import {
  getLocalizedRelatedPages,
  getLocalizedSeoPageBySlug,
  getLocalizedSeoPages
} from "../../../lib/localized-seo";
import { siteConfig } from "../../../lib/site";

type Params = { locale: string; slug: string };

const copy = {
  ru: {
    home: "Главная",
    pages: "Подборки",
    buyNow: "Купить сейчас",
    seeTips: "Что проверить перед покупкой",
    buyTitle: "Быстрый переход к покупке",
    buyText:
      "Если тема уже понятна, можно сразу открыть товары на iHerb. Ниже есть короткие подсказки по выбору и несколько подходящих вариантов.",
    productsTitle: "Что можно посмотреть на iHerb",
    compareTitle: "Что проверить перед покупкой",
    compareLead: "Чтобы не запутаться, обычно достаточно сравнить несколько базовых пунктов:",
    fitTitle: "Кому может подойти",
    fitText:
      "Эта подборка подходит тем, кто хочет быстро понять различия между популярными вариантами и выбрать удобный формат без лишней информации.",
    chooseTitle: "Как выбрать проще",
    faq: "Частые вопросы",
    usefulTitle: "Полезно знать",
    relatedTitle: "Похожие подборки",
    compareMore: "Посмотреть похожие варианты",
    fallbackBuy: "Открыть все подборки"
  },
  ro: {
    home: "Acasa",
    pages: "Selectii",
    buyNow: "Cumpara acum",
    seeTips: "Ce sa verifici inainte de comanda",
    buyTitle: "Trecere rapida spre cumparare",
    buyText:
      "Daca tema este deja clara, poti deschide imediat produsele de pe iHerb. Mai jos sunt cateva repere scurte si variante relevante.",
    productsTitle: "Ce poti vedea pe iHerb",
    compareTitle: "Ce sa verifici inainte de comanda",
    compareLead: "Ca sa nu te incurci, de obicei este suficient sa compari cateva lucruri de baza:",
    fitTitle: "Pentru cine poate fi potrivita",
    fitText:
      "Aceasta selectie este utila celor care vor sa inteleaga rapid diferentele dintre variantele populare si sa aleaga un format comod fara informatie inutila.",
    chooseTitle: "Cum alegi mai simplu",
    faq: "Intrebari frecvente",
    usefulTitle: "Util de stiut",
    relatedTitle: "Selectii similare",
    compareMore: "Vezi variante similare",
    fallbackBuy: "Deschide toate selectiile"
  }
} as const;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getLocalizedSeoPages(locale).map((page) => ({ locale, slug: page.slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};

  const locale: Locale = rawLocale;
  const page = getLocalizedSeoPageBySlug(slug, locale);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: getLocalePath(locale, page.slug),
      languages: {
        ru: getLocalePath("ru", page.slug),
        ro: getLocalePath("ro", page.slug),
        "x-default": getLocalePath("ru", page.slug)
      }
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `${siteConfig.url}${getLocalePath(locale, page.slug)}`,
      images: page.imageUrl ? [{ url: page.imageUrl }] : undefined,
      locale: locale === "ru" ? "ru_RU" : "ro_RO"
    }
  };
}

function buildSchema(page: NonNullable<ReturnType<typeof getLocalizedSeoPageBySlug>>, locale: Locale) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      url: `${siteConfig.url}${getLocalePath(locale, page.slug)}`,
      description: page.metaDescription,
      inLanguage: locale
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer }
      }))
    }
  ];
}

function getBuyHref(page: NonNullable<ReturnType<typeof getLocalizedSeoPageBySlug>>, locale: Locale) {
  const sourceUrl = page.sourceUrl.trim();
  if (sourceUrl) {
    return sourceUrl;
  }

  return `${getLocalePath(locale)}#seo-pages`;
}

export default async function SeoPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const page = getLocalizedSeoPageBySlug(slug, locale);
  if (!page) notFound();

  const pageCopy = copy[locale];
  const relatedPages = getLocalizedRelatedPages(page, locale);
  const schema = buildSchema(page, locale);
  const buyHref = getBuyHref(page, locale);
  const isExternalBuy = buyHref.startsWith("http://") || buyHref.startsWith("https://");
  const curatedCards = getCardsForPage(page.slug, page.sourceUrl, page.imageUrl);

  return (
    <main className="programmatic-root">
      <SiteHeader compact locale={locale} slug={page.slug} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link href={getLocalePath(locale)}>{pageCopy.home}</Link>
          <span>/</span>
          <Link href={`${getLocalePath(locale)}#seo-pages`}>{pageCopy.pages}</Link>
          <span>/</span>
          <span>{page.keyword}</span>
        </nav>

        <article className="page">
          <SeoHero page={page} locale={locale} />

          <section className="buy-banner">
            <div>
              <h2>{pageCopy.buyTitle}</h2>
              <p>{pageCopy.buyText}</p>
            </div>
            <div className="buy-banner-actions">
              <a
                className="button button-primary buy-button"
                href={buyHref}
                {...(isExternalBuy
                  ? { target: "_blank", rel: "nofollow sponsored noopener noreferrer" }
                  : {})}
              >
                {pageCopy.buyNow}
              </a>
              <a className="button button-secondary" href="#compare">
                {pageCopy.seeTips}
              </a>
            </div>
          </section>

          <section className="card compact-card">
            <h2>{pageCopy.productsTitle}</h2>
            <ProductShelf cards={curatedCards} locale={locale} />
          </section>

          <section className="simple-grid" id="compare">
            <section className="card">
              <h2>{pageCopy.compareTitle}</h2>
              <p>{pageCopy.compareLead}</p>
              <div className="benefit-list">
                {page.benefits.map((benefit) => (
                  <div key={benefit} className="benefit">
                    {benefit}
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <h2>{pageCopy.fitTitle}</h2>
              <p>{pageCopy.fitText}</p>
              <div className="mini-panel">
                <p>{page.howToChoose}</p>
              </div>
            </section>
          </section>

          <section className="simple-grid">
            <section className="card">
              <h2>{pageCopy.chooseTitle}</h2>
              <ul className="simple-list">
                {page.benefits.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="card">
              <h2>{pageCopy.faq}</h2>
              {page.faq.slice(0, 2).map((item) => (
                <div className="faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </section>
          </section>

          {page.richContent.length > 0 && (
            <section className="card compact-card">
              <h2>{pageCopy.usefulTitle}</h2>
              <div className="rich-content">
                {page.richContent.map((block, index) => {
                  if (block.type === "heading") {
                    return <h3 key={`${block.type}-${index}`}>{block.content}</h3>;
                  }

                  if (block.type === "list") {
                    return (
                      <ul key={`${block.type}-${index}`}>
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    );
                  }

                  return <p key={`${block.type}-${index}`}>{block.content}</p>;
                })}
              </div>
            </section>
          )}

          <section className="card compact-card">
            <div className="section-head">
              <h2>{pageCopy.relatedTitle}</h2>
              {!isExternalBuy && (
                <Link href={`${getLocalePath(locale)}#seo-pages`} className="button button-secondary">
                  {pageCopy.fallbackBuy}
                </Link>
              )}
            </div>
            <div className="related-links related-grid">
              {relatedPages.map((item) => (
                <Link href={getLocalePath(locale, item.slug)} key={item.slug}>
                  {item.h1}
                </Link>
              ))}
            </div>
            {isExternalBuy && (
              <div className="buy-banner-actions secondary-buy-row">
                <a
                  className="button button-primary buy-button"
                  href={buyHref}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                >
                  {pageCopy.buyNow}
                </a>
                <Link href={`${getLocalePath(locale)}#seo-pages`} className="button button-secondary">
                  {pageCopy.compareMore}
                </Link>
              </div>
            )}
          </section>
        </article>
      </div>

      <SiteFooter locale={locale} />
    </main>
  );
}
