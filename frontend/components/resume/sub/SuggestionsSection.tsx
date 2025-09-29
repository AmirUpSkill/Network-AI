// frontend/components/resume/sub/SuggestionsSection.tsx
import { AnalysisReport } from '@/types/resume';
import { Lightbulb } from 'lucide-react';

interface SuggestionsSectionProps {
  suggestions: AnalysisReport['suggestions'];
}

export function SuggestionsSection({ suggestions }: SuggestionsSectionProps) {
  return (
    <ul className="space-y-3">
      {suggestions.map((suggestion, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
          <span className="text-muted-foreground">{suggestion}</span>
        </li>
      ))}
    </ul>
  );
}