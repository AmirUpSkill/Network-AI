from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from uuid import UUID
from app.models.resume import (
    UploadResponse,
    AutoAnalysisRequest,
    AnalysisReport
)
from app.services.storage_service import upload_resume
from app.services.analysis_service import analyze_resume_against_job_url 
from app.core.auth import get_current_user  

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/upload", response_model=UploadResponse)
async def upload_resume_endpoint(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user) 
):
    if file.filename is None:
        raise HTTPException(status_code=400, detail="File has no name.")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    try:
        file_id = await upload_resume(file)
        # TODO: Optionally use user_id to scope the upload (e.g., in Supabase Storage RLS)
        return UploadResponse(
            file_id=UUID(file_id),
            message="Resume uploaded successfully. Ready for analysis."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/analyze-auto", response_model=AnalysisReport)
async def analyze_resume_auto(
    request: AutoAnalysisRequest,
    user_id: str = Depends(get_current_user)  
):
    try:
        report = await analyze_resume_against_job_url(
            file_id=str(request.file_id),  
            job_url=request.job_url
        )
        # TODO: Optionally use user_id to verify ownership of file_id
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auto-analysis failed: {str(e)}")