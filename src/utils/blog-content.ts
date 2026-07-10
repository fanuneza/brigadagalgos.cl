import { getCollection, type CollectionEntry } from "astro:content";

export async function getPublishedBlogPosts(): Promise<CollectionEntry<"blog">[]> {
  return getCollection("blog", ({ data }: CollectionEntry<"blog">) => !data.draft);
}

export function getLatestPublishedBlogDate(posts: CollectionEntry<"blog">[]): Date | undefined {
  return posts.reduce<Date | undefined>(
    (latestDate, post) => (!latestDate || post.data.pubDate > latestDate ? post.data.pubDate : latestDate),
    undefined
  );
}
