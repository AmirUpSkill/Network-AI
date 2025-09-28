import { apiCall } from '@/lib/api-client';
import {
  SearchRequest,
  SearchResponse,
  searchResponseSchema,
} from '@/types/search';

/**
 * Performs a LinkedIn search by calling the backend API.
 * @param request The search parameters (query, category, limit).
 * @returns A promise that resolves to the validated search response.
 */
export const searchLinkedIn = async (
  request: SearchRequest
): Promise<SearchResponse> => {
  try {
    const responseData = await apiCall<SearchResponse>('/search/linkedin', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return searchResponseSchema.parse(responseData);
  } catch (error) {
    console.error('API searchLinkedIn failed:', error);
    throw error;
  }
};