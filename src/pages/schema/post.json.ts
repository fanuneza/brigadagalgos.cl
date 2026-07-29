import { type CollectionEntry } from "astro:content";
import { createSchemaEndpoint } from "@jdevalk/astro-seo-graph";
import { getPublishedBlogPosts } from "../../utils/blog-content";
import { buildBlogPostingGraph } from "../../utils/structured-data";

export const GET = createSchemaEndpoint({
  entries: getPublishedBlogPosts,
  mapper: (post: CollectionEntry<"blog">) => {
    const url = `https://brigadagalgos.cl/blog/${post.id}/`;
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
