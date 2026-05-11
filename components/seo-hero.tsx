import Image from "next/image";
import type { Locale } from "../lib/i18n";
import type { LocalizedSeoPage } from "../lib/localized-seo";

const labels = {
  ru: {
    forms: "Форма",
    formsText: "Капсулы, порошок, жевательные или жидкие варианты.",
    composition: "Состав",
    compositionText: "Сравните дозировку на порцию и основные компоненты.",
    choice: "Удобство",
    choiceText: "Оцените размер порции и простоту ежедневного приема.",
    badge: "Подборка по теме:",
    shortGuide: "Главное перед покупкой",
    compareThree: "Сравните 3 вещи",
    compareThreeText: "Форму, дозировку и состав без лишних обещаний."
  },
  ro: {
    forms: "Forma",
    formsText: "Capsule, pulbere, forme masticabile sau variante lichide.",
    composition: "Compozitie",
    compositionText: "Compara doza per portie si ingredientele principale.",
    choice: "Confort",
    choiceText: "Verifica marimea portiei si usurinta administrarii zilnice.",
    badge: "Selectie pe tema:",
    shortGuide: "Esential inainte de comanda",
    compareThree: "Compara 3 lucruri",
    compareThreeText: "Forma, doza si compozitia fara promisiuni inutile."
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
