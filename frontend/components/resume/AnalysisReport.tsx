// frontend/components/resume/AnalysisReport.tsx
'use client';

import { motion } from 'framer-motion';
import { AnalysisReport as ReportType } from '@/types/resume';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisReportProps {
  report: ReportType;
}

export function AnalysisReport({ report }: AnalysisReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-300';
    if (score >= 60) return 'from-amber-500 to-amber-300';
    return 'from-red-500 to-red-300';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-y-auto custom-scrollbar"
    >
      <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-700">
        <div className="p-6 space-y-6">
          {/* Score Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4"
          >
            <div className="relative inline-block">
              <div className={cn(
                "text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                getScoreGradient(report.match_score)
              )}>
                {report.match_score}%
              </div>
              <div className="text-sm text-slate-400 mt-1 font-medium">Match Score</div>
            </div>
            
            {/* Custom styled progress bar */}
            <div className="relative w-full max-w-xs mx-auto">
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", getProgressColor(report.match_score))}
                  initial={{ width: 0 }}
                  animate={{ width: `${report.match_score}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gray-800/40 rounded-lg border border-gray-700"
          >
            <div className="flex items-start gap-3">
              <Target className="h-4 w-4 mt-0.5 text-slate-400 flex-shrink-0" />
              <p className="text-sm text-slate-300 leading-relaxed">
                {report.summary}
              </p>
            </div>
          </motion.div>

          {/* Keywords Analysis */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-medium text-slate-100">
                  Matched Keywords ({report.keyword_analysis.matched_keywords.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.keyword_analysis.matched_keywords.map((keyword, i) => (
                  <Badge
                    key={i}
                    className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/15 transition-colors"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <h4 className="text-sm font-medium text-slate-100">
                  Missing Keywords ({report.keyword_analysis.missing_keywords.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.keyword_analysis.missing_keywords.map((keyword, i) => (
                  <Badge
                    key={i}
                    className="bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/15 transition-colors"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Experience Matches */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <h4 className="text-sm font-medium text-slate-100">Experience Analysis</h4>
            </div>
            <div className="space-y-3">
              {report.experience_match.map((match, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="p-4 bg-gray-800/40 rounded-lg border border-gray-700 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {match.is_match ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-200">
                        {match.job_requirement}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {match.resume_evidence}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-medium text-slate-100">Improvement Suggestions</h4>
            </div>
            <div className="space-y-2">
              {report.suggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10"
                >
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}