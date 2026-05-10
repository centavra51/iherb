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
    title: "Подборки витаминов и БАДов",
    description:
      "Русскоязычные подборки витаминов, минералов и БАДов с отдельными SEO-страницами, понятной навигацией и правильными языковыми альтернативами.",
    promoPill: "Подборки под спрос",
    promoText:
      "Витамины, минералы и БАДы с понятными текстами под будущие партнерские офферы",
    promoLink: "Смотреть подборки",
    eyebrow: "Витрина добавок",
    heroTitle:
      "Подборки популярных витаминов и БАДов, которые легко превратить в рабочие SEO-страницы",
    heroText:
      "Здесь собраны темы, по которым люди действительно ищут решения: магний для сна, омега-3, витамин D3, пробиотики, коллаген, железо и другие востребованные добавки. У каждой страницы есть понятное объяснение, кому подходит категория, что сравнивать в составе и какие форматы чаще выбирают для ежедневного приема.",
    heroPrimary: "Открыть страницы",
    heroSecondary: "Посмотреть категории",
    topDirections: "Топ-направления",
    topDirectionsValue: "Магний, омега-3, D3",
    dailyDemand: "Повседневный спрос",
    dailyDemandValue: "Пробиотики, железо, цинк",
    guideTitle: "Контент уже собран так, чтобы человеку было проще выбрать добавку, а вам проще встроить оффер",
    guideText:
      "Вместо технических заглушек сайт получает нормальный редакционный тон: короткий ответ по теме, критерии выбора, FAQ и перелинковку на близкие подборки.",
    guideCards: [
      "Популярные категории",
      "Понятные критерии выбора",
      "Мягкий экспертный тон",
      "Готово под партнерские ссылки"
    ],
    pagesTitle: "Готовые страницы-подборки",
    pagesCountSuffix: "опубликованных тем",
    pageTagSuffix: "подборка",
    openPage: "Открыть страницу",
    categoriesTitle: "Основные направления витрины",
    categories: ["Минералы", "Витамины", "Жирные кислоты", "Пробиотики и коллаген"],
    signupTitle: "Витрина уже подготовлена под популярные запросы о витаминах и БАДах",
    signupText:
      "Дальше можно подставлять карточки товаров, партнерские ссылки, цены, отзывы и отдельные блоки с акциями, не переписывая каждый URL с нуля.",
    signupPlaceholder: "Подборки под витамины и БАДы",
    signupButton: "Перейти к страницам"
  },
  ro: {
    title: "Selectii de vitamine si suplimente",
    description:
      "Pagini in romana pentru vitamine, minerale si suplimente, cu URL-uri separate pe limbi, hreflang corect si structura pregatita pentru SEO.",
    promoPill: "Selectii pentru cerere",
    promoText:
      "Vitamine, minerale si suplimente cu texte clare pentru viitoare oferte partenere",
    promoLink: "Vezi selectiile",
    eyebrow: "Vitrina de suplimente",
    heroTitle:
      "Selectii pentru vitamine si suplimente populare, construite ca pagini SEO clare in romana",
    heroText:
      "Aici sunt grupate teme pe care utilizatorii le cauta constant: magneziu pentru somn, omega-3, vitamina D3, probiotice, colagen, fier si alte suplimente populare. Fiecare pagina are explicatii clare, criterii de comparatie, intrebari frecvente si legaturi interne catre teme apropiate.",
    heroPrimary: "Deschide paginile",
    heroSecondary: "Vezi categoriile",
    topDirections: "Directii populare",
    topDirectionsValue: "Magneziu, omega-3, D3",
    dailyDemand: "Cerere constanta",
    dailyDemandValue: "Probiotice, fier, zinc",
    guideTitle:
      "Continutul este structurat astfel incat utilizatorului sa-i fie mai simplu sa aleaga, iar site-ului sa-i fie mai usor sa creasca SEO",
    guideText:
      "In locul unor pagini seci, site-ul primeste un ton editorial normal: raspuns scurt pe subiect, criterii de alegere, FAQ si legaturi interne spre selectii apropiate.",
    guideCards: [
      "Categorii cautate",
      "Criterii clare de alegere",
      "Ton util si usor de citit",
      "Pregatit pentru oferte partenere"
    ],
    pagesTitle: "Pagini gata publicate",
    pagesCountSuffix: "teme publicate",
    pageTagSuffix: "selectie",
    openPage: "Deschide pagina",
    categoriesTitle: "Directiile principale ale vitrinei",
    categories: ["Minerale", "Vitamine", "Acizi grasi", "Probiotice si colagen"],
    signupTitle: "Vitrina este deja pregatita pentru cautari populare despre vitamine si suplimente",
    signupText:
      "Mai departe poti adauga produse, linkuri partenere, preturi, recenzii si blocuri promotionale fara sa reconstruiesti fiecare pagina de la zero.",
    signupPlaceholder: "Selectii pentru vitamine si suplimente",
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

      <section className="guarantee" id="guide">
        <div className="shell guarantee-grid">
          <div className="guarantee-title">
            <h2>{pageCopy.guideTitle}</h2>
            <p>{pageCopy.guideText}</p>
          </div>
          {pageCopy.guideCards.map((item, index) => (
            <article className="icon-card" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </article>
          ))}
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
