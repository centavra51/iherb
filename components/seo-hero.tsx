import Image from "next/image";
import type { Locale } from "../lib/i18n";
import type { LocalizedSeoPage } from "../lib/localized-seo";

const labels = {
  ru: {
    forms: "Форма",
    formsText: "Капсулы, порошок, жидкий или жевательный формат.",
    dosage: "Дозировка",
    dosageText: "Сравните количество на порцию и размер упаковки.",
    comfort: "Удобство",
    comfortText: "Посмотрите, насколько просто принимать продукт каждый день.",
    selection: "подборка"
  },
  ro: {
    forms: "Forma",
    formsText: "Capsule, pudra, lichid sau format masticabil.",
    dosage: "Doza",
    dosageText: "Compara cantitatea per portie si marimea ambalajului.",
    comfort: "Confort",
    comfortText: "Vezi cat de simplu este produsul pentru administrare zilnica.",
    selection: "selectie"
  }
} as const;

export function SeoHero({ page, locale }: { page: LocalizedSeoPage; locale: Locale }) {
  const copy = labels[locale];

  return (
    <section className="hero simple-hero">
      <div className="hero-copy">
        <p className="eyebrow">
          {page.category} · {copy.selection}
        </p>
        <h1>{page.h1}</h1>
        <p className="lead">{page.intro}</p>

        <div className="hero-metrics">
          <div className="metric">
            <strong>{copy.forms}</strong>
            <span>{copy.formsText}</span>
          </div>
          <div className="metric">
            <strong>{copy.dosage}</strong>
            <span>{copy.dosageText}</span>
          </div>
          <div className="metric">
            <strong>{copy.comfort}</strong>
            <span>{copy.comfortText}</span>
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
      </div>
    </section>
  );
}
