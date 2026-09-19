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
    Explicit resume text fallback matching Sujal's verified profile and active repositories.
    """
    return """
S V S SUJAL
8105115505 • svss.officia13@gmail.com • Bengaluru, Karnataka, India
LinkedIn: https://www.linkedin.com/in/svss13 • GitHub: https://github.com/SVSS13 • Portfolio: https://svs-sujal-portfolio.vercel.app

Summary:
AI Engineer, Full-Stack Developer, and Computer Vision Specialist passionate about scalable intelligent systems. Experienced in production machine learning inference, real-time object detection (YOLOv8, PyTorch, OpenCV), agentic LLM architectures, and reactive full-stack web applications (React, Django REST, Docker).

Experience:
1. Technology Intern — Exdion Solutions (Bengaluru, India)
   - Software Automation, AI Systems, and intelligent document processing workflows.
   - Built backend integrations and optimized high-throughput API endpoints.

Education:
- Dayananda Sagar University (DSU), Bengaluru — Bachelor of Technology in Computer Science & Engineering (2022 - 2026), CGPA: 7.85
- The Narayana Institutions — Class XII (Pre-University), 79% (2020 - 2022)
- The Aditya Birla Public School, Kovaya — Class X (CBSE), 72% (2010 - 2020)

Technical Skills:
- Programming Languages: Python, JavaScript, Java, C, R, SQL, Bash
- AI & Computer Vision: YOLOv8, PyTorch, OpenCV, Object Detection & Tracking, Image Processing, Scikit-Learn
- Web & Frameworks: React 19, Django REST Framework, Vite, Node.js, TailwindCSS / Custom Glassmorphism, Framer Motion
- Cloud & DevOps: Docker, Jenkins, AWS, Git/GitHub Actions, Linux/Unix administration
- Databases: PostgreSQL, SQLite, MySQL, MongoDB

Featured Projects:
1. Aerial Object Detection & Tracking (YOLOv8 + PyTorch)
   - Real-time aerial surveillance detecting UAVs, drones, and aircraft from high-altitude and drone footage with low inference latency.
2. AI Cyberpunk Tsushima Portfolio
   - 3D WebGL physics portfolio with Agentic multi-provider AI Spirit Guide, live Google/Tavily search grounding, neural TTS, and OTP security gateway.
3. Footfall Counter & Analytics
   - Edge-device computer vision footfall tracking and bidirectional movement counter for smart facility management.
4. Pothole Detection & Road Damage Classifier
   - Real-time road damage and surface anomaly detection using deep learning for automated municipal infrastructure audits.

Contact:
Phone: +91 8105115505
Email: svss.officia13@gmail.com
LinkedIn: https://www.linkedin.com/in/svss13
GitHub: https://github.com/SVSS13
Location: Bengaluru, India
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