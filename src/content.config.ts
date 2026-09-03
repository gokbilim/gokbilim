import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const icerikler = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
    importance: z.string().optional(),
    city: z.string().optional(),
    eventDate: z.coerce.date().optional(),
    period: z.string().optional(),
    kunye: z.object({
      konum: z.string().optional(),
      rakim: z.string().optional(),
      kurum: z.string().optional(),
      kurulus: z.string().optional(),
      kod: z.string().optional(),
    }).optional(),
  }),
});

const blog = defineCollection({
  // Load Markdown and MDX files in the src/content/blog/ directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  'blog': blog, 
  'icerikler': icerikler,
};