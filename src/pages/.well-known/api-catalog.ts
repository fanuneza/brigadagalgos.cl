import { createApiCatalog } from "@jdevalk/astro-seo-graph";

export const GET = createApiCatalog({
  siteUrl: "https://brigadagalgos.cl",
  schemaEndpoints: [
    {
      path: "/schema/post.json",
      schemaType: "BlogPosting",
      serviceDoc: "/blog/",
    },
  ],
  schemaMap: {
    path: "/schemamap.xml",
    serviceDoc: "/blog/",
  },
});
