import { create } from 'zustand';
import { searchLinkedIn } from '@/services/searchService';
import { PersonResult, SearchMetadata, SearchRequest } from '@/types/search';

interface SearchState {
  results: PersonResult[];
  metadata: SearchMetadata | null;
  isLoading: boolean;
  error: string | null;
  fetchResults: (request: SearchRequest) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  metadata: null,
  isLoading: false,
  error: null,

  fetchResults: async (request: SearchRequest) => {
    set({ isLoading: true, error: null, results: [], metadata: null });

    try {
      const response = await searchLinkedIn(request);
      set({
        results: response.results,
        metadata: response.metadata,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An unknown error occurred.',
        isLoading: false,
      });
    }
  },
}));