// frontend/components/search/SearchEmptyState.tsx
import { FileQuestion } from 'lucide-react';

interface SearchEmptyStateProps {
  type: 'initial' | 'no-results';
  onSearch?: (query: string) => void;
}

const SEARCH_TIPS = [
  '• Use specific job titles or skills',
  '• Include location keywords',
  '• Try different category filters',
  '• Use broader or alternative terms'
];

export function SearchEmptyState({ type, onSearch }: SearchEmptyStateProps) {
  if (type === 'initial') {
    return null; // Completely removed the initial empty state section
  }

  return (
    <div className="text-center py-16 max-w-lg mx-auto space-y-8">
      <div className="space-y-4">
        <div className="rounded-full bg-muted p-6 w-fit mx-auto">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-2xl mb-3">No Results Found</h3>
          <p className="text-muted-foreground text-base leading-relaxed">
            We couldn't find any profiles matching your search criteria.
            Try adjusting your search terms or filters for better results.
          </p>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-6 text-sm">
        <h4 className="font-medium text-foreground mb-3">Search Tips:</h4>
        <ul className="text-left space-y-2 text-muted-foreground max-w-xs mx-auto">
          {SEARCH_TIPS.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}