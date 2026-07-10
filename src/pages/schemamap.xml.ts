import { createSchemaMap, gitLastmod } from "@jdevalk/astro-seo-graph";
import { getLatestPublishedBlogDate, getPublishedBlogPosts } from "../utils/blog-content";

const latestBlogPublication = getLatestPublishedBlogDate(await getPublishedBlogPosts());

export const GET = createSchemaMap({
  siteUrl: "https://brigadagalgos.cl",
  entries: [
    {
      path: "/schema/post.json",
      lastModified: latestBlogPublication || gitLastmod("src/pages/schema/post.json.ts") || new Date(),
    },
  ],
});
