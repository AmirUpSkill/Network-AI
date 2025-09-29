// frontend/components/resume/ReportDisplay.tsx
'use client';

import { AnalysisReport } from '@/types/resume';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BrainCircuit, ListChecks, Target, Wand2 } from 'lucide-react';
import { useResume } from '@/hooks/useResume';

import { MatchScoreCircle } from './sub/MatchScoreCircle';
import { KeywordSection } from './sub/KeywordSection';
import { ExperienceSection } from './sub/ExperienceSection';
import { SuggestionsSection } from './sub/SuggestionsSection';

interface ReportDisplayProps {
  report: AnalysisReport;
}

export function ReportDisplay({ report }: ReportDisplayProps) {
  const { reset } = useResume();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">Analysis Report</CardTitle>
            <CardDescription>
              Here's how your resume stacks up against the job description.
            </CardDescription>
          </div>
          <MatchScoreCircle score={report.match_score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* AI Summary Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Summary</h3>
          </div>
          <blockquote className="border-l-2 pl-6 italic text-muted-foreground">
            {report.summary}
          </blockquote>
        </section>

        <Separator />

        {/* Keyword Analysis Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <ListChecks className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Keyword Analysis</h3>
          </div>
          <KeywordSection keywordAnalysis={report.keyword_analysis} />
        </section>

        <Separator />

        {/* Experience Match Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Experience Alignment</h3>
          </div>
          <ExperienceSection experienceMatch={report.experience_match} />
        </section>

        <Separator />

        {/* Improvement Suggestions Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Wand2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Improvement Suggestions</h3>
          </div>
          <SuggestionsSection suggestions={report.suggestions} />
        </section>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={reset} variant="outline">
          Analyze Another Resume
        </Button>
      </CardFooter>
    </Card>
  );
}