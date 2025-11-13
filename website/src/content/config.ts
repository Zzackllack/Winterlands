import { defineCollection, z } from 'astro:content';

const faqs = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    category: z.string().default('General'),
    order: z.number().default(0),
  }),
});

export const collections = { faqs };
