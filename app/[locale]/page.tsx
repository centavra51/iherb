import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { defaultLocale, getLocalePath, isLocale, locales, type Locale } from "../../lib/i18n";
import { getLocalizedSeoPages } from "../../lib/localized-seo";
import { siteConfig } from "../../lib/site";

type Params = { locale: string };

const copy = {
  ru: {
    title: "Подборки витаминов и добавок",
    description:
      "Русскоязычные подборки витаминов, минералов и добавок с понятными описаниями, удобной навигацией и отдельными страницами по популярным темам.",
    eyebrow: "Витамины и добавки",
    heroTitle: "Простой каталог витаминов и БАДов с понятными карточками и кнопкой покупки",
    heroText:
      "На сайте собраны популярные темы: магний, омега-3, витамин D3, пробиотики, коллаген, железо, цинк и другие добавки. Сразу видно изображение, короткое описание и куда перейти для покупки.",
    heroPrimary: "Открыть каталог",
    heroSecondary: "Купить популярное",
    heroPoints: [
      "Фото товаров и категорий",
      "Короткие и понятные описания",
      "Быстрый переход к покупке"
    ],
    pagesTitle: "Готовые подборки",
    pagesCountSuffix: "опубликованных тем",
    pageTagSuffix: "подборка",
    openPage: "Подробнее",
    buyNow: "Купить",
    quickNote: "Только главное: фото, короткое описание и быстрая кнопка перехода."
  },
  ro: {
    title: "Selectii de vitamine si suplimente",
    description:
      "Pagini in romana despre vitamine, minerale si suplimente, cu descrieri clare, navigatie usoara si explicatii utile pentru alegere.",
    eyebrow: "Vitamine si suplimente",
    heroTitle: "Catalog simplu de vitamine si suplimente, cu carduri clare si buton de cumparare",
    heroText:
      "Sunt grupate teme populare precum magneziu, omega-3, vitamina D3, probiotice, colagen, fier, zinc si alte suplimente. Utilizatorul vede imediat imaginea, explicatia scurta si locul de unde poate cumpara.",
    heroPrimary: "Deschide catalogul",
    heroSecondary: "Cumpara rapid",
    heroPoints: [
      "Imagini relevante ale produselor",
      "Texte scurte si usor de parcurs",
      "Acces rapid spre cumparare"
    ],
    pagesTitle: "Selectii publicate",
    pagesCountSuffix: "teme publicate",
    pageTagSuffix: "selectie",
    openPage: "Detalii",
    buyNow: "Cumpara",
    quickNote: "Doar esentialul: imagine, descriere scurta si buton rapid de acces."
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
                      <Image src={page.imageUrl} alt={page.h1} fill sizes="(max-width: 980px) 100vw, 200px" />
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

      <section className="seo-section" id="seo-pages">
        <div className="shell">
          <div className="section-head">
            <h2>{pageCopy.pagesTitle}</h2>
            <span>
              {pages.length} {pageCopy.pagesCountSuffix}
            </span>
          </div>
          <p className="section-note">{pageCopy.quickNote}</p>

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
