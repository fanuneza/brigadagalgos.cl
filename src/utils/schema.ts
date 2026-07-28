import { makeIds, buildWebSite, buildWebPage, buildArticle, buildPiece } from "@jdevalk/seo-graph-core";
import { SITE } from "../config/site.ts";

const SITE_URL = SITE.siteUrl;

export function buildSchemaGraph(options: {
  pageType: "website" | "blogPost" | "webpage";
  url: string;
  title: string;
  description: string;
  publishDate?: Date;
  featureImageUrl?: string;
  category?: string;
}) {
  const ids = makeIds({ siteUrl: SITE_URL });
  const pieces: Record<string, unknown>[] = [];

  // 1. WebSite (Configurado con SearchAction de búsqueda interna)
  pieces.push(
    buildWebSite(
      {
        url: SITE_URL.endsWith("/") ? SITE_URL : `${SITE_URL}/`,
        name: SITE.name,
        alternateName: [SITE.legalName, "brigadagalgos.cl"],
        description: SITE.description,
        publisher: { "@id": ids.organization("brigada-galgos") },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
      ids
    )
  );

  // 2. Organización (también autora del blog)
  pieces.push(
    buildPiece({
      "@type": "Organization",
      "@id": ids.organization("brigada-galgos"),
      name: SITE.name,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}${SITE.logoPath}`,
      },
    })
  );

  // 3. WebPage y/o Article (si aplica)
  pieces.push(
    buildWebPage(
      {
        url: options.url,
        name: options.title,
        description: options.description,
        isPartOf: { "@id": ids.website },
        breadcrumb: { "@id": ids.breadcrumb(options.url) },
        datePublished: options.publishDate,
      },
      ids
    )
  );

  if (options.pageType === "blogPost") {
    pieces.push(
      buildArticle(
        {
          url: options.url,
          isPartOf: { "@id": ids.webPage(options.url) },
          headline: options.title,
          description: options.description,
          datePublished: options.publishDate || new Date(),
          author: { "@id": ids.organization("brigada-galgos") },
          publisher: { "@id": ids.organization("brigada-galgos") },
          articleSection: options.category || "General",
        },
        ids,
        "BlogPosting"
      )
    );
  }

  return {
    "@context": "https://schema.org",
    "@graph": pieces,
  };
}
