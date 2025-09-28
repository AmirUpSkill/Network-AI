'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { apiCall } from '@/lib/api-client'

interface UploadResponse {
  file_id: string
  message: string
}

interface AnalysisReport {
  match_score: number
  summary: string
  keyword_analysis: {
    matched_keywords: string[]
    missing_keywords: string[]
  }
  experience_match: Array<{
    job_requirement: string
    resume_evidence: string
    is_match: boolean
  }>
  suggestions: string[]
}

export function ResumeTest() {
  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [fileId, setFileId] = useState<string>('')
  const [uploadMessage, setUploadMessage] = useState('')

  // Analysis states
  const [jobUrl, setJobUrl] = useState('https://job-boards.greenhouse.io/perplexityai/jobs/4912827007')
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null)
  const [error, setError] = useState<string>('')

  // Step 1: Handle file upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF files are allowed')
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploadLoading(true)
    setError('')
    setUploadMessage('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data: UploadResponse = await response.json()
      setFileId(data.file_id)
      setUploadMessage(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadLoading(false)
    }
  }

  // Step 2: Handle analysis
  const handleAnalysis = async () => {
    if (!fileId || !jobUrl) return

    setAnalysisLoading(true)
    setError('')
    setAnalysisReport(null)

    try {
      const response = await apiCall<AnalysisReport>('/resume/analyze-auto', {
        method: 'POST',
        body: JSON.stringify({
          file_id: fileId,
          job_url: jobUrl
        })
      })

      setAnalysisReport(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setAnalysisLoading(false)
    }
  }

  // Helper to get token
  const getToken = async () => {
    const { createClient } = await import('@/lib/supabase')
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || ''
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Upload Resume */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Upload Resume</CardTitle>
          <CardDescription>Upload your PDF resume for analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume-file">Select Resume (PDF)</Label>
            <Input
              id="resume-file"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || uploadLoading}
            className="w-full"
          >
            {uploadLoading ? 'Uploading...' : 'Upload Resume'}
          </Button>

          {uploadMessage && (
            <Alert>
              <AlertDescription>
                ✅ {uploadMessage}
                <br />
                <span className="font-mono text-xs">File ID: {fileId}</span>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Analyze Resume */}
      <Card className={!fileId ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle>Step 2: Analyze Against Job</CardTitle>
          <CardDescription>
            {fileId ? 'Enter a job URL to analyze your resume' : 'Upload a resume first'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-url">Job URL</Label>
            <Input
              id="job-url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://example.com/job-posting"
              disabled={!fileId}
            />
          </div>

          <Button 
            onClick={handleAnalysis}
            disabled={!fileId || !jobUrl || analysisLoading}
            className="w-full"
          >
            {analysisLoading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Analysis Report */}
      {analysisReport && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Report</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">
                {analysisReport.match_score}%
              </div>
              <div className="text-sm text-muted-foreground">Match Score</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-sm text-muted-foreground">
                {analysisReport.summary}
              </p>
            </div>

            {/* Keywords */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2 text-green-600">
                  Matched Keywords ({analysisReport.keyword_analysis.matched_keywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisReport.keyword_analysis.matched_keywords.map((keyword, i) => (
                    <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-red-600">
                  Missing Keywords ({analysisReport.keyword_analysis.missing_keywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysisReport.keyword_analysis.missing_keywords.map((keyword, i) => (
                    <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Matches */}
            <div>
              <h3 className="font-semibold mb-2">Experience Analysis</h3>
              <div className="space-y-3">
                {analysisReport.experience_match.map((match, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className={`text-lg ${match.is_match ? '✅' : '❌'}`}>
                        {match.is_match ? '✅' : '❌'}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{match.job_requirement}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {match.resume_evidence}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="font-semibold mb-2">Improvement Suggestions</h3>
              <ul className="space-y-2">
                {analysisReport.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
