import { getCollection } from "astro:content";
import { buildStoryDogSummaries, getEntriesWithGallery } from "../../utils/dog-content";
import { shuffle } from "../../utils/shuffle";

export const prerender = true;

export async function GET() {
  const storyDogs = shuffle(getEntriesWithGallery(await getCollection("success-dogs")));
  const payload = await buildStoryDogSummaries(storyDogs);

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
