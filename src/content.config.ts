import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const adoptionDogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/adoption-dogs" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      sex: z.enum(["Macho", "Hembra"]),
      age: z.string(),
      weight: z.string(),
      details: z.string(),
      order: z.number().int().optional(),
      gallery: z.array(image()),
    }),
});

const successDogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/success-dogs" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      story: z.string(),
      gallery: z.array(image()),
    }),
});

const supporters = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/supporters" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      thanksLabel: z.string().optional(),
      thanksUrl: z.url().optional(),
      website: z.url(),
      kind: z.enum(["Institución", "Empresa", "Persona", "Fundación", "Colectivo", "Veterinaria"]),
      order: z.number().int().optional(),
      logo: image(),
      logoAlt: z.string(),
    }),
});

export const collections = {
  "adoption-dogs": adoptionDogs,
  "success-dogs": successDogs,
  supporters,
};
