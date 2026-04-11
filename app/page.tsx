import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSeoPages } from "@/lib/seo-data";

export default function HomePage() {
  const pages = getSeoPages();

  return (
    <main className="site-root">
      <div className="promo-strip">
        <div className="shell promo-inner">
          <div className="promo-pill">Editorial retail system</div>
          <p>Уникальный wellness-storefront на Next.js для партнерских офферов и SEO-кластеров</p>
          <Link href="#signup">Подключиться</Link>
        </div>
      </div>

      <SiteHeader />

      <section className="home-hero">
        <div className="shell">
          <div className="home-hero-card">
            <div className="home-hero-copy">
              <p className="eyebrow">Wellness commerce system</p>
              <h1>Витрина с мягкой editorial-подачей, которая выглядит как самостоятельный бренд, а не копия маркетплейса</h1>
              <p className="hero-text">
                Этот шаблон специально смещен в сторону более премиального и спокойного visual language:
                асимметричный hero, мягкие поверхности, теплые нейтрали и витринные SEO-страницы с изображениями.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#signup">
                  Стать партнером
                </a>
                <a className="button button-light" href="#seo-pages">
                  Смотреть SEO-страницы
                </a>
              </div>
            </div>

            <div className="home-hero-visual">
              <div className="hero-orb orb-one" />
              <div className="hero-orb orb-two" />
              <div className="hero-product-card card-main">
                <span>Daily essentials</span>
                <strong>Curated formulas</strong>
              </div>
              <div className="hero-product-card card-side">
                <span>Functional nutrition</span>
                <strong>Clean ingredients</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="guarantee" id="guarantee">
        <div className="shell guarantee-grid">
          <div className="guarantee-title">
            <h2>Готовый фундамент для индексации, масштабирования и сильного визуального восприятия</h2>
            <p>
              Чистый SSR/SSG-HTML, semantic layout, schema, статические URL, перелинковка и карточки под коммерческий
              intent.
            </p>
          </div>
          <article className="icon-card">
            <span>✓</span>
            <strong>Indexable HTML</strong>
          </article>
          <article className="icon-card">
            <span>⌂</span>
            <strong>Google Sheets flow</strong>
          </article>
          <article className="icon-card">
            <span>❀</span>
            <strong>Beautiful design</strong>
          </article>
          <article className="icon-card">
            <span>↺</span>
            <strong>Scalable to 1000+</strong>
          </article>
        </div>
      </section>

      <section className="seo-section" id="seo-pages">
        <div className="shell">
          <div className="section-head">
            <h2>Сгенерированные SEO-страницы</h2>
            <span>{pages.length} опубликованных URL</span>
          </div>

          <div className="seo-grid">
            {pages.map((page) => (
              <article key={page.slug} className="seo-card">
                <p className="seo-card-tag">
                  {page.category} · {page.intent}
                </p>
                <h3>{page.h1}</h3>
                <p>{page.intro}</p>
                <div className="seo-benefits">
                  {page.benefits.slice(0, 3).map((benefit) => (
                    <span key={benefit}>{benefit}</span>
                  ))}
                </div>
                <Link href={`/${page.slug}/`} className="button button-primary">
                  Открыть страницу
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="categories" id="categories">
        <div className="shell">
          <div className="section-head">
            <h2>Кластеры для масштабирования</h2>
          </div>

          <div className="category-grid">
            <article className="category-item">
              <div className="category-icon">01</div>
              <h3>Ингредиенты</h3>
            </article>
            <article className="category-item">
              <div className="category-icon">02</div>
              <h3>Симптомы и задачи</h3>
            </article>
            <article className="category-item">
              <div className="category-icon">03</div>
              <h3>Аудитории</h3>
            </article>
            <article className="category-item">
              <div className="category-icon">04</div>
              <h3>Форматы</h3>
            </article>
          </div>
        </div>
      </section>

      <section className="signup" id="signup">
        <div className="shell signup-box">
          <div className="signup-copy">
            <h2>Подключите Google Sheets и масштабируйте контент через Next.js</h2>
            <p>
              Веди строки в Google Sheets, экспортируй CSV, запускай импорт и получай новые SEO-страницы без ручной
              верстки каждого URL.
            </p>
          </div>
          <div className="signup-form">
            <input placeholder="Email для связи" readOnly />
            <button className="button button-primary" type="button">
              Подключить поток
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
