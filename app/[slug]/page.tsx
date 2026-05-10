import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoHero } from "../../components/seo-hero";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { getRelatedPages, getSeoPageBySlug, getSeoPages } from "../../lib/seo-data";
import { siteConfig } from "../../lib/site";

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
          <Link href="/#seo-pages">Подборки</Link>
          <span>/</span>
          <span>{page.keyword}</span>
        </nav>

        <article className="page">
          <SeoHero page={page} />

          <section className="trust-strip">
            <article className="trust-card">
              <strong>Подборка</strong>
              <span>Собрана под конкретный запрос, чтобы не смешивать разные сценарии выбора в одном месте.</span>
            </article>
            <article className="trust-card">
              <strong>Сравнение</strong>
              <span>Помогает быстро оценить форму выпуска, дозировку и дополнительные компоненты.</span>
            </article>
            <article className="trust-card">
              <strong>FAQ</strong>
              <span>Закрывает частые вопросы перед покупкой и экономит время на поиске базовой информации.</span>
            </article>
            <article className="trust-card">
              <strong>Навигация</strong>
              <span>Есть переходы на соседние подборки, чтобы человек мог сравнить близкие категории.</span>
            </article>
          </section>

          <section className="content-grid">
            <div className="main-column">
              <section className="card">
                <h2>Кратко по теме</h2>
                <p>
                  {page.intro} Подборка по теме «{page.keyword}» помогает быстрее отсеять неподходящие варианты
                  и сосредоточиться на тех формулах, которые подходят под задачу и привычный формат приема.
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
                  <h2>Кому обычно подходит эта категория</h2>
                  <p>
                    Такие подборки полезны тем, кто уже понимает задачу и хочет сравнить несколько популярных
                    решений без перегруза медицинскими терминами. Это удобный формат для первого знакомства с
                    категорией, быстрого сравнения и перехода к конкретному продукту.
                  </p>
                </div>
                <div className="mini-panel">
                  <h3>Что удобно сравнить</h3>
                  <ul>
                    <li>Форму выпуска и размер порции</li>
                    <li>Дозировку активного компонента</li>
                    <li>Наличие дополнительных ингредиентов</li>
                    <li>Количество порций в упаковке</li>
                    <li>Удобство ежедневного приема</li>
                  </ul>
                </div>
              </section>

              <section className="card">
                <h2>Частые вопросы</h2>
                {page.faq.map((item) => (
                  <div className="faq-item" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </section>

              {page.richContent.length > 0 && (
                <section className="card">
                  <h2>Полезно знать перед покупкой</h2>
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
                <h2>Быстрые ориентиры</h2>
                <ul className="meta-list">
                  <li>
                    <strong>Тема:</strong> {page.keyword}
                  </li>
                  <li>
                    <strong>Категория:</strong> {page.category}
                  </li>
                  <li>
                    <strong>Фокус:</strong> популярные добавки для понятной повседневной задачи
                  </li>
                  <li>
                    <strong>Формат:</strong> подборка с пояснениями, FAQ и переходами на близкие темы
                  </li>
                </ul>
              </section>

              <section className="card">
                <h2>Изображение категории</h2>
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
                  Визуальный блок поддерживает страницу и помогает быстрее считать тему подборки еще до
                  перехода к карточкам товаров.
                </p>
              </section>

              <section className="card">
                <h2>Соседние подборки</h2>
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
