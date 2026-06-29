import { createSchemaMap, gitLastmod } from "@jdevalk/astro-seo-graph";

export const GET = createSchemaMap({
  siteUrl: "https://brigadagalgos.cl",
  entries: [
    {
      path: "/schema/post.json",
      lastModified: gitLastmod("src/pages/schema/post.json.ts") || new Date(),
    },
  ],
});
