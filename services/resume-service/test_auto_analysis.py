#!/usr/bin/env python3
"""
Test script for the automated analysis workflow.
"""
import asyncio
from app.services.analysis_service import generate_automated_analysis

async def test_automated_analysis():
    """Test the automated analysis with sample data."""
    
    # Sample parsed resume content
    sample_resume = """
    Amir Abdallah
    
    Mobile: +216-94-372-302 — Email: amirabdallahpfe@gmail.com — LinkedIn — GitHub — Medium
    
    SOFTWARE ENGINEER & AI SPECIALIST
    
    PROFESSIONAL EXPERIENCE
    Senior Software Engineer | Tech Corp (2020-Present)
    - Led development of ML-powered applications using Python and TensorFlow
    - Built scalable APIs with FastAPI serving 1M+ requests daily
    - Implemented MLOps pipelines with Docker and Kubernetes on AWS
    - Mentored junior developers and conducted code reviews
    
    AI Engineer | StartupAI (2019-2020) 
    - Developed computer vision models using PyTorch
    - Created real-time ML inference systems
    - Optimized model performance reducing latency by 40%
    
    TECHNICAL SKILLS
    Languages: Python, JavaScript, Java, SQL
    ML/AI: TensorFlow, PyTorch, scikit-learn, OpenCV
    Web: FastAPI, Django, React, Node.js
    Cloud: AWS (EC2, S3, Lambda), GCP, Docker, Kubernetes
    Databases: PostgreSQL, MongoDB, Redis
    
    EDUCATION
    Master of Science in Artificial Intelligence | University of Technology (2019)
    Bachelor of Science in Computer Science | Tech University (2017)
    
    CERTIFICATIONS
    - AWS Certified Solutions Architect
    - TensorFlow Developer Certificate
    """
    
    # Sample scraped job content (as would come from a real job posting URL)
    sample_scraped_job = """
    Senior Machine Learning Engineer
    
    Company: AI Innovations Inc.
    Location: San Francisco, CA (Remote OK)
    Salary: $160,000 - $220,000
    
    About the Role:
    We're seeking a Senior Machine Learning Engineer to join our growing AI team. You'll be responsible for designing, developing, and deploying machine learning models at scale.
    
    Requirements:
    • 5+ years of experience in machine learning and software development
    • Strong proficiency in Python and ML frameworks (TensorFlow, PyTorch)
    • Experience with cloud platforms (AWS, GCP, or Azure)
    • Knowledge of MLOps practices and tools
    • Experience with containerization (Docker) and orchestration (Kubernetes)
    • Strong background in deep learning and neural networks
    • Experience with real-time ML systems and model optimization
    • Bachelor's or Master's degree in Computer Science, AI, or related field
    
    Preferred Qualifications:
    • Experience with computer vision or NLP projects
    • Knowledge of distributed computing frameworks
    • Experience with A/B testing and experimentation
    • Strong communication and leadership skills
    • Experience mentoring junior engineers
    
    Responsibilities:
    • Design and implement ML models for production use
    • Build and maintain ML infrastructure and pipelines
    • Collaborate with cross-functional teams
    • Optimize model performance and scalability
    • Stay current with latest ML research and technologies
    
    Benefits:
    • Competitive salary and equity package
    • Health, dental, and vision insurance
    • Unlimited PTO
    • Remote work flexibility
    • Professional development budget
    """
    
    try:
        print("🤖 Testing automated analysis workflow...")
        print("-" * 60)
        
        analysis = await generate_automated_analysis(
            parsed_resume_content=sample_resume,
            scraped_job_content=sample_scraped_job
        )
        
        print("✅ Automated Analysis Successful!")
        print("=" * 60)
        
        print(f"🎯 Match Score: {analysis.match_score}%")
        print()
        
        print("📝 Summary:")
        print(f"   {analysis.summary}")
        print()
        
        print(f"✅ Matched Keywords ({len(analysis.keyword_analysis.matched_keywords)}):")
        for keyword in analysis.keyword_analysis.matched_keywords[:10]:  # Show first 10
            print(f"   • {keyword}")
        if len(analysis.keyword_analysis.matched_keywords) > 10:
            print(f"   ... and {len(analysis.keyword_analysis.matched_keywords) - 10} more")
        print()
        
        print(f"❌ Missing Keywords ({len(analysis.keyword_analysis.missing_keywords)}):")
        for keyword in analysis.keyword_analysis.missing_keywords:
            print(f"   • {keyword}")
        print()
        
        print(f"📊 Experience Matches ({len(analysis.experience_match)}):")
        for i, match in enumerate(analysis.experience_match[:5], 1):  # Show first 5
            status = "✅" if match.is_match else "❌"
            print(f"   {i}. {status} {match.job_requirement}")
            print(f"      Evidence: {match.resume_evidence[:100]}...")
        if len(analysis.experience_match) > 5:
            print(f"   ... and {len(analysis.experience_match) - 5} more")
        print()
        
        print(f"💡 Improvement Suggestions ({len(analysis.suggestions)}):")
        for i, suggestion in enumerate(analysis.suggestions, 1):
            print(f"   {i}. {suggestion}")
        
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"❌ Automated analysis failed: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_automated_analysis())
    print(f"\\nTest Result: {'🎉 PASSED' if success else '💥 FAILED'}")