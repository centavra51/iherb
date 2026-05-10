import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoHero } from "../../../components/seo-hero";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { getLocalePath, isLocale, locales, type Locale } from "../../../lib/i18n";
import { getLocalizedRelatedPages, getLocalizedSeoPageBySlug, getLocalizedSeoPages } from "../../../lib/localized-seo";
import { siteConfig } from "../../../lib/site";

type Params = { locale: string; slug: string };

const copy = {
  ru: {
    home: "Главная",
    pages: "Подборки",
    selection: "Подборка",
    comparison: "Сравнение",
    comparisonText:
      "Помогает быстро оценить форму выпуска, дозировку и дополнительные компоненты.",
    faq: "FAQ",
    faqText:
      "Закрывает частые вопросы перед покупкой и экономит время на поиске базовой информации.",
    navigation: "Навигация",
    navigationText:
      "Есть переходы на соседние подборки, чтобы человек мог сравнить близкие категории.",
    shortTopic: "Кратко по теме",
    shortTopicSuffix:
      "Подборка по теме помогает быстрее отсечь неподходящие варианты и сосредоточиться на тех формулах, которые подходят под задачу и привычный формат приема.",
    chooseTitle: "Что важно учитывать при выборе",
    fitTitle: "Кому обычно подходит эта категория",
    fitText:
      "Такие подборки полезны тем, кто уже понимает задачу и хочет сравнить несколько популярных решений без перегруза медицинскими терминами. Это удобный формат для первого знакомства с категорией, быстрого сравнения и перехода к конкретному продукту.",
    compareTitle: "Что удобно сравнить",
    compareItems: [
      "Форму выпуска и размер порции",
      "Дозировку активного компонента",
      "Наличие дополнительных ингредиентов",
      "Количество порций в упаковке",
      "Удобство ежедневного приема"
    ],
    usefulTitle: "Полезно знать перед покупкой",
    quickFacts: "Быстрые ориентиры",
    topic: "Тема",
    category: "Категория",
    focus: "Фокус",
    focusText: "популярные добавки для понятной повседневной задачи",
    format: "Формат",
    formatText: "подборка с пояснениями, FAQ и переходами на близкие темы",
    imageTitle: "Изображение категории",
    imageText:
      "Визуальный блок поддерживает страницу и помогает быстрее считать тему подборки еще до перехода к карточкам товаров.",
    relatedTitle: "Соседние подборки"
  },
  ro: {
    home: "Acasa",
    pages: "Selectii",
    selection: "Selectie",
    comparison: "Comparatie",
    comparisonText:
      "Ajuta la compararea rapida a formatului, dozei si componentelor suplimentare din formula.",
    faq: "FAQ",
    faqText:
      "Acopera intrebarile frecvente dinaintea comenzii si economiseste timp la cautarea informatiilor de baza.",
    navigation: "Navigatie",
    navigationText:
      "Include legaturi spre pagini apropiate pentru a compara mai usor categorii similare.",
    shortTopic: "Pe scurt despre tema",
    shortTopicSuffix:
      "Aceasta selectie ajuta la eliminarea rapida a variantelor nepotrivite si la concentrarea pe formulele care au sens pentru scopul si formatul dorit.",
    chooseTitle: "Ce este important la alegere",
    fitTitle: "Pentru cine este utila aceasta categorie",
    fitText:
      "Astfel de pagini sunt utile celor care stiu deja ce cauta si vor sa compare cateva optiuni populare fara informatie medicala prea incarcata. Este un format comod pentru prima orientare si pentru trecerea rapida catre produs.",
    compareTitle: "Ce este comod sa compari",
    compareItems: [
      "Forma produsului si dimensiunea portiei",
      "Doza ingredientului activ",
      "Prezenta ingredientelor suplimentare",
      "Numarul de portii din ambalaj",
      "Confortul administrarii zilnice"
    ],
    usefulTitle: "Util de stiut inainte de comanda",
    quickFacts: "Repere rapide",
    topic: "Tema",
    category: "Categorie",
    focus: "Focus",
    focusText: "suplimente populare pentru o nevoie cotidiana explicata clar",
    format: "Format",
    formatText: "selectie cu explicatii, FAQ si trimiteri spre teme apropiate",
    imageTitle: "Imaginea categoriei",
    imageText:
      "Blocul vizual sustine pagina si ajuta la intelegerea rapida a temei inainte de trecerea catre produse.",
    relatedTitle: "Selectii apropiate"
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

export default async function SeoPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const page = getLocalizedSeoPageBySlug(slug, locale);
  if (!page) notFound();

  const pageCopy = copy[locale];
  const relatedPages = getLocalizedRelatedPages(page, locale);
  const schema = buildSchema(page, locale);

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

          <section className="trust-strip">
            <article className="trust-card">
              <strong>{pageCopy.selection}</strong>
              <span>{page.intro}</span>
            </article>
            <article className="trust-card">
              <strong>{pageCopy.comparison}</strong>
              <span>{pageCopy.comparisonText}</span>
            </article>
            <article className="trust-card">
              <strong>{pageCopy.faq}</strong>
              <span>{pageCopy.faqText}</span>
            </article>
            <article className="trust-card">
              <strong>{pageCopy.navigation}</strong>
              <span>{pageCopy.navigationText}</span>
            </article>
          </section>

          <section className="content-grid">
            <div className="main-column">
              <section className="card">
                <h2>{pageCopy.shortTopic}</h2>
                <p>
                  {page.intro} {pageCopy.shortTopicSuffix}
                </p>
              </section>

              <section className="card">
                <h2>{pageCopy.chooseTitle}</h2>
                <div className="benefit-list">
                  {page.benefits.map((benefit) => (
                    <div key={benefit} className="benefit">
                      {benefit}
                    </div>
                  ))}
                </div>
                <p>{page.howToChoose}</p>
              </section>

              <section className="card split-card">
                <div>
                  <h2>{pageCopy.fitTitle}</h2>
                  <p>{pageCopy.fitText}</p>
                </div>
                <div className="mini-panel">
                  <h3>{pageCopy.compareTitle}</h3>
                  <ul>
                    {pageCopy.compareItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="card">
                <h2>{pageCopy.faq}</h2>
                {page.faq.map((item) => (
                  <div className="faq-item" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </section>

              {page.richContent.length > 0 && (
                <section className="card">
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
            </div>

            <aside className="sidebar">
              <section className="card">
                <h2>{pageCopy.quickFacts}</h2>
                <ul className="meta-list">
                  <li>
                    <strong>{pageCopy.topic}:</strong> {page.keyword}
                  </li>
                  <li>
                    <strong>{pageCopy.category}:</strong> {page.category}
                  </li>
                  <li>
                    <strong>{pageCopy.focus}:</strong> {pageCopy.focusText}
                  </li>
                  <li>
                    <strong>{pageCopy.format}:</strong> {pageCopy.formatText}
                  </li>
                </ul>
              </section>

              <section className="card">
                <h2>{pageCopy.imageTitle}</h2>
                <div className="sidebar-image">
                  <div className="sidebar-image-frame">
                    {page.imageUrl ? (
                      <img src={page.imageUrl} alt={page.keyword} />
                    ) : (
                      <div className="image-fallback">
                        <span>{page.keyword}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="sidebar-note">{pageCopy.imageText}</p>
              </section>

              <section className="card">
                <h2>{pageCopy.relatedTitle}</h2>
                <div className="related-links">
                  {relatedPages.map((item) => (
                    <Link href={getLocalePath(locale, item.slug)} key={item.slug}>
                      {item.h1}
                    </Link>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        </article>
      </div>

      <SiteFooter locale={locale} />
    </main>
  );
}
