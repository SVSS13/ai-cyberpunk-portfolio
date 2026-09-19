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
    Explicit resume text fallback matching Sujal's verified CV and active repositories.
    """
    return """
S V S SUJAL — SOFTWARE & CLOUD OBSERVABILITY ENGINEER 🌐 sujalsvs.in ↗
8105115505 • svss.officia13@gmail.com • Bengaluru, Karnataka, India
LinkedIn: https://www.linkedin.com/in/svss13 • GitHub: https://github.com/SVSS13 • Portfolio: https://sujalsvs.in (Live: sujalsvs.in)

Summary:
Software & Cloud Engineer with production experience in backend pipeline monitoring, automated anomaly detection, and cloud observability. Skilled in Python, SQL (PostgreSQL, MySQL), AWS CloudWatch, and CI/CD automation with Docker and Jenkins. Proven track record of engineering automated job-tracking systems, scheduled anomaly detectors, and diagnostic dashboards that eliminate pipeline downtime across enterprise healthcare workflows.

Experience:
1. Technology Intern — Exdion Health (Exdion Solutions), Bengaluru (Feb 2026 – Present)
   - ExdionCode (AI Medical Coding & Pipeline Observability Platform): Engineered automated data monitoring pipelines combining MySQL database records and AWS CloudWatch Logs to track real-time patient visit batch workflows and data ingestion throughput.
   - Anomaly Detection Engine: Developed a scheduled monitoring service executing automated pipeline health checks every 10 minutes to detect, flag, and alert on stalled or hung batch processing jobs.
   - Stuck Job Trends Analytics: Built a diagnostic sub-module to capture, store, and visualize historical pipeline failure timelines, identifying recurring processing bottlenecks and accelerating incident resolution.
   - CASH (Healthcare Claims Assurance Service): Designed backend data ingestion pipelines and telemetry utilizing PostgreSQL and AWS CloudWatch for high-volume auditability and financial transaction verification.

Education:
- Dayananda Sagar University (DSU), Bengaluru — Bachelor of Technology in Computer Science & Engineering (2022 – Oct 2026, Grad: Oct 28), CGPA: 7.85
- The Narayana Institutions — Class XII (Senior Secondary), 79% (2020 – 2022, State Board)
- Aditya Birla Public School — Class X (Secondary), 72% (2012 – 2020, CBSE)

Certifications:
- Linux Programming & Shell Scripting (Infosys Springboard)
- Practical Jenkins & CI/CD Pipelines (Infosys Springboard)
- Image Processing with MATLAB & Onramp (MathWorks)
- Product Management Simulation (Electronic Arts / Forage)
- Scrum Foundation: Scrum in Action (Infosys Springboard)
- Agile & Predictive Project Kick-Off (PMI Badges)

Technical Skills:
- Languages & Scripting: Python, SQL, Bash / Shell, Java, C, R, JavaScript
- Cloud & Observability: AWS CloudWatch Logs, CloudWatch Metrics, AWS EC2, Linux / Unix
- Databases & Ingestion: PostgreSQL, MySQL, MongoDB, Query Optimization
- DevOps & Architecture: Docker, Jenkins, GitHub Actions, Ansible, Power BI
- Web Frameworks & APIs: Django, React, Flask, FastAPI, Node.js, RESTful APIs
- AI & Core Engineering: Anomaly Detection, YOLOv8, Computer Vision, Groq AI / LLMs, Agile

Key Technical Projects (PORTFOLIO: SUJALSVS.IN | GITHUB: @SVSS13):
1. Automated Pothole Detection & Road Hazard Assessment (Final Year Capstone) (Python, OpenCV, Computer Vision, CNN / ML, Flask)
   - Developed an automated computer vision system to detect road potholes from video/camera feeds in real time with geo-tagged hazard logs.
2. AI Cyberpunk Interactive Portfolio Platform (Live: sujalsvs.in ↗) (React, Django, Groq AI, DevOps CI/CD, REST APIs)
   - Engineered an AI-powered personal portfolio integrating Groq LLM chatbot, automated CI/CD deployment pipelines, telemetry analytics dashboard, and interactive UI with Android webview deployment support.
3. Aerial Object Detection & Airspace Surveillance System (Python, YOLOv8, MobileNetV2, Transfer Learning, CNN)
   - Real-time aerial surveillance detecting birds vs. drones with MobileNetV2 (99% accuracy) and YOLOv8 localization.
4. PCB Defect Detection & Visual Quality Inspection System (Python, Flask, MATLAB Engine API, OpenCV)
   - Automated visual inspection web tool integrating MATLAB image processing algorithms via MATLAB Engine API with Flask backend.

Contact:
Phone: +91 8105115505
Email: svss.officia13@gmail.com
LinkedIn: https://www.linkedin.com/in/svss13
GitHub: https://github.com/SVSS13
Portfolio: https://sujalsvs.in
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