import { z } from 'zod';

// --- Reusable Sub-Schemas ---
export const workExperienceItemSchema = z.object({
  title: z.string().nullable(),
  company: z.string().nullable(),
  duration: z.string().nullable(),
  location: z.string().nullable(),
});

export const educationItemSchema = z.object({
  institution: z.string().nullable(),
  degree: z.string().nullable(),
  field_of_study: z.string().nullable(),
});

// --- Main Result Schema ---
export const personResultSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string().nullable(),
  author: z.string().nullable(),
  location: z.string().nullable(),
  summary: z.string().nullable(),
  image: z.string().url().nullable(),
  work_experience: z.array(workExperienceItemSchema),
  education: z.array(educationItemSchema),
  skills: z.array(z.string()),
});

// --- API Request & Response Schemas ---
export const searchRequestSchema = z.object({
  query: z.string().min(3, "Query must be at least 3 characters long.").max(500),
  category: z.enum(["linkedin profile", "company", "job offers", "pages"]),
  limit: z.number().min(1).max(50),
});

export const searchMetadataSchema = z.object({
  total_results: z.number(),
  search_time_ms: z.number(),
  enhanced_query: z.string().nullable(),
});

export const searchResponseSchema = z.object({
  results: z.array(personResultSchema),
  metadata: searchMetadataSchema,
});


// --- Inferred TypeScript Types ---
export type WorkExperienceItem = z.infer<typeof workExperienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type PersonResult = z.infer<typeof personResultSchema>;
export type SearchRequest = z.infer<typeof searchRequestSchema>;
export type SearchMetadata = z.infer<typeof searchMetadataSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;