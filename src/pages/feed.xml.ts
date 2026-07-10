import rss from "@astrojs/rss";
import { type CollectionEntry } from "astro:content";
import { SITE } from "../config/site";
import { getPublishedBlogPosts } from "../utils/blog-content";

export async function GET(context: { site: URL }) {
  const posts = await getPublishedBlogPosts();
  const site = context.site || SITE.siteUrl;

  return rss({
    title: `${SITE.name} | Blog`,
    description: SITE.description,
    site,
    items: posts.map((post: CollectionEntry<"blog">) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      customData: post.data.heroImage
        ? `<media:content url="${new URL(post.data.heroImage.src, site).href}" medium="image" />`
        : undefined,
    })),
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
    },
    customData: `<language>es-CL</language>`,
  });
}
