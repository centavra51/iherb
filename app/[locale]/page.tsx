import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductShelf } from "../../components/product-shelf";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { getCuratedCards, homeSections } from "../../lib/curated-products";
import { defaultLocale, getLocalePath, isLocale, locales, type Locale } from "../../lib/i18n";
import { getLocalizedSeoPages } from "../../lib/localized-seo";
import { siteConfig } from "../../lib/site";

type Params = { locale: string };

const copy = {
  ru: {
    title: "Подборки витаминов и добавок",
    description:
      "Понятный каталог витаминов, минералов и добавок с короткими описаниями, карточками товаров и быстрым переходом на iHerb.",
    eyebrow: "Витамины и добавки",
    heroTitle: "Простой сайт о витаминах и БАДах, где легко выбрать нужную тему",
    heroText:
      "На сайте собраны популярные подборки: магний, омега-3, витамин D3, пробиотики, коллаген, железо, цинк и другие темы. На каждой странице есть краткое объяснение и быстрый переход к товарам на iHerb.",
    heroPrimary: "Смотреть подборки",
    heroSecondary: "Перейти к популярному",
    heroPoints: ["Короткие объяснения", "Фото товаров", "Быстрые кнопки покупки"],
    curatedTitle: "Популярные темы",
    curatedCountSuffix: "подборок",
    sectionPages: "Подходящие подборки",
    allPagesTitle: "Все подборки",
    pageTagSuffix: "подборка",
    openPage: "Подробнее",
    buyNow: "Купить"
  },
  ro: {
    title: "Selectii de vitamine si suplimente",
    description:
      "Catalog clar de vitamine, minerale si suplimente, cu explicatii scurte, carduri de produse si acces rapid spre iHerb.",
    eyebrow: "Vitamine si suplimente",
    heroTitle: "Un site simplu despre vitamine si suplimente, unde tema potrivita se gaseste usor",
    heroText:
      "Aici sunt adunate selectii populare precum magneziu, omega-3, vitamina D3, probiotice, colagen, fier, zinc si alte teme. Fiecare pagina are o explicatie scurta si trecere rapida spre produse de pe iHerb.",
    heroPrimary: "Vezi selectiile",
    heroSecondary: "Mergi la cele populare",
    heroPoints: ["Explicatii scurte", "Imagini de produs", "Butoane rapide de cumparare"],
    curatedTitle: "Teme populare",
    curatedCountSuffix: "selectii",
    sectionPages: "Selectii potrivite",
    allPagesTitle: "Toate selectiile",
    pageTagSuffix: "selectie",
    openPage: "Detalii",
    buyNow: "Cumpara"
  }
} as const;

function getBuyHref(sourceUrl: string, locale: Locale, slug: string) {
  return sourceUrl.trim() || getLocalePath(locale, slug);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const pageCopy = copy[locale];

  return {
    title: pageCopy.title,
    description: pageCopy.description,
    alternates: {
      canonical: getLocalePath(locale),
      languages: {
        ru: getLocalePath("ru"),
        ro: getLocalePath("ro"),
        "x-default": getLocalePath(defaultLocale)
      }
    },
    openGraph: {
      title: pageCopy.title,
      description: pageCopy.description,
      url: `${siteConfig.url}${getLocalePath(locale)}`,
      locale: locale === "ru" ? "ru_RU" : "ro_RO"
    }
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const pageCopy = copy[locale];
  const pages = getLocalizedSeoPages(locale);
  const featuredPages = pages.slice(0, 3);
  const featuredBuyHref = featuredPages[0]
    ? getBuyHref(featuredPages[0].sourceUrl, locale, featuredPages[0].slug)
    : "#seo-pages";
  const featuredIsExternal = featuredPages[0]?.sourceUrl.trim().startsWith("http");

  return (
    <main className="site-root">
      <SiteHeader locale={locale} />

      <section className="home-hero">
        <div className="shell">
          <div className="home-hero-card">
            <div className="home-hero-copy">
              <p className="eyebrow">{pageCopy.eyebrow}</p>
              <h1>{pageCopy.heroTitle}</h1>
              <p className="hero-text">{pageCopy.heroText}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#seo-pages">
                  {pageCopy.heroPrimary}
                </a>
                <a
                  className="button button-light"
                  href={featuredBuyHref}
                  {...(featuredIsExternal
                    ? { target: "_blank", rel: "nofollow sponsored noopener noreferrer" }
                    : {})}
                >
                  {pageCopy.heroSecondary}
                </a>
              </div>
              <div className="hero-points">
                {pageCopy.heroPoints.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="home-hero-showcase" aria-label="Popular supplement topics">
              {featuredPages.map((page) => (
                <article className="showcase-card" key={page.slug}>
                  <div className="showcase-card-media">
                    {page.imageUrl ? (
                      <Image src={page.imageUrl} alt={page.h1} fill sizes="(max-width: 980px) 100vw, 220px" />
                    ) : (
                      <div className="image-fallback">
                        <span>{page.keyword}</span>
                      </div>
                    )}
                  </div>
                  <div className="showcase-card-copy">
                    <strong>{page.keyword}</strong>
                    <span>{page.category}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {homeSections.map((section) => {
        const sectionPages = section.pageSlugs
          .map((slug) => pages.find((page) => page.slug === slug))
          .filter((page): page is NonNullable<(typeof pages)[number]> => Boolean(page));
        const cards = getCuratedCards(section.cardIds);

        return (
          <section className="audience-section" id={section.id} key={section.id}>
            <div className="shell audience-shell">
              <div className="section-head">
                <div>
                  <h2>{section.title[locale]}</h2>
                  <p className="section-note">{section.description[locale]}</p>
                </div>
              </div>

              <div className="audience-links">
                {sectionPages.map((page) => (
                  <Link href={getLocalePath(locale, page.slug)} key={page.slug} className="audience-link-card">
                    <strong>{page.h1}</strong>
                    <span>{pageCopy.openPage}</span>
                  </Link>
                ))}
              </div>

              <ProductShelf cards={cards} locale={locale} />
            </div>
          </section>
        );
      })}

      <section className="seo-section" id="seo-pages">
        <div className="shell">
          <div className="section-head">
            <h2>{pageCopy.allPagesTitle}</h2>
            <span>
              {pages.length} {pageCopy.curatedCountSuffix}
            </span>
          </div>

          <div className="seo-grid">
            {pages.map((page) => {
              const buyHref = getBuyHref(page.sourceUrl, locale, page.slug);
              const isExternal = page.sourceUrl.trim().startsWith("http");

              return (
                <article key={page.slug} className="seo-card">
                  <div className="seo-card-media">
                    {page.imageUrl ? (
                      <Image src={page.imageUrl} alt={page.h1} fill sizes="(max-width: 980px) 100vw, 560px" />
                    ) : (
                      <div className="image-fallback">
                        <span>{page.keyword}</span>
                      </div>
                    )}
                  </div>
                  <p className="seo-card-tag">
                    {page.category} · {pageCopy.pageTagSuffix}
                  </p>
                  <h3>{page.h1}</h3>
                  <p>{page.intro}</p>
                  <div className="card-actions">
                    <a
                      href={buyHref}
                      className="button button-primary"
                      {...(isExternal
                        ? { target: "_blank", rel: "nofollow sponsored noopener noreferrer" }
                        : {})}
                    >
                      {pageCopy.buyNow}
                    </a>
                    <Link href={getLocalePath(locale, page.slug)} className="button button-secondary">
                      {pageCopy.openPage}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
