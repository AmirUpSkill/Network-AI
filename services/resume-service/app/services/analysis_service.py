import os
from google import genai
from app.models.resume import AnalysisReport
from app.core.config import settings

# Initialize Gemini client using the latest google-genai SDK
client = genai.Client(api_key=settings.GEMINI_API_KEY)

ANALYSIS_SYSTEM_PROMPT = """
You are an expert resume reviewer and career advisor. Your task is to analyze a candidate's resume against a specific job description and produce a structured, actionable report in JSON format.

Follow these rules strictly:
1. Output ONLY valid JSON. No markdown, no explanations.
2. The JSON must conform exactly to this schema:
{
  "match_score": float (0.0 to 100.0),
  "summary": "A 2-3 sentence high-level assessment",
  "keyword_analysis": {
    "matched_keywords": ["list", "of", "keywords"],
    "missing_keywords": ["important", "missing", "keywords"]
  },
  "experience_match": [
    {
      "job_requirement": "Exact phrase from job description",
      "resume_evidence": "Relevant excerpt or 'Not mentioned'",
      "is_match": true/false
    }
  ],
  "suggestions": [
    "Specific, actionable advice to improve the resume"
  ]
}
3. Be factual, concise, and helpful.
4. Do not invent information not present in the resume or job description.
"""

def generate_analysis_report(
    resume_text: str,
    job_title: str,
    job_description: str
) -> AnalysisReport:
    # Build a single prompt that includes the system guidance and user inputs.
    user_prompt = f"""
Job Title: {job_title}
Job Description:
{job_description}

Resume Text:
{resume_text}
    """
    full_prompt = f"{ANALYSIS_SYSTEM_PROMPT}\n\n{user_prompt}"

    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=full_prompt,
        config={
            "temperature": 0.3,
            "max_output_tokens": 2000,
            "response_mime_type": "application/json",
        },
    )

    raw_json = response.text.strip()
    try:
        return AnalysisReport.model_validate_json(raw_json)
    except ValueError as e:
        raise RuntimeError(f"Failed to parse Gemini response into AnalysisReport: {e}")