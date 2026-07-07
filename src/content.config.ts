import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const adoptionDogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/adoption-dogs" }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string(),
        sex: z.enum(["Macho", "Hembra"]),
        age: z.string(),
        weight: z.string(),
        details: z.string(),
        location: z.string().optional(),
        currentNeed: z.enum(["Adopción", "Hogar temporal", "Adopción u hogar temporal"]).default("Adopción"),
        characterSketch: z.string(),
        instagramUrl: z.url().optional(),
        order: z.number().int().optional(),
        gallery: z.array(image()).max(3),
        active: z.boolean().default(true),
        hiddenSince: z.coerce.date().optional(),
        hiddenReason: z.string().optional(),
      })
      .refine((data) => data.active !== false || (data.hiddenSince !== undefined && data.hiddenReason !== undefined), {
        message: "If active is false, hiddenSince and hiddenReason must be provided to keep the record orderly",
        path: ["active"],
      }),
});

const successDogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/success-dogs" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      story: z.string(),
      instagramUrl: z.url().optional(),
      gallery: z.array(image()).max(3).default([]),
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

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    description: z.string(),
    category: z.string().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  "adoption-dogs": adoptionDogs,
  "success-dogs": successDogs,
  supporters,
  blog,
};
