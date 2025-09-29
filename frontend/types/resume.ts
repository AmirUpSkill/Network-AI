// frontend/types/resume.ts
import { z } from 'zod';

// --- API Response for File Upload ---
export const uploadResponseSchema = z.object({
  file_id: z.string().uuid(),
  message: z.string(),
});

// --- API Request for Analysis ---
export const analysisRequestSchema = z.object({
  file_id: z.string().uuid(),
  job_url: z.string().url("Please enter a valid URL."),
});

// --- Schemas for the Analysis Report ---
export const keywordAnalysisSchema = z.object({
  matched_keywords: z.array(z.string()),
  missing_keywords: z.array(z.string()),
});

export const experienceMatchSchema = z.object({
  job_requirement: z.string(),
  resume_evidence: z.string(),
  is_match: z.boolean(),
});

export const analysisReportSchema = z.object({
  match_score: z.number(),
  summary: z.string(),
  keyword_analysis: keywordAnalysisSchema,
  experience_match: z.array(experienceMatchSchema),
  suggestions: z.array(z.string()),
});

// --- Inferred TypeScript Types ---
export type UploadResponse = z.infer<typeof uploadResponseSchema>;
export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;
export type AnalysisReport = z.infer<typeof analysisReportSchema>;