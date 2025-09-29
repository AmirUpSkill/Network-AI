// frontend/components/resume/sub/KeywordSection.tsx
import { Badge } from '@/components/ui/badge';
import { AnalysisReport } from '@/types/resume';

interface KeywordSectionProps {
  keywordAnalysis: AnalysisReport['keyword_analysis'];
}

export function KeywordSection({ keywordAnalysis }: KeywordSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">
          ✅ Matched Keywords ({keywordAnalysis.matched_keywords.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {keywordAnalysis.matched_keywords.map((keyword, i) => (
            <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-destructive dark:text-red-400">
          ❌ Missing Keywords ({keywordAnalysis.missing_keywords.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {keywordAnalysis.missing_keywords.map((keyword, i) => (
            <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}