// frontend/app/dashboard/search/page.tsx
'use client'

import { useState } from 'react';
import { SearchInterface } from '@/components/search/SearchInterface';
import { SearchResultsGrid } from '@/components/search/SearchResultsGrid';
import { SearchLoadingState } from '@/components/search/SearchLoadingState';
import { SearchErrorState } from '@/components/search/SearchErrorState';
import { SearchEmptyState } from '@/components/search/SearchEmptyState';
import { SearchMetadata } from '@/components/search/SearchMetadata';
import { ProfileDetailModal } from '@/components/search/ProfileDetailModal';
import { useSearch } from '@/hooks/useSearch';
import { PersonResult } from '@/types/search';

export default function SearchPage() {
  const { results, metadata, isLoading, error, fetchResults } = useSearch();
  const [selectedProfile, setSelectedProfile] = useState<PersonResult | null>(null);

  const handleViewDetails = (profile: PersonResult) => {
    setSelectedProfile(profile);
  };

  const handleRetry = () => {
    // Re-run the last search - you might want to store the last search params in your store
    // For now, we'll just clear the error state
    window.location.reload();
  };

  const handleSuggestionSearch = (query: string) => {
    fetchResults({
      query,
      category: 'linkedin profile',
      limit: 10,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">AI Network Search</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI-powered LinkedIn networking app that semantically searches profiles, companies, 
          and jobs while analyzing resumes against opportunities for fresh graduates.
        </p>
      </div>

      {/* Search Interface */}
      <div className="max-w-4xl mx-auto">
        <SearchInterface />
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && <SearchLoadingState />}

        {/* Error State */}
        {error && !isLoading && (
          <SearchErrorState error={error} onRetry={handleRetry} />
        )}

        {/* Results */}
        {!isLoading && !error && results.length > 0 && (
          <>
            {metadata && <SearchMetadata metadata={metadata} />}
            <SearchResultsGrid 
              results={results} 
              onViewDetails={handleViewDetails}
            />
          </>
        )}

        {/* Empty States */}
        {!isLoading && !error && results.length === 0 && !metadata && (
          <SearchEmptyState 
            type="initial" 
            onSearch={handleSuggestionSearch}
          />
        )}

        {!isLoading && !error && results.length === 0 && metadata && (
          <SearchEmptyState type="no-results" />
        )}
      </div>

      {/* Footer */}
      <div className="text-center pt-16 pb-8">
        <p className="text-sm text-muted-foreground">
          Powered by Exa AI and Gemini • Network AI Search Service
        </p>
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}