import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const adoptionDogs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/adoption-dogs' }),
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
