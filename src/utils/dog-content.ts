import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import type { SharedGalleryPhoto } from "./gallery";
import { createResponsiveGalleryPhoto } from "./responsive-gallery-images";
import { shuffle } from "./shuffle";

const MAX_DOG_GALLERY_IMAGES = 3;
const META_DESCRIPTION_MAX = 155;
const STORY_CARD_MAX_CHARACTERS = 260;

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

// Unified `dogs` collection: canonical query layer. The legacy collections keep
// feeding the site until wave 2 switches consumers to these functions.

type DogsEntry = CollectionEntry<"dogs">;
type DogsEntryData = DogsEntry["data"];

export type AdoptionDogEntry = Omit<DogsEntry, "data"> & { data: Extract<DogsEntryData, { status: "adopcion" }> };
export type SuccessDogEntry = Omit<DogsEntry, "data"> & { data: Extract<DogsEntryData, { status: "exito" }> };
export type DogStatus = DogsEntryData["status"];

export function isAdoptionDog(entry: DogsEntry): entry is AdoptionDogEntry {
  return entry.data.status === "adopcion";
}

export function isSuccessDog(entry: DogsEntry): entry is SuccessDogEntry {
  return entry.data.status === "exito";
}

export function filterActiveAdoptionDogs(entries: AdoptionDogEntry[]): AdoptionDogEntry[] {
  return entries.filter((entry) => entry.data.active !== false);
}

export async function getDogs(status: "adopcion"): Promise<AdoptionDogEntry[]>;
export async function getDogs(status: "exito"): Promise<SuccessDogEntry[]>;
export async function getDogs(status: DogStatus): Promise<DogsEntry[]> {
  const dogs: DogsEntry[] = await getCollection("dogs");
  return status === "adopcion" ? dogs.filter(isAdoptionDog) : dogs.filter(isSuccessDog);
}

export async function getActiveDogs(): Promise<AdoptionDogEntry[]> {
  return filterActiveAdoptionDogs(await getDogs("adopcion"));
}

// Structural input types shared by both the legacy collections and the unified
// `dogs` collection, so the card builders accept either entry type.

interface AdoptionDogCardEntry {
  id: string;
  data: {
    name: string;
    sex: "Macho" | "Hembra";
    age: string;
    weight: string;
    details: string;
    currentNeed: "Adopción" | "Hogar temporal" | "Adopción u hogar temporal";
    characterSketch: string;
    instagramUrl?: string;
    gallery: ImageMetadata[];
  };
}

interface StoryDogSummaryEntry {
  id: string;
  data: {
    name: string;
    story: string;
    instagramUrl?: string;
    gallery: ImageMetadata[];
  };
}

export function getEntriesWithGallery<T extends { data: { gallery: unknown[] } }>(entries: T[]): T[] {
  return entries.filter((entry) => entry.data.gallery.length > 0);
}

export async function getActiveAdoptionDogCards(limit?: number): Promise<AdoptionDogCard[]> {
  const selected = shuffle(await getActiveDogs());
  return buildAdoptionDogCards(typeof limit === "number" ? selected.slice(0, limit) : selected);
}

export async function getShuffledStorySummaries(
  options: { limit?: number; requireGallery?: boolean } = {}
): Promise<StoryDogSummary[]> {
  const storyEntries = await getDogs("exito");
  const eligible = options.requireGallery ? getEntriesWithGallery(storyEntries) : storyEntries;
  return buildStoryDogSummaries(shuffle(eligible), options.limit);
}

function getAgeType(age: string): AdoptionDogCard["ageType"] {
  return /cachor/i.test(age) ? "cachorro" : "adulto";
}

export async function buildAdoptionDogCards(entries: AdoptionDogCardEntry[]): Promise<AdoptionDogCard[]> {
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
  entries: StoryDogSummaryEntry[],
  limit?: number
): Promise<StoryDogSummary[]> {
  const selectedEntries = typeof limit === "number" ? entries.slice(0, limit) : entries;

  return Promise.all(
    selectedEntries.map(async (entry) => ({
      id: entry.id,
      name: entry.data.name,
      story: entry.data.story,
      cardStory: truncateAtWordBoundary(entry.data.story, { preferSentenceBreak: true }),
      instagramUrl: entry.data.instagramUrl,
      photos: await Promise.all(
        entry.data.gallery
          .slice(0, MAX_DOG_GALLERY_IMAGES)
          .map((img: ImageMetadata) => createResponsiveGalleryPhoto(img))
      ),
    }))
  );
}

interface TruncateOptions {
  preferSentenceBreak?: boolean;
  maxCharacters?: number;
}

export function truncateAtWordBoundary(
  text: string,
  { preferSentenceBreak = false, maxCharacters = STORY_CARD_MAX_CHARACTERS }: TruncateOptions = {}
): string {
  const normalized = preferSentenceBreak ? text.replace(/\s+/g, " ").trim() : text;

  if (normalized.length <= maxCharacters) {
    return normalized;
  }

  if (preferSentenceBreak) {
    const slice = normalized.slice(0, maxCharacters + 1);
    const sentenceBreak = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));

    if (sentenceBreak >= Math.floor(maxCharacters * 0.6)) {
      return slice.slice(0, sentenceBreak + 1).trim();
    }

    const wordBreak = slice.lastIndexOf(" ");
    const safeBreak = wordBreak >= Math.floor(maxCharacters * 0.75) ? wordBreak : maxCharacters;

    return `${slice.slice(0, safeBreak).trimEnd()}…`;
  }

  const slice = normalized.slice(0, maxCharacters - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[,;:.]+$/, "")}…`;
}

export function buildDogMetaDescription(data: { name: string; details: string }): string {
  const base = `${data.name} está en adopción con Brigada Galgos. ${data.details}`;
  return truncateAtWordBoundary(base, { maxCharacters: META_DESCRIPTION_MAX });
}
