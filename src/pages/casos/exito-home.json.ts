import { getCollection } from "astro:content";
import { createResponsiveGalleryPhoto } from "../../utils/responsive-gallery-images";
import { shuffle } from "../../utils/shuffle";

export const prerender = true;

export async function GET() {
  const storyDogs = shuffle(await getCollection("success-dogs")).filter((entry) => entry.data.gallery.length > 0);
  const payload = await Promise.all(
    storyDogs.map(async (entry) => ({
      id: entry.id,
      name: entry.data.name,
      story: entry.data.story,
      instagramUrl: entry.data.instagramUrl,
      photos: await Promise.all(entry.data.gallery.map((img) => createResponsiveGalleryPhoto(img))),
    }))
  );

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
