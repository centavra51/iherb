import Image from "next/image";
import Link from "next/link";
import type { SeoPage } from "../lib/seo-data";

export function SeoHero({ page }: { page: SeoPage }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{page.category} · подборка</p>
        <h1>{page.h1}</h1>
        <p className="lead">{page.intro}</p>
        <div className="hero-metrics">
          <div className="metric">
            <strong>Формы</strong>
            <span>Капсулы, порошки, жевательные формы и жидкие варианты под разные сценарии приема.</span>
          </div>
          <div className="metric">
            <strong>Состав</strong>
            <span>Сравнивайте основное действующее вещество, дозировку на порцию и дополнительные компоненты.</span>
          </div>
          <div className="metric">
            <strong>Выбор</strong>
            <span>Ориентируйтесь на задачу, удобство приема и понятную маркировку на упаковке.</span>
          </div>
        </div>
        <div className="cta-row">
          <Link className="button button-primary" href="/#seo-pages">
            {page.ctaPrimary}
          </Link>
          <Link className="button button-secondary" href="/#categories">
            {page.ctaSecondary}
          </Link>
        </div>
      </div>

      <div className="hero-media">
        <div className="hero-image-frame">
          {page.imageUrl ? (
            <Image src={page.imageUrl} alt={page.h1} fill sizes="(max-width: 980px) 100vw, 420px" />
          ) : (
            <div className="image-fallback">
              <span>{page.keyword}</span>
            </div>
          )}
        </div>
        <div className="image-badge">Подборка по теме: {page.keyword}</div>
        <div className="hero-floating-card">
          <p>Короткий ориентир</p>
          <strong>Сравните 3 вещи</strong>
          <span>Форму выпуска, дозировку на порцию и чистоту состава без лишних обещаний и перегруза.</span>
        </div>
      </div>
    </section>
  );
}
