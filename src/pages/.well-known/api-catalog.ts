import { createApiCatalog } from "@jdevalk/astro-seo-graph";
import { SITE } from "../../config/site";

export const GET = createApiCatalog({
  siteUrl: import.meta.env.SITE || SITE.siteUrl,
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
