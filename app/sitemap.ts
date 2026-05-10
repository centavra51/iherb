import type { MetadataRoute } from "next";
import { getLocalePath, locales } from "../lib/i18n";
import { getSeoPages } from "../lib/seo-data";
import { siteConfig } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = getSeoPages();

  return [
    ...locales.map((locale) => ({
      url: `${siteConfig.url}${getLocalePath(locale)}`,
      lastModified: now,
      alternates: {
        languages: {
          ru: `${siteConfig.url}${getLocalePath("ru")}`,
          ro: `${siteConfig.url}${getLocalePath("ro")}`
        }
      }
    })),
    ...pages.flatMap((page) =>
      locales.map((locale) => ({
        url: `${siteConfig.url}${getLocalePath(locale, page.slug)}`,
        lastModified: now,
        alternates: {
          languages: {
            ru: `${siteConfig.url}${getLocalePath("ru", page.slug)}`,
            ro: `${siteConfig.url}${getLocalePath("ro", page.slug)}`
          }
        }
      }))
    )
  ];
}
