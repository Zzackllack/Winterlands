import { defineCollection, z } from 'astro:content';

const mods = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    side: z.enum(['client', 'server', 'both']).default('both'),
    version: z.string(),
    homepage: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    lastUpdated: z.date().optional(),
  }),
});

const licenses = defineCollection({
  type: 'content',
  schema: z.object({
    mod: z.string(),
    license: z.string(),
    permissions: z.array(z.string()).default([]),
    restrictions: z.array(z.string()).default([]),
    attribution: z.string().optional(),
    source: z.string().url().optional(),
  }),
});

const faqs = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    category: z.string().default('General'),
    order: z.number().default(0),
  }),
});

export const collections = { mods, licenses, faqs };
