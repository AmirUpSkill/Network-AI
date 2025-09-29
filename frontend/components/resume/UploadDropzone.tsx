// frontend/components/resume/UploadDropzone.tsx
'use client';

import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, FileCheck, AlertTriangle } from 'lucide-react';
import { useResume } from '@/hooks/useResume';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';

export function UploadDropzone() {
  const { flowState, uploadFile, error } = useResume();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const isUploading = flowState === 'UPLOADING';

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div
        {...getRootProps()}
        className={`p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
            <p className="font-semibold">Uploading...</p>
            <p className="text-sm text-muted-foreground">Please wait while we process your resume.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="font-semibold">Drag & drop your resume here, or click to select a file</p>
            <p className="text-sm text-muted-foreground">PDF only, up to 10MB</p>
          </div>
        )}
      </div>
      {flowState === 'ERROR' && (
        <div className="mt-4 text-red-500 flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}