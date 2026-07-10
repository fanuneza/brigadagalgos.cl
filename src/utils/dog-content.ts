import type { CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import type { SharedGalleryPhoto } from "../scripts/gallery/types";
import { createResponsiveGalleryPhoto } from "./responsive-gallery-images";
import { buildCardStoryExcerpt } from "./story-card-copy";

const MAX_DOG_GALLERY_IMAGES = 3;
const META_DESCRIPTION_MAX = 155;

export interface AdoptionDogCard {
  id: string;
  name: string;
  sex: "Macho" | "Hembra";
  age: string;
  ageType: "adulto" | "cachorro";
  weight: string;
  details: string;
  currentNeed: "Adopción" | "Hogar temporal" | "Adopción u hogar temporal";
  characterSketch: string;
  instagramUrl?: string;
  pictures: SharedGalleryPhoto[];
}

export interface StoryDogSummary {
  id: string;
  name: string;
  story: string;
  cardStory: string;
  instagramUrl?: string;
  photos: SharedGalleryPhoto[];
}

export function getEntriesWithGallery<T extends { data: { gallery: unknown[] } }>(entries: T[]): T[] {
  return entries.filter((entry) => entry.data.gallery.length > 0);
}

function getAgeType(age: string): AdoptionDogCard["ageType"] {
  return /cachor/i.test(age) ? "cachorro" : "adulto";
}

export async function buildAdoptionDogCards(entries: CollectionEntry<"adoption-dogs">[]): Promise<AdoptionDogCard[]> {
  return Promise.all(
    entries.map(async (entry) => ({
      id: entry.id,
      name: entry.data.name,
      sex: entry.data.sex,
      age: entry.data.age,
      ageType: getAgeType(entry.data.age),
      weight: entry.data.weight,
      details: entry.data.details,
      currentNeed: entry.data.currentNeed,
      characterSketch: entry.data.characterSketch,
      instagramUrl: entry.data.instagramUrl,
      pictures: (
        await Promise.all(
          entry.data.gallery
            .slice(0, MAX_DOG_GALLERY_IMAGES)
            .map((img: ImageMetadata) => createResponsiveGalleryPhoto(img))
        )
      ).map((photo, i) => ({
        ...photo,
        alt: `${entry.data.name}, galgo en adopción en Chile, foto ${i + 1}`,
      })),
    }))
  );
}

export async function buildStoryDogSummaries(
  entries: CollectionEntry<"success-dogs">[],
  limit?: number
): Promise<StoryDogSummary[]> {
  const selectedEntries = typeof limit === "number" ? entries.slice(0, limit) : entries;

  return Promise.all(
    selectedEntries.map(async (entry) => ({
      id: entry.id,
      name: entry.data.name,
      story: entry.data.story,
      cardStory: buildCardStoryExcerpt(entry.data.story),
      instagramUrl: entry.data.instagramUrl,
      photos: await Promise.all(
        entry.data.gallery
          .slice(0, MAX_DOG_GALLERY_IMAGES)
          .map((img: ImageMetadata) => createResponsiveGalleryPhoto(img))
      ),
    }))
  );
}

export function clampAtWordBoundary(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[,;:.]+$/, "")}…`;
}

export function buildDogMetaDescription(data: { name: string; details: string }): string {
  const base = `${data.name} está en adopción con Brigada Galgos. ${data.details}`;
  return clampAtWordBoundary(base, META_DESCRIPTION_MAX);
}
