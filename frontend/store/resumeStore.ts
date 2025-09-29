import { create } from 'zustand';
import { uploadResume, analyzeResume } from '@/services/resumeService';
import { AnalysisReport, AnalysisRequest } from '@/types/resume';

type FlowState = 'AWAITING_UPLOAD' | 'UPLOADING' | 'READY_TO_ANALYZE' | 'ANALYZING' | 'REPORT_READY' | 'ERROR';

interface ResumeState {
  flowState: FlowState;
  fileId: string | null;
  report: AnalysisReport | null;
  error: string | null;
  uploadFile: (file: File) => Promise<void>;
  startAnalysis: (request: AnalysisRequest) => Promise<void>;
  reset: () => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  flowState: 'AWAITING_UPLOAD',
  fileId: null,
  report: null,
  error: null,

  uploadFile: async (file) => {
    set({ flowState: 'UPLOADING', error: null });
    try {
      const { file_id } = await uploadResume(file);
      set({ fileId: file_id, flowState: 'READY_TO_ANALYZE' });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'File upload failed.',
        flowState: 'ERROR',
      });
    }
  },

  startAnalysis: async (request) => {
    set({ flowState: 'ANALYZING', error: null });
    try {
      const reportData = await analyzeResume(request);
      set({ report: reportData, flowState: 'REPORT_READY' });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Analysis failed.',
        flowState: 'ERROR',
      });
    }
  },

  reset: () => {
    set({
      flowState: 'AWAITING_UPLOAD',
      fileId: null,
      report: null,
      error: null,
    });
  },
}));