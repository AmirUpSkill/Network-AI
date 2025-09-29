import { createClient } from '@/lib/supabase';
import { AnalysisRequest, analysisReportSchema, UploadResponse, uploadResponseSchema } from '@/types/resume';
import { apiCall } from '@/lib/api-client';

export const uploadResume = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed.');
  }

  const responseData = await response.json();
  return uploadResponseSchema.parse(responseData);
};

export const analyzeResume = async (request: AnalysisRequest) => {
  const responseData = await apiCall(`/resume/analyze-auto`, {
    method: 'POST',
    body: JSON.stringify(request),
  });

  return analysisReportSchema.parse(responseData);
};