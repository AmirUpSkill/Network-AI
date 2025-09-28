// frontend/components/search/SearchErrorState.tsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SearchErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function SearchErrorState({ error, onRetry }: SearchErrorStateProps) {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <AlertCircle className="h-5 w-5" />
        <div className="flex-1">
          <AlertDescription className="text-sm mb-3">
            <strong>Search failed:</strong> {error}
          </AlertDescription>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
}