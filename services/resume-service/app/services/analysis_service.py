from app.services.pdf_parser_service import parse_resume_from_storage
from app.services.scrape_service import scrape_job_posting
from app.services.gemini_service import generate_automated_analysis  
from app.models.resume import AnalysisReport
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

async def analyze_resume_against_job_url(file_id: str, job_url: str) -> AnalysisReport:
    """
    End-to-end analysis pipeline:
    1. Parse resume from storage
    2. Scrape job posting from URL
    3. Generate AI-powered analysis report
    """
    try:
        # --- Step 1: Parse Resume ---
        logger.info(f"Parsing resume for file_id: {file_id}")
        resume_content = await parse_resume_from_storage(file_id)
        if not resume_content.strip():
            raise HTTPException(
                status_code=400,
                detail="Failed to extract meaningful content from resume PDF."
            )

        # --- Step 2: Scrape Job Posting ---
        logger.info(f"Scraping job posting: {job_url}")
        job_content = await scrape_job_posting(job_url)
        if not job_content.strip():
            raise HTTPException(
                status_code=400,
                detail="Failed to extract content from job posting URL."
            )

        # --- Step 3: Generate AI Analysis ---
        logger.info("Generating AI analysis report...")
        report = await generate_automated_analysis(
            parsed_resume_content=resume_content,
            scraped_job_content=job_content
        )

        logger.info(f"Analysis complete. Match score: {report.match_score}%")
        return report

    except HTTPException:
        # Re-raise known HTTP errors
        raise
    except Exception as e:
        logger.error(f"Unexpected error in analysis pipeline: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during resume analysis. Please try again later."
        )