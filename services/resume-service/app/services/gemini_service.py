import logging
from typing import Optional
from google import genai
from google.genai import types
from app.models.resume import AnalysisReport
from app.core.config import settings

logger = logging.getLogger(__name__)

# ---  Initialize Gemini client once ---
_genai_client = genai.Client(api_key=settings.GEMINI_API_KEY)

# --- Comprehensive Analysis Prompt ---
AUTOMATED_ANALYSIS_PROMPT = """
You are a senior HR professional and career advisor with 15+ years of experience in resume review and talent acquisition. Your expertise includes ATS optimization, industry-specific requirements, and career progression analysis.

Your task: Conduct a comprehensive resume analysis by automatically extracting job information from scraped job posting content and comparing it against the candidate's resume.

**AUTOMATED WORKFLOW:**
1. **Auto-Extract Job Information**: From the scraped job content, identify:
   - Job title/position name
   - Required skills and technologies
   - Experience requirements (years, type)
   - Education requirements
   - Preferred qualifications
   - Company information

2. **Match Score Calculation**: Base the score on:
   - Technical skills alignment (30%)
   - Experience relevance (25%) 
   - Education/Certifications match (15%)
   - Industry keywords presence (20%)
   - Cultural fit indicators (10%)

3. **Keyword Analysis**: Focus on:
   - Technical skills, tools, frameworks
   - Industry-specific terminology
   - Soft skills mentioned in job posting
   - Certifications and qualifications

4. **Experience Matching**: Evaluate:
   - Years of experience vs. requirements
   - Specific job functions and responsibilities
   - Leadership/management experience if required
   - Industry experience relevance

5. **Improvement Suggestions**: Provide specific, actionable advice:
   - Missing keywords to add
   - Skills to highlight more prominently
   - Experience descriptions to enhance
   - Format/structure improvements
   - ATS optimization tips

**IMPORTANT**: Return ONLY valid JSON matching this exact schema. No additional text, explanations, or markdown formatting:

{
  "match_score": 85.5,
  "summary": "Brief 2-3 sentence professional assessment including the extracted job title",
  "keyword_analysis": {
    "matched_keywords": ["Python", "Machine Learning", "AWS"],
    "missing_keywords": ["Docker", "Kubernetes", "CI/CD"]
  },
  "experience_match": [
    {
      "job_requirement": "3+ years of Python development experience",
      "resume_evidence": "Specific evidence from resume or 'Not mentioned'",
      "is_match": true
    }
  ],
  "suggestions": [
    "Add Docker and containerization experience to your skills section",
    "Quantify your machine learning project outcomes with specific metrics"
  ]
}

**Constraints:**
- Automatically extract all job details from the scraped content
- Be honest and constructive in your assessment
- Base analysis only on provided content
- Provide actionable, specific suggestions
- Use professional language
- Return ONLY valid JSON, no additional text or formatting
"""

async def generate_automated_analysis(
    parsed_resume_content: str,
    scraped_job_content: str
) -> AnalysisReport:
    """
    Generate a structured resume analysis report using Gemini API.
    
    Args:
        parsed_resume_content: Extracted text from the PDF resume
        scraped_job_content: Complete scraped content from job posting URL
        
    Returns:
        AnalysisReport: Structured analysis with scores, keywords, and suggestions
        
    Raises:
        RuntimeError: If Gemini API fails or returns invalid response
    """
    
    # Build the complete prompt
    full_prompt = f"""{AUTOMATED_ANALYSIS_PROMPT}

**SCRAPED JOB POSTING CONTENT:**
{scraped_job_content}

**CANDIDATE RESUME CONTENT:**
{parsed_resume_content}

Please analyze the resume against the job posting and return the analysis as valid JSON only.
"""

    try:
        logger.info("Sending request to Gemini API...")
        
        # --- Use Gemini SDK ---
        response = _genai_client.models.generate_content(
            model="gemini-2.5-pro",
            contents=full_prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=4000,
                response_mime_type="application/json",
                # thinking_config=types.ThinkingConfig(thinking_budget=0)
            )
        )
        
        # --- Check if response has content --- 
        if not response or not hasattr(response, 'text') or response.text is None:
            logger.error("Gemini API returned empty or invalid response")
            raise RuntimeError("Gemini API returned empty response")
            
        raw_text = response.text.strip()
        logger.debug(f"Raw Gemini response length: {len(raw_text)}")
        
        # --- Handle potential markdown code block wrapping ---
        if raw_text.startswith("```"):
            logger.debug("Detected markdown code block, extracting JSON...")
            if "```json" in raw_text:
                raw_text = raw_text.split("```json", 1)[1].split("```", 1)[0].strip()
            else:
                lines = raw_text.split("\n")
                start_idx = 1 if lines[0].startswith("```") else 0
                end_idx = len(lines)
                for i, line in enumerate(lines[start_idx:], start_idx):
                    if line.strip() == "```":
                        end_idx = i
                        break
                raw_text = "\n".join(lines[start_idx:end_idx]).strip()
        
        if not raw_text:
            raise RuntimeError("No valid JSON content found in response")
            
        logger.debug(f"Cleaned JSON response: {raw_text[:200]}...")
        try:
            report = AnalysisReport.model_validate_json(raw_text)
            logger.info(f"Successfully generated analysis report with match score: {report.match_score}%")
            return report
            
        except Exception as parse_error:
            logger.error(f"Failed to parse JSON response: {parse_error}")
            logger.error(f"Raw response: {raw_text}")
            raise RuntimeError(f"Invalid JSON format in Gemini response: {str(parse_error)}")
            
    except Exception as e:
        error_msg = f"Gemini analysis failed: {str(e)}"
        logger.error(error_msg, exc_info=True)
        if hasattr(e, 'response'):
            logger.error(f"HTTP Response: {e.response}")
            
        raise RuntimeError(error_msg) from e