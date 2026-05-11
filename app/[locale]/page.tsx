import type { Metadata } from "next";
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
    promoPill: "Популярные подборки",
    promoText:
      "Витамины, минералы и добавки с простыми объяснениями, критериями выбора и частыми вопросами",
    promoLink: "Смотреть подборки",
    eyebrow: "Витамины и добавки",
    heroTitle:
      "Подборки популярных витаминов и добавок с понятными описаниями и удобной навигацией",
    heroText:
      "Здесь собраны темы, по которым люди действительно ищут информацию: магний для сна, омега-3, витамин D3, пробиотики, коллаген, железо и другие популярные добавки. На каждой странице есть краткое объяснение, что сравнивать в составе, кому обычно подходит категория и какие форматы чаще выбирают для ежедневного приема.",
    heroPrimary: "Открыть страницы",
    heroSecondary: "Посмотреть категории",
    topDirections: "Популярные темы",
    topDirectionsValue: "Магний, омега-3, D3",
    dailyDemand: "Часто выбирают",
    dailyDemandValue: "Пробиотики, железо, цинк",
    pagesTitle: "Готовые подборки",
    pagesCountSuffix: "опубликованных тем",
    pageTagSuffix: "подборка",
    openPage: "Открыть страницу",
    categoriesTitle: "Основные категории",
    categories: ["Минералы", "Витамины", "Жирные кислоты", "Пробиотики и коллаген"],
    signupTitle: "Подборки по популярным витаминам и добавкам",
    signupText:
      "Здесь можно быстро перейти к темам, сравнить разные категории и выбрать страницы с более подробным описанием состава, формата и особенностей приема.",
    signupPlaceholder: "Витамины, минералы и добавки",
    signupButton: "Перейти к страницам"
  },
  ro: {
    title: "Selectii de vitamine si suplimente",
    description:
      "Pagini in romana despre vitamine, minerale si suplimente, cu descrieri clare, navigatie usoara si explicatii utile pentru alegere.",
    promoPill: "Selectii populare",
    promoText:
      "Vitamine, minerale si suplimente explicate simplu, cu criterii de alegere si intrebari frecvente",
    promoLink: "Vezi selectiile",
    eyebrow: "Vitamine si suplimente",
    heroTitle:
      "Selectii de vitamine si suplimente populare, cu explicatii clare si navigatie usoara",
    heroText:
      "Aici sunt grupate teme pe care utilizatorii le cauta constant: magneziu pentru somn, omega-3, vitamina D3, probiotice, colagen, fier si alte suplimente populare. Fiecare pagina include explicatii simple, criterii de comparatie, intrebari frecvente si legaturi spre teme apropiate.",
    heroPrimary: "Deschide paginile",
    heroSecondary: "Vezi categoriile",
    topDirections: "Teme populare",
    topDirectionsValue: "Magneziu, omega-3, D3",
    dailyDemand: "Alese frecvent",
    dailyDemandValue: "Probiotice, fier, zinc",
    pagesTitle: "Selectii publicate",
    pagesCountSuffix: "teme publicate",
    pageTagSuffix: "selectie",
    openPage: "Deschide pagina",
    categoriesTitle: "Categorii principale",
    categories: ["Minerale", "Vitamine", "Acizi grasi", "Probiotice si colagen"],
    signupTitle: "Selectii pentru vitamine si suplimente cautate frecvent",
    signupText:
      "Poti deschide rapid temele principale, compara categoriile si merge spre pagini cu explicatii mai detaliate despre compozitie, format si administrare.",
    signupPlaceholder: "Vitamine, minerale si suplimente",
    signupButton: "Mergi la pagini"
  }
} as const;

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

  return (
    <main className="site-root">
      <div className="promo-strip">
        <div className="shell promo-inner">
          <div className="promo-pill">{pageCopy.promoPill}</div>
          <p>{pageCopy.promoText}</p>
          <Link href="#signup">{pageCopy.promoLink}</Link>
        </div>
      </div>

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
                <a className="button button-light" href="#categories">
                  {pageCopy.heroSecondary}
                </a>
              </div>
            </div>

            <div className="home-hero-visual">
              <div className="hero-orb orb-one" />
              <div className="hero-orb orb-two" />
              <div className="hero-product-card card-main">
                <span>{pageCopy.topDirections}</span>
                <strong>{pageCopy.topDirectionsValue}</strong>
              </div>
              <div className="hero-product-card card-side">
                <span>{pageCopy.dailyDemand}</span>
                <strong>{pageCopy.dailyDemandValue}</strong>
              </div>
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

          <div className="seo-grid">
            {pages.map((page) => (
              <article key={page.slug} className="seo-card">
                <p className="seo-card-tag">
                  {page.category} · {pageCopy.pageTagSuffix}
                </p>
                <h3>{page.h1}</h3>
                <p>{page.intro}</p>
                <div className="seo-benefits">
                  {page.benefits.slice(0, 3).map((benefit) => (
                    <span key={benefit}>{benefit}</span>
                  ))}
                </div>
                <Link href={getLocalePath(locale, page.slug)} className="button button-primary">
                  {pageCopy.openPage}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="categories" id="categories">
        <div className="shell">
          <div className="section-head">
            <h2>{pageCopy.categoriesTitle}</h2>
          </div>

          <div className="category-grid">
            {pageCopy.categories.map((item, index) => (
              <article className="category-item" key={item}>
                <div className="category-icon">{String(index + 1).padStart(2, "0")}</div>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="signup" id="signup">
        <div className="shell signup-box">
          <div className="signup-copy">
            <h2>{pageCopy.signupTitle}</h2>
            <p>{pageCopy.signupText}</p>
          </div>
          <div className="signup-form">
            <input placeholder={pageCopy.signupPlaceholder} readOnly />
            <button className="button button-primary" type="button">
              {pageCopy.signupButton}
            </button>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
