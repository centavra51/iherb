import Image from "next/image";
import Link from "next/link";
import type { SeoPage } from "../lib/seo-data";

export function SeoHero({ page }: { page: SeoPage }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">
          {page.category} · {page.intent}
        </p>
        <h1>{page.h1}</h1>
        <p className="lead">{page.intro}</p>
        <div className="hero-metrics">
          <div className="metric">
            <strong>SEO</strong>
            <span>Четкий long-tail интент и semantic coverage.</span>
          </div>
          <div className="metric">
            <strong>UX</strong>
            <span>Быстрый ответ, ясные блоки и сильный CTA.</span>
          </div>
          <div className="metric">
            <strong>LLM</strong>
            <span>Структура, сущности и FAQ для answer engines.</span>
          </div>
        </div>
        <div className="cta-row">
          <Link className="button button-primary" href="/#signup">
            {page.ctaPrimary}
          </Link>
          <Link className="button button-secondary" href="/#seo-pages">
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
        <div className="image-badge">Изображение по теме: {page.keyword}</div>
        <div className="hero-floating-card">
          <p>Visual system</p>
          <strong>Distinct brand feel</strong>
          <span>Страница оформлена как отдельная premium-витрина, а не клон чужого storefront.</span>
        </div>
      </div>
    </section>
  );
}
