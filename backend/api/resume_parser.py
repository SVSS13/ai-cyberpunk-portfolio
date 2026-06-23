"""
Resume PDF Parser - Extracts and indexes resume text
"""

import os
import re
from io import BytesIO


def parse_resume_pdf(pdf_path: str = None) -> str:
    """
    Parse resume PDF and return extracted text.
    Uses PyPDF2 or falls back to manual parsing.
    """
    
    # Try PyPDF2 first
    try:
        import PyPDF2
        return _parse_with_pypdf2(pdf_path)
    except ImportError:
        print("PyPDF2 not installed, using fallback")
    
    # Fallback: Try pdfplumber
    try:
        import pdfplumber
        return _parse_with_pdfplumber(pdf_path)
    except ImportError:
        pass
    
    # Final fallback: return explicit resume text (hardcoded from your PDF)
    return _get_explicit_resume_text()


def _parse_with_pypdf2(pdf_path: str) -> str:
    """Parse PDF using PyPDF2."""
    if not pdf_path or not os.path.exists(pdf_path):
        return _get_explicit_resume_text()
    
    text = ""
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    
    return text


def _parse_with_pdfplumber(pdf_path: str) -> str:
    """Parse PDF using pdfplumber (better extraction)."""
    import pdfplumber
    
    if not pdf_path or not os.path.exists(pdf_path):
        return _get_explicit_resume_text()
    
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    
    return text


def _get_explicit_resume_text() -> str:
    """
    Explicit resume text from your PDF.
    Update this when your resume changes.
    """
    return """
S V S SUJAL
8105115505 • svss.officia13@gmail.com • Bengaluru India

Summary:
Aspiring Build Engineer and Cloud Practitioner, passionate about creating simple and efficient 
processes. Skilled in team leadership, enhancing customer satisfaction, and driving results through 
effective communication and time management. Successfully managed projects aligned with Agile values.
Strong interest in Project Management. Enthusiastic about continuous learning.

Skills:
Programming Languages: Python, Java, C, R
Web and API Development: Django, Node.js, HTML, CSS, JavaScript
Database Management: MySQL, MongoDB
DevOps: Docker, Jenkins, GitHub, Ansible, Bash scripting, Linux
Cloud: AWS
Data: Power BI
Machine Learning: OpenCV, scikit-learn, image processing, MATLAB
Agile: Scrum, XP, Lean, Kanban
Content Creation: Content Writing

Education:
Dayananda Sagar University - Bachelor's in Computer Science & Engineering (2022-2026), CGPA 7.65
The Narayana Institutions - Class XII, 79% (2020-2022)
The Aditya Birla Public School, Kovaya - Class X, 72% (2010-2020)

Projects:
1. Cat vs Dog Image Classifier - Python, OpenCV, scikit-learn, SVM, KNN, Decision Tree, Tkinter, Joblib
2. PCB Defect Detection System - Python, Flask, MATLAB image processing, MATLAB Engine API
3. Informex Shiny Data Analysis App - R, Shiny, ggplot2, tidyverse, corrplot, DT
4. E KART Online Shopping - HTML, CSS, JavaScript, responsive design, DOM manipulation

Certifications:
Linux Shell Programming, Bash Scripting, Linux Shell Scripting Solutions, Tech A Linux Programming Foundation,
Image Processing with MATLAB, Image Processing Onramp, Practical Jenkins, Scrum Foundation,
Product Management Job Simulation, Project Management Institute Kick-Off

Experience:
Electronic Arts Product Management Job Simulation (Forage, September 2025)
Developed understanding of KPIs for strategy RPG mobile game.

Contact:
Phone: 8105115505
Email: svss.officia13@gmail.com
LinkedIn: www.linkedin.com/in/svss13
GitHub: https://github.com/SVSS13
Instagram: https://www.instagram.com/mr_svss_/
Portfolio: https://svs-sujal-portfolio.vercel.app

Languages: Telugu, English, Kannada, Hindi (fluent), Japanese (intermediate)
    """


def extract_resume_sections(text: str) -> dict:
    """
    Extract structured sections from resume text.
    Returns dict with sections for targeted search.
    """
    sections = {
        "full_text": text,
        "skills": [],
        "projects": [],
        "education": [],
        "certifications": [],
        "contact": {},
        "experience": []
    }
    
    # Extract skills
    skills_match = re.search(r'Skills:(.*?)(?:Education|Projects|Certifications|$)', text, re.DOTALL | re.IGNORECASE)
    if skills_match:
        skills_text = skills_match.group(1)
        sections["skills"] = [s.strip() for s in re.split(r'[,\n]', skills_text) if s.strip()]
    
    # Extract projects
    projects_match = re.search(r'Projects:(.*?)(?:Certifications|Experience|Education|$)', text, re.DOTALL | re.IGNORECASE)
    if projects_match:
        projects_text = projects_match.group(1)
        sections["projects"] = [p.strip() for p in re.split(r'\d+\.', projects_text) if p.strip()]
    
    # Extract contact
    phone_match = re.search(r'Phone:\s*(\d+)', text)
    email_match = re.search(r'Email:\s*(\S+@\S+)', text)
    if phone_match:
        sections["contact"]["phone"] = phone_match.group(1)
    if email_match:
        sections["contact"]["email"] = email_match.group(1)
    
    return sections