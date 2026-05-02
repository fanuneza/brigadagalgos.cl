import { defineCollection, z } from 'astro:content';

const adoptionDogs = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      sex: z.enum(['Macho', 'Hembra']),
      age: z.string(),
      weight: z.string(),
      details: z.string(),
      order: z.number().int().optional(),
      gallery: z.array(image()),
    }),
});

export const collections = {
  'adoption-dogs': adoptionDogs,
};
