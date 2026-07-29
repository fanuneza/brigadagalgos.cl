import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const compatibilityStatus = z.enum(["sí", "no", "caso a caso", "sin información confirmada"]);

const dogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/dogs" }),
  schema: ({ image }) => {
    const sharedDogFields = {
      name: z.string(),
      instagramUrl: z.url().optional(),
      gallery: z.array(image()).max(3),
    };

    const adoptionDog = z
      .object({
        ...sharedDogFields,
        status: z.literal("adopcion"),
        sex: z.enum(["Macho", "Hembra"]),
        age: z.string(),
        weight: z.string(),
        details: z.string(),
        location: z.string().optional(),
        adoptionFacts: z
          .object({
            compatibility: z.object({
              children: compatibilityStatus,
              cats: compatibilityStatus,
              femaleDogs: compatibilityStatus,
              maleDogs: compatibilityStatus,
            }),
            homeGuidance: z.string().optional(),
            exerciseNeeds: z.string().optional(),
            medicalOrSafetyNeeds: z.string().optional(),
            personalityBehavior: z.string().optional(),
          })
          .optional(),
        currentNeed: z.enum(["Adopción", "Hogar temporal", "Adopción u hogar temporal"]).default("Adopción"),
        characterSketch: z.string(),
        order: z.number().int().optional(),
        active: z.boolean().default(true),
        hiddenSince: z.coerce.date().optional(),
        hiddenReason: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        if (data.active === false && (data.hiddenSince === undefined || data.hiddenReason === undefined)) {
          ctx.addIssue({
            code: "custom",
            message: "If active is false, hiddenSince and hiddenReason must be provided to keep the record orderly",
            path: ["active"],
          });
        }
      });

    const successDog = z.object({
      ...sharedDogFields,
      status: z.literal("exito"),
      story: z.string(),
      gallery: z.array(image()).max(3).default([]),
    });

    return z.discriminatedUnion("status", [adoptionDog, successDog]);
  },
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
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      author: z.string(),
      description: z.string(),
      category: z.string().optional(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = {
  dogs,
  supporters,
  blog,
};
