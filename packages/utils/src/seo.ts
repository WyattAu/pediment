export interface SeoMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

export function buildSeoMeta(meta: SeoMeta): Record<string, string> {
  return {
    "og:title": meta.title,
    "og:description": meta.description,
    "og:image": meta.image || "/og-default.png",
    "og:url": meta.url || "",
    "og:type": meta.type || "website",
    "twitter:card": "summary_large_image",
    "twitter:title": meta.title,
    "twitter:description": meta.description,
    "twitter:image": meta.image || "/og-default.png",
  };
}
