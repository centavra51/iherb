import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoHero } from "@/components/seo-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getRelatedPages, getSeoPageBySlug, getSeoPages } from "@/lib/seo-data";
import { siteConfig } from "@/lib/site";

type Params = { slug: string };

export async function generateStaticParams() {
  return getSeoPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}/` },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `/${page.slug}/`,
      images: page.imageUrl ? [{ url: page.imageUrl }] : undefined
    }
  };
}

function buildSchema(page: NonNullable<ReturnType<typeof getSeoPageBySlug>>) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      url: `${siteConfig.url}/${page.slug}/`,
      description: page.metaDescription,
      inLanguage: "ru"
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
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);
  if (!page) notFound();

  const relatedPages = getRelatedPages(page);
  const schema = buildSchema(page);

  return (
    <main className="programmatic-root">
      <SiteHeader compact />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link href="/">Главная</Link>
          <span>/</span>
          <Link href="/#seo-pages">{page.category}</Link>
          <span>/</span>
          <span>{page.keyword}</span>
        </nav>

        <article className="page">
          <SeoHero page={page} />

          <section className="trust-strip">
            <article className="trust-card">
              <strong>1 URL</strong>
              <span>один основной интент без размытия темы</span>
            </article>
            <article className="trust-card">
              <strong>FAQ</strong>
              <span>закрывает микро-вопросы и усиливает полезность</span>
            </article>
            <article className="trust-card">
              <strong>Schema</strong>
              <span>помогает поисковику и нейросетям понять структуру</span>
            </article>
            <article className="trust-card">
              <strong>Links</strong>
              <span>внутренняя перелинковка на похожие страницы кластера</span>
            </article>
          </section>

          <section className="content-grid">
            <div className="main-column">
              <section className="card">
                <h2>Краткий ответ</h2>
                <p>
                  Если вы продвигаете запрос «{page.keyword}», лучше всего работает отдельная страница под этот интент:
                  с кратким ответом, блоком выбора, FAQ, связанными материалами и понятным CTA.
                </p>
              </section>

              <section className="card">
                <h2>Что важно учитывать при выборе</h2>
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
                  <h2>Почему такая страница работает лучше простого шаблона</h2>
                  <p>
                    Сильная programmatic SEO-страница не просто повторяет ключевой запрос. Она собирает полезный
                    контекст: кому подходит тема, какие критерии выбора важны и какие соседние страницы стоит открыть
                    дальше.
                  </p>
                </div>
                <div className="mini-panel">
                  <h3>Идеальный каркас</h3>
                  <ul>
                    <li>Сильный title и H1</li>
                    <li>Изображение по теме</li>
                    <li>Прямой ответ в первом экране</li>
                    <li>Критерии выбора</li>
                    <li>FAQ и internal links</li>
                  </ul>
                </div>
              </section>

              <section className="card">
                <h2>FAQ</h2>
                {page.faq.map((item) => (
                  <div className="faq-item" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </section>

              {page.richContent.length > 0 && (
                <section className="card">
                  <h2>Дополнительные блоки</h2>
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
                <h2>Параметры страницы</h2>
                <ul className="meta-list">
                  <li>
                    <strong>Ключ:</strong> {page.keyword}
                  </li>
                  <li>
                    <strong>Категория:</strong> {page.category}
                  </li>
                  <li>
                    <strong>Интент:</strong> {page.intent}
                  </li>
                  <li>
                    <strong>Каноникал:</strong> {siteConfig.url}/{page.slug}/
                  </li>
                </ul>
              </section>

              <section className="card">
                <h2>Изображение страницы</h2>
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
                <p className="sidebar-note">
                  Для лучших CTR и визуального качества используй реальную ссылку на изображение в колонке
                  <code> image_url </code>.
                </p>
              </section>

              <section className="card">
                <h2>Похожие страницы</h2>
                <div className="related-links">
                  {relatedPages.map((item) => (
                    <Link href={`/${item.slug}/`} key={item.slug}>
                      {item.h1}
                    </Link>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        </article>
      </div>

      <SiteFooter />
    </main>
  );
}
