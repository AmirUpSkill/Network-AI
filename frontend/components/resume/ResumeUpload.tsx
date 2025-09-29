// frontend/components/resume/ResumeUpload.tsx
'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useResumeStore } from '@/store/resumeStore';
import { cn } from '@/lib/utils';

export function ResumeUpload() {
  const {
    uploadFile,
    isUploading,
    uploadProgress,
    fileId,
    fileName,
    error,
    clearError
  } = useResumeStore();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    if (file?.type === 'application/pdf') {
      setSelectedFile(file);
      clearError();
    }
  }, [clearError]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === 'application/pdf') {
      setSelectedFile(file);
      clearError();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadFile(selectedFile);
    if (!error) {
      setSelectedFile(null);
    }
  };

  // If already uploaded
  if (fileId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-700">
          <div className="p-6 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
            </motion.div>
            <div>
              <p className="text-lg font-semibold text-slate-100">Resume Uploaded Successfully!</p>
              <p className="text-sm text-slate-400 mt-1">{fileName}</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className={cn(
        "bg-gray-900/90 backdrop-blur-xl border-gray-700 transition-all duration-300",
        dragActive && "border-slate-400 shadow-lg shadow-slate-400/10"
      )}>
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-slate-100">Upload Your Resume</h3>
            <p className="text-sm text-slate-400">Drag & drop or click to select PDF</p>
          </div>

          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300",
              dragActive
                ? "border-slate-400 bg-slate-500/5"
                : "border-gray-600 hover:border-slate-500 bg-gray-800/20"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ y: dragActive ? -5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="h-12 w-12 mx-auto text-slate-500" />
              </motion.div>

              <div>
                <p className="text-sm font-medium text-slate-300">
                  Drop your PDF here
                </p>
                <p className="text-xs text-slate-500 mt-1">or</p>
              </div>

              <Button
                variant="outline"
                className="border-gray-600 hover:bg-gray-800 text-slate-300"
                asChild
              >
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  Browse Files
                </label>
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {selectedFile && (
              <motion.div
                key="selected-file"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-400" />
                      <span className="text-sm text-slate-300 truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      className="h-8 w-8 p-0 hover:bg-gray-700 text-slate-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {isUploading && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Uploading...</span>
                  <span className="text-slate-300">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1 bg-gray-800" />
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-900/20 border border-red-800/30 rounded-lg"
              >
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full bg-gradient-to-r from-gray-700 to-slate-600 hover:from-gray-600 hover:to-slate-500 text-slate-100"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              'Upload Resume'
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}