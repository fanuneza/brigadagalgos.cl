import type { CollectionEntry } from "astro:content";
import type { SharedGalleryPhoto } from "../scripts/shared-gallery";
import { createResponsiveGalleryPhoto } from "./responsive-gallery-images";

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
  instagramUrl?: string;
  photos: SharedGalleryPhoto[];
}

export function getEntriesWithGallery<T extends { data: { gallery: unknown[] } }>(entries: T[]): T[] {
  return entries.filter((entry) => entry.data.gallery.length > 0);
}

export function getAgeType(age: string): AdoptionDogCard["ageType"] {
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
      pictures: await Promise.all(entry.data.gallery.map((img) => createResponsiveGalleryPhoto(img))),
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
      instagramUrl: entry.data.instagramUrl,
      photos: await Promise.all(entry.data.gallery.map((img) => createResponsiveGalleryPhoto(img))),
    }))
  );
}
