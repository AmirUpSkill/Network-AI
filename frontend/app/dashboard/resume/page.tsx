// frontend/app/dashboard/resume/page.tsx
'use client';
import { useResume } from "@/hooks/useResume";
import { UploadDropzone } from "@/components/resume/UploadDropzone";
import { AnalysisPanel } from "@/components/resume/AnalysisPanel";
import { useEffect } from "react";

export default function ResumePage() {
    const { flowState, reset } = useResume();

    // Reset the store when the component unmounts to ensure a clean state next time
    useEffect(() => {
        return () => {
            reset();
        }
    }, [reset]);

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-foreground"> AI Resume </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Upload your resume and analyze it against any job posting to get an AI-powered match report.
                </p>
            </div>

            { (flowState === 'AWAITING_UPLOAD' || flowState === 'UPLOADING' || flowState === 'ERROR') && <UploadDropzone /> }
            { (flowState === 'READY_TO_ANALYZE' || flowState === 'ANALYZING' || flowState === 'REPORT_READY') && <AnalysisPanel /> }
        </div>
    );
}