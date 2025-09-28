// frontend/hooks/useSearch.ts
import { useSearchStore } from '@/store/searchStore';

/**
 * Custom hook to access the search state and actions.
 * This provides a clean interface for components to use the search functionality.
 */
export const useSearch = () => {
  const results = useSearchStore((state) => state.results);
  const metadata = useSearchStore((state) => state.metadata);
  const isLoading = useSearchStore((state) => state.isLoading);
  const error = useSearchStore((state) => state.error);
  const fetchResults = useSearchStore((state) => state.fetchResults);

  return { results, metadata, isLoading, error, fetchResults };
};