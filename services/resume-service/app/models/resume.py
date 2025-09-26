from uuid import UUID
from typing import List, Optional
from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    file_id: UUID = Field(..., description="A unique identifier...")
    message: str = Field(..., description="A confirmation message.")


class AnalysisRequest(BaseModel):
    file_id: UUID = Field(..., description="The ID of the uploaded resume from the /resume/upload endpoint.")
    job_title: str = Field(..., description="The title of the job you are applying for.")
    job_description: str = Field(..., description="The full text of the job description.")
    job_context_url: Optional[str] = Field(
        None,
        description="A URL to the job posting for additional context scraping.",
        example="https://www.linkedin.com/jobs/view/1234567890/"
    )


class KeywordAnalysis(BaseModel):
    matched_keywords: List[str] = Field(..., description="Keywords from the job description found in the resume.")
    missing_keywords: List[str] = Field(..., description="Important keywords missing from the resume.")


class ExperienceMatchItem(BaseModel):
    job_requirement: str = Field(..., description="A specific requirement from the job description.")
    resume_evidence: str = Field(..., description="Evidence from the resume that supports (or doesn't support) this requirement.")
    is_match: bool = Field(..., description="Whether the resume adequately addresses this requirement.")


class AnalysisReport(BaseModel):
    match_score: float = Field(..., ge=0.0, le=100.0, description="An overall percentage match score (0-100).")
    summary: str = Field(..., description="A brief, high-level summary of the analysis.")
    keyword_analysis: KeywordAnalysis = Field(..., description="Analysis of keyword coverage.")
    experience_match: List[ExperienceMatchItem] = Field(..., description="Details on how experience aligns with job requirements.")
    suggestions: List[str] = Field(..., description="Actionable suggestions for improving the resume.")