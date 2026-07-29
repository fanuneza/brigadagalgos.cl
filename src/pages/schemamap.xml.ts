import { createSchemaMap, gitLastmod } from "@jdevalk/astro-seo-graph";
import { SITE } from "../config/site";
import { getLatestPublishedBlogDate, getPublishedBlogPosts } from "../utils/blog-content";

const latestBlogPublication = getLatestPublishedBlogDate(await getPublishedBlogPosts());

export const GET = createSchemaMap({
  siteUrl: import.meta.env.SITE || SITE.siteUrl,
  entries: [
    {
      path: "/schema/post.json",
      lastModified: latestBlogPublication || gitLastmod("src/pages/schema/post.json.ts") || new Date(),
    },
  ],
});
