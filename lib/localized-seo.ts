import type { RichBlock } from "./content";
import type { SeoPage } from "./seo-data";
import { getRelatedPages, getSeoPageBySlug, getSeoPages } from "./seo-data";
import type { Locale } from "./i18n";

type FaqItem = { question: string; answer: string };

export type LocalizedSeoPage = Omit<SeoPage, "faq" | "richContent"> & {
  faq: FaqItem[];
  richContent: RichBlock[];
  locale: Locale;
};

type PageOverride = {
  keyword: string;
  category: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  benefits: string[];
  howToChoose: string;
  faq: FaqItem[];
  ctaPrimary: string;
  ctaSecondary: string;
  richContent: RichBlock[];
};

const romanianOverrides: Record<string, PageOverride> = {
  "magniy-dlya-sna": {
    keyword: "magneziu pentru somn",
    category: "Minerale",
    title: "Magneziu pentru somn: cum alegi forma, doza si administrarea | iherbs.com.md",
    metaDescription:
      "Ghid in limba romana pentru alegerea suplimentelor cu magneziu pentru somn: forme populare, dozaj si criterii simple de comparatie.",
    h1: "Magneziu pentru somn: cum alegi forma, doza si administrarea",
    intro:
      "Aceasta selectie te ajuta sa compari formele populare de magneziu pentru rutina de seara si sa intelegi ce merita verificat inainte de comanda.",
    benefits: [
      "Compara forma de magneziu si toleranta la administrare",
      "Verifica doza per portie si numarul de portii",
      "Analizeaza formula fara adaosuri inutile"
    ],
    howToChoose:
      "Pentru aceasta categorie este util sa compari forma magneziului, doza per portie, ritmul de administrare si prezenta unor ingrediente suplimentare precum vitamina B6. Pentru utilizarea seara conteaza in special toleranta buna si un format usor de integrat in rutina zilnica.",
    faq: [
      {
        question: "Ce forma de magneziu este cautata frecvent pentru seara?",
        answer:
          "De obicei sunt comparate glicinatul si citratul de magneziu, deoarece apar des in produsele gandite pentru administrare zilnica si de seara."
      },
      {
        question: "La ce sa ma uit in afara de pret?",
        answer:
          "Compara doza per portie, numarul de capsule, claritatea etichetei si prezenta altor ingrediente in aceeasi formula."
      },
      {
        question: "Pentru cine este utila o pagina separata despre magneziu pentru somn?",
        answer:
          "Pentru persoanele care vor sa filtreze rapid produsele orientate spre rutina de seara, fara sa treaca prin categorii mai generale."
      }
    ],
    ctaPrimary: "Vezi magneziu",
    ctaSecondary: "Alte minerale",
    richContent: [
      { type: "heading", content: "Pentru cine poate fi util" },
      {
        type: "list",
        items: [
          "Pentru cei care cauta un supliment pentru seara",
          "Pentru cei care compara capsule, pulberi si forme masticabile",
          "Pentru cei care vor o formula usor de inteles"
        ]
      },
      { type: "heading", content: "Ce merita verificat" },
      {
        type: "list",
        items: [
          "Forma de magneziu si doza per portie",
          "Numarul de portii din ambalaj",
          "Prezenta ingredientelor suplimentare pentru administrarea de seara"
        ]
      }
    ]
  },
  "omega-3-dlya-zhenshchin": {
    keyword: "omega-3 pentru femei",
    category: "Acizi grasi",
    title: "Omega-3 pentru femei: cum compari compozitia, concentratia si forma | iherbs.com.md",
    metaDescription:
      "Pagina SEO in romana pentru omega-3 pentru femei: compara EPA, DHA, concentratia per portie si formatul potrivit pentru administrare zilnica.",
    h1: "Omega-3 pentru femei: cum compari compozitia, concentratia si forma",
    intro:
      "Pagina este gandita pentru cei care vor sa compare calm formulele populare de omega-3 si sa inteleaga diferenta dintre concentratie, marimea portiei si confortul de administrare.",
    benefits: [
      "Compara separat valorile EPA si DHA",
      "Verifica concentratia reala per portie",
      "Analizeaza usurinta administrarii zilnice"
    ],
    howToChoose:
      "In aceasta categorie conteaza continutul total de EPA si DHA, numarul de capsule pe zi, claritatea etichetei si formatul produsului. Cu cat doza este explicata mai bine, cu atat alegerea zilnica devine mai simpla.",
    faq: [
      {
        question: "Ce omega-3 este comod pentru administrare zilnica?",
        answer:
          "De regula sunt preferate formulele cu etichetare clara pentru EPA si DHA, portii usor de inteles si un numar rezonabil de capsule pe zi."
      },
      {
        question: "De ce nu este suficient sa compar doar cantitatea totala de ulei de peste?",
        answer:
          "Pentru alegere conteaza in primul rand cantitatea de EPA si DHA per portie, nu doar greutatea totala a uleiului din capsula."
      },
      {
        question: "Pentru cine e utila o selectie separata de omega-3 pentru femei?",
        answer:
          "Pentru cei care vor un reper clar dupa compozitie, forma si confort de administrare, fara sa parcurga un catalog foarte larg."
      }
    ],
    ctaPrimary: "Vezi omega-3",
    ctaSecondary: "Pagini similare",
    richContent: [
      { type: "heading", content: "Ce este comod sa compari" },
      {
        type: "list",
        items: [
          "Cantitatea de EPA si DHA per portie",
          "Numarul de capsule sau softgel-uri pe zi",
          "Daca este ulei de peste clasic sau varianta mai concentrata"
        ]
      },
      { type: "heading", content: "La ce sa fii atent" },
      {
        type: "list",
        items: [
          "Dimensiunea ambalajului si durata curei",
          "Prezenta antioxidantilor in formula",
          "Claritatea etichetei si a portiei zilnice"
        ]
      }
    ]
  },
  "vitamin-d3-dlya-detey": {
    keyword: "vitamina D3 pentru copii",
    category: "Vitamine",
    title: "Vitamina D3 pentru copii: cum alegi doza, gustul si formatul | iherbs.com.md",
    metaDescription:
      "Ghid in romana pentru vitamina D3 pentru copii: compara doza, varsta recomandata, formatul si compozitia produsului.",
    h1: "Vitamina D3 pentru copii: cum alegi doza, gustul si formatul",
    intro:
      "Aceasta pagina ajuta parintii sa compare formele populare de vitamina D3 pentru copii, de la picaturi pana la forme masticabile, fara informatie inutil de complicata.",
    benefits: [
      "Compara forma de administrare pentru varsta copilului",
      "Verifica doza de vitamina D3 per portie",
      "Analizeaza compozitia fara adaosuri inutile"
    ],
    howToChoose:
      "La alegere conteaza grupa de varsta, formatul produsului, doza per portie si claritatea instructiunilor de administrare. Pentru multi parinti sunt importante si gustul, numarul de portii si absenta indulcitorilor sau aditivilor nedoriti.",
    faq: [
      {
        question: "Ce format de vitamina D3 este considerat comod pentru copii?",
        answer:
          "Deseori sunt alese picaturile sau formele masticabile, fiind mai usor de integrat in rutina zilnica si de adaptat in functie de varsta."
      },
      {
        question: "Ce este important sa verific in compozitie?",
        answer:
          "Uita-te la doza per portie, numarul de portii si la absenta adaosurilor care nu aduc valoare practica pentru administrarea zilnica."
      },
      {
        question: "Pentru cine este utila o selectie separata de vitamina D3 pentru copii?",
        answer:
          "Pentru parintii care vor sa compare rapid optiunile dupa varsta, format si comoditatea administrarii."
      }
    ],
    ctaPrimary: "Vezi vitamina D3",
    ctaSecondary: "Alte vitamine",
    richContent: [
      { type: "heading", content: "Pentru cine este utila aceasta selectie" },
      {
        type: "list",
        items: [
          "Pentru parinti ai copiilor de varste diferite",
          "Pentru cei care aleg intre picaturi si forme masticabile",
          "Pentru cei care vor o schema usoara de administrare"
        ]
      },
      { type: "heading", content: "Ce sa verifici inainte de comanda" },
      {
        type: "list",
        items: [
          "Doza dintr-o portie",
          "Varsta recomandata de producator",
          "Numarul de portii din ambalaj"
        ]
      }
    ]
  },
  "probiotiki-posle-antibiotikov": {
    keyword: "probiotice dupa antibiotice",
    category: "Probiotice",
    title: "Probiotice dupa antibiotice: cum compari tulpinile, formatul si durata curei | iherbs.com.md",
    metaDescription:
      "Pagina in romana despre probiotice dupa antibiotice: compara tulpinile, formatul de administrare si structura curei zilnice.",
    h1: "Probiotice dupa antibiotice: cum compari tulpinile, formatul si durata curei",
    intro:
      "Aceasta selectie este construita pentru cei care vor sa compare rapid formulele de probiotice dupa antibiotice si sa inteleaga ce informatii fac alegerea mai clara.",
    benefits: [
      "Verifica numarul de tulpini si claritatea formulei",
      "Compara capsulele, plicurile si alte formate",
      "Analizeaza dimensiunea curei si numarul de portii"
    ],
    howToChoose:
      "In aceasta categorie ajuta sa compari tulpinile mentionate, forma de administrare, cerintele de pastrare si durata curei. O eticheta clara si un ritm simplu de administrare fac alegerea mult mai usoara.",
    faq: [
      {
        question: "Ce face comparatia intre probiotice mai usoara?",
        answer:
          "O lista clara de tulpini, un numar usor de inteles de portii si un format care poate fi administrat zilnic fara complicatii."
      },
      {
        question: "Conteaza forma produsului?",
        answer:
          "Da, pentru multe persoane conteaza daca produsul este in capsule, plicuri sau alt format si daca necesita conditii speciale de pastrare."
      },
      {
        question: "Pentru cine este utila o selectie separata de probiotice dupa antibiotice?",
        answer:
          "Pentru cei care cauta o filtrare rapida a produselor potrivite acestui context de utilizare, fara sa parcurga categorii foarte largi."
      }
    ],
    ctaPrimary: "Vezi probiotice",
    ctaSecondary: "Pagini similare",
    richContent: [
      { type: "heading", content: "Ce merita comparat" },
      {
        type: "list",
        items: [
          "Numarul de tulpini si claritatea compozitiei",
          "Formatul: capsule, plicuri sau alte variante",
          "Durata curei si numarul de portii"
        ]
      },
      { type: "heading", content: "Ce simplifica alegerea" },
      {
        type: "list",
        items: [
          "Conditii de pastrare usor de gestionat",
          "Eticheta clara fara promisiuni exagerate",
          "Schema de administrare simpla"
        ]
      }
    ]
  },
  "kollagen-dlya-sustavov": {
    keyword: "colagen pentru articulatii",
    category: "Colagen",
    title: "Colagen pentru articulatii: cum alegi tipul, portia si formula | iherbs.com.md",
    metaDescription:
      "Ghid SEO in romana pentru colagen pentru articulatii: compara tipul de colagen, marimea portiei si ingredientele din formula.",
    h1: "Colagen pentru articulatii: cum alegi tipul, portia si formula",
    intro:
      "Pagina te ajuta sa compari formulele populare de colagen pentru articulatii dupa tip, doza si ingredientele care apar frecvent in aceeasi formula.",
    benefits: [
      "Compara tipul de colagen si marimea portiei",
      "Verifica numarul de portii din ambalaj",
      "Analizeaza vitamina C sau alte adaosuri utile"
    ],
    howToChoose:
      "Pentru aceasta tema merita sa compari tipul de colagen, cantitatea dintr-o portie, forma produsului si ingredientele suplimentare. O formula clara si o portie usor de inteles simplifica alegerea.",
    faq: [
      {
        question: "Ce este util sa compar intre formulele cu colagen?",
        answer:
          "In primul rand tipul de colagen, doza per portie, forma produsului si daca formula include ingrediente suplimentare precum vitamina C."
      },
      {
        question: "De ce conteaza numarul de portii?",
        answer:
          "Pentru ca ajuta sa intelegi cat dureaza produsul si cum se raporteaza pretul la utilizarea zilnica."
      },
      {
        question: "Pentru cine este utila o selectie separata de colagen pentru articulatii?",
        answer:
          "Pentru cei care vor sa compare rapid formulele orientate spre aceasta categorie, fara sa parcurga oferte foarte diferite intre ele."
      }
    ],
    ctaPrimary: "Vezi colagen",
    ctaSecondary: "Alte selectii",
    richContent: [
      { type: "heading", content: "Cui i se potriveste aceasta pagina" },
      {
        type: "list",
        items: [
          "Celor care compara mai multe tipuri de colagen",
          "Celor care vor sa inteleaga usor portia zilnica",
          "Celor care cauta formule cu ingrediente suplimentare relevante"
        ]
      },
      { type: "heading", content: "Ce sa verifici" },
      {
        type: "list",
        items: [
          "Tipul de colagen si marimea portiei",
          "Numarul de portii din ambalaj",
          "Vitamina C sau alte adaosuri din formula"
        ]
      }
    ]
  },
  "zhelezo-dlya-zhenshchin": {
    keyword: "fier pentru femei",
    category: "Minerale",
    title: "Fier pentru femei: cum compari forma, doza si formula | iherbs.com.md",
    metaDescription:
      "Pagina in romana pentru fier pentru femei: compara forma fierului, doza per portie, ingredientele asociate si durata curei.",
    h1: "Fier pentru femei: cum compari forma, doza si formula",
    intro:
      "Aceasta pagina este facuta pentru a compara rapid formulele populare de fier pentru femei dupa tipul de fier, compozitie si confortul administrarii zilnice.",
    benefits: [
      "Compara forma fierului si doza per portie",
      "Verifica vitamina C sau alte componente asociate",
      "Analizeaza durata curei si numarul de portii"
    ],
    howToChoose:
      "In aceasta categorie este util sa compari forma fierului, doza dintr-o portie, prezenta vitaminei C si claritatea schemei de administrare. Conteaza si cate portii contine ambalajul si cat de simpla este eticheta.",
    faq: [
      {
        question: "De ce merita comparata forma fierului?",
        answer:
          "Pentru ca produsele pot diferi semnificativ prin tipul de fier si prin modul in care este prezentata doza pe eticheta."
      },
      {
        question: "Ce alte ingrediente sunt utile de verificat?",
        answer:
          "Vitamina C si alte componente asociate pot aparea in aceeasi formula, de aceea merita sa fie comparate impreuna cu doza de fier."
      },
      {
        question: "Pentru cine este utila o selectie separata de fier pentru femei?",
        answer:
          "Pentru persoanele care vor sa ajunga repede la formule relevante acestei categorii si sa evite comparatiile prea generale."
      }
    ],
    ctaPrimary: "Vezi fier",
    ctaSecondary: "Alte minerale",
    richContent: [
      { type: "heading", content: "Ce sa verifici inainte de alegere" },
      {
        type: "list",
        items: [
          "Forma fierului si doza dintr-o portie",
          "Vitamina C si alte componente asociate",
          "Durata curei si numarul de portii"
        ]
      },
      { type: "heading", content: "Cui ii este utila pagina" },
      {
        type: "list",
        items: [
          "Celor care vor o comparatie rapida intre formule",
          "Celor care prefera etichete clare si doze usor de inteles",
          "Celor care aleg dupa tipul de fier si comoditatea administrarii"
        ]
      }
    ]
  },
  "tsink-dlya-immuniteta": {
    keyword: "zinc pentru imunitate",
    category: "Minerale",
    title: "Zinc pentru imunitate: cum alegi forma, doza si formula | iherbs.com.md",
    metaDescription:
      "Ghid in romana pentru zinc pentru imunitate: compara forma de administrare, doza de zinc si ingredientele suplimentare din complex.",
    h1: "Zinc pentru imunitate: cum alegi forma, doza si formula",
    intro:
      "Pagina te ajuta sa compari produsele cu zinc pentru imunitate dupa forma, doza si claritatea formulei, fara zgomot informational inutil.",
    benefits: [
      "Compara forma produsului si marimea portiei",
      "Verifica doza de zinc per administrare",
      "Analizeaza ingredientele suplimentare din complex"
    ],
    howToChoose:
      "La alegere conteaza formatul de administrare, doza de zinc per portie, ingredientele din formula si claritatea etichetei. Este util si sa vezi cate portii contine ambalajul pentru utilizarea zilnica.",
    faq: [
      {
        question: "Ce merita verificat primul la un produs cu zinc?",
        answer:
          "Forma de administrare, doza de zinc per portie si cat de clar este prezentata compozitia pe eticheta."
      },
      {
        question: "Conteaza ingredientele suplimentare din complex?",
        answer:
          "Da, deoarece unele produse combina zincul cu alte componente, iar formula trebuie comparata ca ansamblu, nu doar dupa denumirea principala."
      },
      {
        question: "Pentru cine este utila o selectie separata de zinc pentru imunitate?",
        answer:
          "Pentru cei care vor sa filtreze rapid ofertele acestei categorii si sa compare simplu doza, formatul si compozitia."
      }
    ],
    ctaPrimary: "Vezi zinc",
    ctaSecondary: "Alte minerale",
    richContent: [
      { type: "heading", content: "Ce ajuta la comparatie" },
      {
        type: "list",
        items: [
          "Forma de administrare si marimea portiei",
          "Doza de zinc dintr-o administrare",
          "Ingredientele suplimentare din formula"
        ]
      },
      { type: "heading", content: "Ce simplifica alegerea" },
      {
        type: "list",
        items: [
          "Eticheta clara a compozitiei",
          "Format comod pentru administrare zilnica",
          "Volum de ambalaj potrivit"
        ]
      }
    ]
  },
  "vitamin-b-kompleks-dlya-energii": {
    keyword: "complex de vitamine B pentru energie",
    category: "Vitamine",
    title: "Complex de vitamine B pentru energie: cum compari compozitia si doza | iherbs.com.md",
    metaDescription:
      "Pagina SEO in romana pentru complex de vitamine B pentru energie: compara vitaminele din formula, doza per portie si modul de administrare.",
    h1: "Complex de vitamine B pentru energie: cum compari compozitia si doza",
    intro:
      "Aceasta selectie este pentru cei care vor sa compare rapid formulele de vitamine B pentru energie dupa compozitie, portie si claritatea utilizarii zilnice.",
    benefits: [
      "Verifica ce vitamine din grupa B intra in formula",
      "Compara doza per portie si ritmul administrarii",
      "Analizeaza numarul de portii si dimensiunea ambalajului"
    ],
    howToChoose:
      "Este util sa compari lista de vitamine din grupa B, doza per portie, numarul de administrari pe zi si claritatea etichetei. O formula usor de citit si un regim simplu sunt de obicei cele mai practice.",
    faq: [
      {
        question: "Ce trebuie comparat prima data la un complex de vitamine B?",
        answer:
          "Lista vitaminelor din compozitie si doza per portie, pentru a intelege rapid cat de completa este formula."
      },
      {
        question: "De ce conteaza numarul de administrari pe zi?",
        answer:
          "Pentru ca influenteaza confortul utilizarii zilnice si perceptia reala asupra unei cure complete."
      },
      {
        question: "Pentru cine este utila o selectie separata pentru energie?",
        answer:
          "Pentru cei care vor sa compare formulele pe aceasta tema fara sa piarda timp in categorii prea largi."
      }
    ],
    ctaPrimary: "Vezi complex B",
    ctaSecondary: "Alte vitamine",
    richContent: [
      { type: "heading", content: "Cui i se potriveste aceasta selectie" },
      {
        type: "list",
        items: [
          "Celor care aleg intre mai multe formule cu vitamine B",
          "Celor care vor doze usor de comparat",
          "Celor care prefera etichete clare si administrare simpla"
        ]
      },
      { type: "heading", content: "Ce sa verifici inainte de comanda" },
      {
        type: "list",
        items: [
          "Ce vitamine B sunt incluse in compozitie",
          "Doza dintr-o portie",
          "Numarul de administrari si marimea ambalajului"
        ]
      }
    ]
  }
};

const romanianCategoryFallbacks: Record<string, string> = {
  "Минералы": "Minerale",
  "Витамины": "Vitamine",
  "Жирные кислоты": "Acizi grasi"
};

export function localizeSeoPage(page: SeoPage, locale: Locale): LocalizedSeoPage {
  if (locale === "ru") {
    return { ...page, locale };
  }

  const override = romanianOverrides[page.slug];

  if (!override) {
    return {
      ...page,
      locale,
      category: romanianCategoryFallbacks[page.category] ?? page.category
    };
  }

  return {
    ...page,
    ...override,
    locale
  };
}

export function getLocalizedSeoPages(locale: Locale): LocalizedSeoPage[] {
  return getSeoPages().map((page) => localizeSeoPage(page, locale));
}

export function getLocalizedSeoPageBySlug(slug: string, locale: Locale) {
  const page = getSeoPageBySlug(slug);
  return page ? localizeSeoPage(page, locale) : undefined;
}

export function getLocalizedRelatedPages(page: LocalizedSeoPage, locale: Locale, limit = 4) {
  const sourcePage = getSeoPageBySlug(page.slug);
  if (!sourcePage) {
    return [];
  }

  return getRelatedPages(sourcePage, limit).map((item) => localizeSeoPage(item, locale));
}
