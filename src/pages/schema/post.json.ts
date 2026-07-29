import { type CollectionEntry } from "astro:content";
import { createSchemaEndpoint } from "@jdevalk/astro-seo-graph";
import { SITE } from "../../config/site";
import { getPublishedBlogPosts } from "../../utils/blog-content";
import { buildBlogPostingGraph } from "../../utils/structured-data";

const siteUrl = (import.meta.env.SITE || SITE.siteUrl).replace(/\/+$/, "");

export const GET = createSchemaEndpoint({
  entries: getPublishedBlogPosts,
  mapper: (post: CollectionEntry<"blog">) => {
    const url = `${siteUrl}/blog/${post.id}/`;
    const graph = buildBlogPostingGraph({
      url,
      title: post.data.title,
      description: post.data.description,
      publishDate: post.data.pubDate,
      category: post.data.category,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return graph["@graph"] as any;
  },
});
