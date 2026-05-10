import Image from "next/image";
import Link from "next/link";
import { getLocalePath, type Locale } from "../lib/i18n";
import type { LocalizedSeoPage } from "../lib/localized-seo";

const labels = {
  ru: {
    forms: "Формы",
    formsText: "Капсулы, порошки, жевательные формы и жидкие варианты под разные сценарии приема.",
    composition: "Состав",
    compositionText: "Сравнивайте основное действующее вещество, дозировку на порцию и дополнительные компоненты.",
    choice: "Выбор",
    choiceText: "Ориентируйтесь на задачу, удобство приема и понятную маркировку на упаковке.",
    badge: "Подборка по теме:",
    shortGuide: "Короткий ориентир",
    compareThree: "Сравните 3 вещи",
    compareThreeText: "Форму выпуска, дозировку на порцию и чистоту состава без лишних обещаний."
  },
  ro: {
    forms: "Forme",
    formsText: "Capsule, pulberi, forme masticabile si variante lichide pentru scenarii diferite de administrare.",
    composition: "Compozitie",
    compositionText: "Compara ingredientul principal, doza per portie si componentele suplimentare din formula.",
    choice: "Alegere",
    choiceText: "Uita-te la scop, confortul administrarii si claritatea etichetei de pe ambalaj.",
    badge: "Selectie pe tema:",
    shortGuide: "Repere rapide",
    compareThree: "Compara 3 lucruri",
    compareThreeText: "Forma produsului, doza per portie si claritatea formulei fara promisiuni inutile."
  }
} as const;

export function SeoHero({ page, locale }: { page: LocalizedSeoPage; locale: Locale }) {
  const copy = labels[locale];

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">
          {page.category} · {locale === "ru" ? "подборка" : "selectie"}
        </p>
        <h1>{page.h1}</h1>
        <p className="lead">{page.intro}</p>
        <div className="hero-metrics">
          <div className="metric">
            <strong>{copy.forms}</strong>
            <span>{copy.formsText}</span>
          </div>
          <div className="metric">
            <strong>{copy.composition}</strong>
            <span>{copy.compositionText}</span>
          </div>
          <div className="metric">
            <strong>{copy.choice}</strong>
            <span>{copy.choiceText}</span>
          </div>
        </div>
        <div className="cta-row">
          <Link className="button button-primary" href={`${getLocalePath(locale)}#seo-pages`}>
            {page.ctaPrimary}
          </Link>
          <Link className="button button-secondary" href={`${getLocalePath(locale)}#categories`}>
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
        <div className="image-badge">
          {copy.badge} {page.keyword}
        </div>
        <div className="hero-floating-card">
          <p>{copy.shortGuide}</p>
          <strong>{copy.compareThree}</strong>
          <span>{copy.compareThreeText}</span>
        </div>
      </div>
    </section>
  );
}
