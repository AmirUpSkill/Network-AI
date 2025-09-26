import os
from pathlib import Path
from tempfile import NamedTemporaryFile
from agentic_doc.parse import parse
from app.core.config import settings

def parse_resume_pdf(pdf_bytes: bytes) -> str:
    """
    Parse a resume PDF (as bytes) using Landing AI's Agentic Document Extraction.
    Returns the extracted text content as a clean string (Markdown format).
    """
    # --- Write bytes to a temporary file  ----
    with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(pdf_bytes)
        tmp_file_path = tmp_file.name

    try:
        # ---  Parse the PDF ---
        results = parse(
            tmp_file_path,
            api_key=settings.LANDING_AI_API_KEY
        )
        # ---  Return the markdown content  -----
        if results and len(results) > 0:
            return results[0].markdown.strip()
        else:
            return ""
    finally:
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)