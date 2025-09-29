// frontend/components/resume/AnalysisPanel.tsx
'use client';
import { useResume } from "@/hooks/useResume";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ScanningAnimation } from "./ScanningAnimation";
import { ReportDisplay } from "./ReportDisplay";

export function AnalysisPanel() {
    const { fileId, flowState, report, startAnalysis, reset } = useResume();
    const [jobUrl, setJobUrl] = useState('');

    const handleAnalysis = () => {
        if (fileId && jobUrl) {
            startAnalysis({ file_id: fileId, job_url: jobUrl });
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Panel: Job URL Input */}
            <Card>
                <CardHeader>
                    <CardTitle>Analyze Resume</CardTitle>
                    <CardDescription>Enter the URL of the job posting to begin the analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="job-url">Job Posting URL</Label>
                        <Input 
                            id="job-url"
                            placeholder="https://linkedin.com/jobs/..."
                            value={jobUrl}
                            onChange={(e) => setJobUrl(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAnalysis} disabled={flowState === 'ANALYZING' || !jobUrl} className="w-full">
                        {flowState === 'ANALYZING' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Analyze
                    </Button>
                    <Button onClick={reset} variant="outline" className="w-full">
                        Start Over
                    </Button>
                </CardContent>
            </Card>

            {/* Right Panel: Report Display */}
            <div className="min-h-[400px]">
                {flowState === 'ANALYZING' && <ScanningAnimation />}
                {flowState === 'REPORT_READY' && report && <ReportDisplay report={report} />}
                {flowState === 'READY_TO_ANALYZE' && (
                    <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">The analysis report will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}