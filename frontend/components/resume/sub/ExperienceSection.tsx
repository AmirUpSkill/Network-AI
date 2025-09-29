// frontend/components/resume/sub/ExperienceSection.tsx
import { AnalysisReport } from '@/types/resume';
import { CheckCircle, XCircle } from 'lucide-react';

interface ExperienceSectionProps {
  experienceMatch: AnalysisReport['experience_match'];
}

export function ExperienceSection({ experienceMatch }: ExperienceSectionProps) {
  return (
    <div className="space-y-4">
      {experienceMatch.map((match, i) => (
        <div key={i} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/20">
          {match.is_match ? (
            <CheckCircle className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 mt-0.5 text-destructive flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="font-medium text-sm text-foreground">{match.job_requirement}</p>
            <p className="text-sm text-muted-foreground mt-1">{match.resume_evidence}</p>
          </div>
        </div>
      ))}
    </div>
  );
}