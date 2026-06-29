import { getCollection, type CollectionEntry } from "astro:content";
import { createSchemaEndpoint } from "@jdevalk/astro-seo-graph";
import { buildSchemaGraph } from "../../utils/schema";

export const GET = createSchemaEndpoint({
  entries: () => getCollection("blog"),
  mapper: (post: CollectionEntry<"blog">) => {
    const url = `https://brigadagalgos.cl/blog/${post.id}/`;
    const graph = buildSchemaGraph({
      pageType: "blogPost",
      url,
      title: post.data.title,
      description: post.data.description,
      publishDate: post.data.pubDate,
      authorName: post.data.author,
      featureImageUrl: post.data.heroImage,
      category: post.data.category,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return graph["@graph"] as any;
  },
});
