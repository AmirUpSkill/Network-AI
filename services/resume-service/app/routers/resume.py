from fastapi import APIRouter, HTTPException, UploadFile, File
from uuid import UUID
from app.models.resume import (
    UploadResponse,
    AutoAnalysisRequest,
    AnalysisReport
)
from app.services.storage_service import upload_resume
from app.services.analysis_service import analyze_resume_against_job_url 

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload", response_model=UploadResponse)
async def upload_resume_endpoint(file: UploadFile = File(...)):
    if file.filename is None:
        raise HTTPException(status_code=400, detail="File has no name.")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    try:
        file_id = await upload_resume(file)
        return UploadResponse(
            file_id=UUID(file_id),
            message="Resume uploaded successfully. Ready for analysis."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.post("/analyze-auto", response_model=AnalysisReport)
async def analyze_resume_auto(request: AutoAnalysisRequest):
    try:
        report = await analyze_resume_against_job_url(
            file_id=str(request.file_id),  
            job_url=request.job_url
        )
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auto-analysis failed: {str(e)}")