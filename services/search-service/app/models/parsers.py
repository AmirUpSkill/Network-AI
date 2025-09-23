import re
from typing import List, Dict, Any, Optional
from .search import PersonResult, WorkExperienceItem, EducationItem


class PersonResultParser:
    """
    Parser for converting raw Exa search results into PersonResult objects.
    Handles both Result objects from Exa API and dictionary formats.
    """
    
    @staticmethod
    def parse_results(raw_results: List[Any]) -> List[PersonResult]:
        """
        Parse a list of raw results into PersonResult objects.
        
        Args:
            raw_results: List of raw results (either Result objects or dictionaries)
            
        Returns:
            List of parsed PersonResult objects
        """
        return [PersonResultParser._parse_single_result(result) for result in raw_results]
    
    @staticmethod
    def _parse_single_result(result: Any) -> PersonResult:
        """Parse a single raw result into a PersonResult object."""
        # ---  Extract basic fields --- 
        basic_data = PersonResultParser._extract_basic_fields(result)
        text = basic_data['text']
        
        # ---  Parse complex fields from text ---
        location = PersonResultParser._extract_location(text)
        work_experience = PersonResultParser._extract_work_experience(text)
        education = PersonResultParser._extract_education(text)
        skills = PersonResultParser._extract_skills(text)
        summary = PersonResultParser._extract_summary(text)
        
        return PersonResult(
            id=basic_data['id'],
            url=basic_data['url'],
            title=basic_data['title'],
            author=basic_data['author'],
            location=location,
            summary=summary,
            image=basic_data['image'],
            work_experience=work_experience,
            education=education,
            skills=skills
        )
    
    @staticmethod
    def _extract_basic_fields(result: Any) -> Dict[str, str]:
        """Extract basic fields from result object or dictionary."""
        if hasattr(result, 'text'): 
            return {
                'text': getattr(result, 'text', ''),
                'id': getattr(result, 'id', ''),
                'url': getattr(result, 'url', ''),
                'title': getattr(result, 'title', ''),
                'author': getattr(result, 'author', ''),
                'image': getattr(result, 'image', '')
            }
        else: 
            return {
                'text': result.get('text', ''),
                'id': result.get('id', ''),
                'url': result.get('url', ''),
                'title': result.get('title', ''),
                'author': result.get('author', ''),
                'image': result.get('image', '')
            }
    
    @staticmethod
    def _extract_location(text: str) -> Optional[str]:
        """Extract location from text using regex patterns."""
        location_match = re.search(r"\[(se|us|other)\]", text)
        return location_match.group(0) if location_match else None
    
    @staticmethod
    def _extract_work_experience(text: str) -> List[WorkExperienceItem]:
        """Extract work experience entries from text."""
        work_ex = []
        sections = text.split('- ###')
        
        for section in sections[1:]: 
            if 'at' not in section:
                continue
                
            try:
                parts = section.split('at', 1)
                title = parts[0].strip()
                
                company_duration = parts[1].strip().split('\n', 1)
                company = company_duration[0].strip(' []')
                duration = company_duration[1] if len(company_duration) > 1 else None
                
                work_ex.append(WorkExperienceItem(
                    title=title,
                    company=company,
                    duration=duration,
                    location=None
                ))
            except (IndexError, AttributeError):
                continue
        
        return work_ex
    
    @staticmethod
    def _extract_education(text: str) -> List[EducationItem]:
        """Extract education entries from text."""
        education = []
        sections = text.split('- ###')
        edu_sections = [s for s in sections if 'Education' in s or 'degree' in s.lower()]
        
        for edu_section in edu_sections:
            lines = edu_section.split('\n')
            for line in lines:
                if '||' in line:
                    try:
                        parts = line.split('||', 1)
                        degree = parts[0].strip()
                        rest_parts = parts[1].strip().split(' at ', 1)
                        field = rest_parts[0].strip()
                        institution = rest_parts[1].strip(' []') if len(rest_parts) > 1 else None
                        
                        education.append(EducationItem(
                            degree=degree,
                            field_of_study=field,
                            institution=institution
                        ))
                    except (IndexError, AttributeError):
                        continue
        
        return education
    
    @staticmethod
    def _extract_skills(text: str) -> List[str]:
        """Extract skills array from text using regex."""
        skills_match = re.search(r"skills: \[(.*?)\]", text, re.IGNORECASE)
        if skills_match:
            skills_text = skills_match.group(1)
            return [skill.strip() for skill in skills_text.split(", ") if skill.strip()]
        return []
    
    @staticmethod
    def _extract_summary(text: str) -> Optional[str]:
        """Extract summary from 'About me' section."""
        if '## About me\n' not in text:
            return None
            
        try:
            summary_start = text.split('## About me\n')[1]
            summary = summary_start.split('##')[0].strip()
            return summary if summary else None
        except (IndexError, AttributeError):
            return None


class LinkedInTextCleaner:
    """
    Utility class for cleaning and normalizing LinkedIn text content.
    """
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text content."""
        if not text:
            return ""
    
        text = re.sub(r'\s+', ' ', text)
        
        text = re.sub(r'#{2,}', '', text) 
        
        return text.strip()
    
    @staticmethod
    def extract_company_name(text: str) -> str:
        """Extract clean company name from text."""
        return re.sub(r'[\[\]()]', '', text).strip()
    
    @staticmethod
    def parse_duration(duration_text: str) -> Optional[str]:
        """Parse and normalize duration strings."""
        if not duration_text:
            return None
            
        duration = duration_text.strip()

        prefixes_to_remove = ['•', '-', 'Duration:', 'Period:']
        for prefix in prefixes_to_remove:
            if duration.startswith(prefix):
                duration = duration[len(prefix):].strip()
        
        return duration if duration else None