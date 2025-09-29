// frontend/components/resume/ResumeReport.tsx
'use client';

import { AnalysisReport, KeywordAnalysis, ExperienceMatchItem } from '@/types/resume';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle } from 'lucide-react';

interface ResumeReportProps {
  report: AnalysisReport | null;  // Allow null explicitly
}

export function ResumeReport({ report }: ResumeReportProps) {
  // Null guard: If report is null, show a placeholder
  if (!report) {
    return (
      <Card className="flex-1">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Report loading...</p>
        </CardContent>
      </Card>
    );
  }

  const { match_score, summary, keyword_analysis, experience_match, suggestions } = report;

  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Analysis Report</h3>
          <Badge variant={match_score >= 70 ? 'default' : 'secondary'}>
            {match_score}%
          </Badge>
        </div>
        <Progress value={match_score} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Summary</h4>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Matched Keywords ({keyword_analysis.matched_keywords.length})</h4>
            <div className="flex flex-wrap gap-1">
              {keyword_analysis.matched_keywords.map((kw, i) => (
                <Badge key={i} variant="default" className="text-xs">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Missing Keywords ({keyword_analysis.missing_keywords.length})</h4>
            <div className="flex flex-wrap gap-1">
              {keyword_analysis.missing_keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Experience Matches</h4>
          <div className="space-y-3">
            {experience_match.map((match: ExperienceMatchItem, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  {match.is_match ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{match.job_requirement}</p>
                    <p className="text-sm text-muted-foreground mt-1">{match.resume_evidence}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Suggestions</h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}