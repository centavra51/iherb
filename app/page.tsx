import Link from "next/link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { getSeoPages } from "../lib/seo-data";

export default function HomePage() {
  const pages = getSeoPages();

  return (
    <main className="site-root">
      <div className="promo-strip">
        <div className="shell promo-inner">
          <div className="promo-pill">Подборки под спрос</div>
          <p>Витамины, минералы и БАДы с понятными текстами под будущие партнерские офферы</p>
          <Link href="#signup">Смотреть подборки</Link>
        </div>
      </div>

      <SiteHeader />

      <section className="home-hero">
        <div className="shell">
          <div className="home-hero-card">
            <div className="home-hero-copy">
              <p className="eyebrow">Витрина добавок</p>
              <h1>Подборки популярных витаминов и БАДов, которые легко превратить в рабочие партнерские страницы</h1>
              <p className="hero-text">
                Здесь собраны темы, по которым люди действительно ищут решения: магний для сна, омега-3,
                витамин D3, пробиотики, коллаген, железо и другие востребованные добавки. На каждой странице
                уже есть объяснение, кому подходит категория, что сравнивать в составе и какие форматы чаще
                выбирают для ежедневного приема.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#seo-pages">
                  Открыть страницы
                </a>
                <a className="button button-light" href="#categories">
                  Посмотреть категории
                </a>
              </div>
            </div>

            <div className="home-hero-visual">
              <div className="hero-orb orb-one" />
              <div className="hero-orb orb-two" />
              <div className="hero-product-card card-main">
                <span>Топ-направления</span>
                <strong>Магний, омега-3, D3</strong>
              </div>
              <div className="hero-product-card card-side">
                <span>Повседневный спрос</span>
                <strong>Пробиотики, железо, цинк</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="guarantee" id="guide">
        <div className="shell guarantee-grid">
          <div className="guarantee-title">
            <h2>Контент уже собран так, чтобы человеку было проще выбрать добавку, а вам проще встроить оффер</h2>
            <p>
              Вместо технических заглушек сайт получает нормальный редакционный тон: короткий ответ по теме,
              критерии выбора, FAQ и перелинковку на близкие подборки.
            </p>
          </div>
          <article className="icon-card">
            <span>01</span>
            <strong>Популярные категории</strong>
          </article>
          <article className="icon-card">
            <span>02</span>
            <strong>Понятные критерии выбора</strong>
          </article>
          <article className="icon-card">
            <span>03</span>
            <strong>Мягкий экспертный тон</strong>
          </article>
          <article className="icon-card">
            <span>04</span>
            <strong>Готово под партнерские ссылки</strong>
          </article>
        </div>
      </section>

      <section className="seo-section" id="seo-pages">
        <div className="shell">
          <div className="section-head">
            <h2>Готовые страницы-подборки</h2>
            <span>{pages.length} опубликованных тем</span>
          </div>

          <div className="seo-grid">
            {pages.map((page) => (
              <article key={page.slug} className="seo-card">
                <p className="seo-card-tag">{page.category} · подборка</p>
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
            <h2>Основные направления витрины</h2>
          </div>

          <div className="category-grid">
            <article className="category-item">
              <div className="category-icon">01</div>
              <h3>Минералы</h3>
            </article>
            <article className="category-item">
              <div className="category-icon">02</div>
              <h3>Витамины</h3>
            </article>
            <article className="category-item">
              <div className="category-icon">03</div>
              <h3>Жирные кислоты</h3>
            </article>
            <article className="category-item">
              <div className="category-icon">04</div>
              <h3>Пробиотики и коллаген</h3>
            </article>
          </div>
        </div>
      </section>

      <section className="signup" id="signup">
        <div className="shell signup-box">
          <div className="signup-copy">
            <h2>Витрина уже подготовлена под популярные запросы о витаминах и БАДах</h2>
            <p>
              Дальше можно просто подставлять карточки товаров, партнерские ссылки, цены, отзывы и отдельные
              блоки с акциями, не переписывая каждый URL с нуля.
            </p>
          </div>
          <div className="signup-form">
            <input placeholder="Подборки под витамины и БАДы" readOnly />
            <button className="button button-primary" type="button">
              Перейти к страницам
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
