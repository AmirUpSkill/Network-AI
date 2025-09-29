import { apiCall } from '@/lib/api-client';
import {
  SearchRequest,
  SearchResponse,
  searchResponseSchema,
} from '@/types/search';

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