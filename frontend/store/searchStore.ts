// frontend/store/searchStore.ts
import { create } from 'zustand';
import { searchLinkedIn } from '@/services/searchService';
import { PersonResult, SearchMetadata, SearchRequest } from '@/types/search';

// 💡 FIX 1: Define the interface for the store's state and actions.
interface SearchState {
  results: PersonResult[];
  metadata: SearchMetadata | null;
  isLoading: boolean;
  error: string | null;
  fetchResults: (request: SearchRequest) => Promise<void>;
}

// 💡 FIX 2: Pass the <SearchState> interface to the `create` function.
export const useSearchStore = create<SearchState>((set) => ({
  // --- Initial State ---
  results: [],
  metadata: null,
  isLoading: false,
  error: null,

  // --- Actions ---
  fetchResults: async (request: SearchRequest) => {
    // Set loading state and clear previous results/errors
    set({ isLoading: true, error: null, results: [], metadata: null });

    try {
      // Call our API service
      const response = await searchLinkedIn(request);
      // On success, update the state with results and metadata
      set({
        results: response.results,
        metadata: response.metadata,
        isLoading: false,
      });
    } catch (err) {
      // On failure, set the error message
      set({
        error: err instanceof Error ? err.message : 'An unknown error occurred.',
        isLoading: false,
      });
    }
  },
}));