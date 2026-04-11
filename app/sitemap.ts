import type { MetadataRoute } from "next";
import { getSeoPages } from "@/lib/seo-data";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, lastModified: new Date() },
    ...getSeoPages().map((page) => ({
      url: `${siteConfig.url}/${page.slug}/`,
      lastModified: new Date()
    }))
  ];
}
