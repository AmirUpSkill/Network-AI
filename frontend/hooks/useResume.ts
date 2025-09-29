import { useResumeStore } from '@/store/resumeStore';

export const useResume = () => {
  const state = useResumeStore();
  return state;
};