'use client'

import { PersonResult } from '@/types/search';
import { ProfileCard } from './ProfileCard';

interface SearchResultsGridProps {
  results: PersonResult[];
  onViewDetails?: (profile: PersonResult) => void;
  className?: string;
}

export function SearchResultsGrid({ 
  results, 
  onViewDetails, 
  className 
}: SearchResultsGridProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4 ${className}`}>
      {results.map((profile, index) => (
        <ProfileCard
          key={profile.id || index}
          profile={profile}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}