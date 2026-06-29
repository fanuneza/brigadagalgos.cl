import { getCollection, type CollectionEntry } from "astro:content";
import { createMarkdownEndpoint } from "@jdevalk/astro-seo-graph";

export const getStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts.map((p: CollectionEntry<"blog">) => ({ params: { slug: p.id } }));
};

export const GET = createMarkdownEndpoint({
  entries: () => getCollection("blog"),
  mapper: (post: CollectionEntry<"blog">, slug) =>
    post.id !== slug
      ? null
      : {
          frontmatter: {
            title: post.data.title,
            canonical: `https://brigadagalgos.cl/blog/${post.id}/`,
            pubDate: post.data.pubDate,
            author: post.data.author,
            description: post.data.description,
            category: post.data.category,
          },
          body: post.body ?? "",
        },
});
