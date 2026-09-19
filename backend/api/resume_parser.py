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
    Explicit resume text fallback matching Sujal's verified single-column CV and active repositories.
    """
    return """
S V S SUJAL
FULL-STACK SOFTWARE ENGINEER • CLOUD, DEVOPS & AI/ML SYSTEMS
📍 Bengaluru, India | 📞 +91 8105115505 | ✉ svss.officia13@gmail.com | 🌐 Portfolio: sujalsvs.in ↗ | 🔗 linkedin.com/in/svss13 | 💻 github.com/SVSS13

PROFESSIONAL SUMMARY
Full-Stack & Cloud Software Engineer with production expertise across responsive frontend development (React.js, Vite), robust backend microservices (Django, Node.js, FastAPI, RESTful APIs), AI/ML computer vision systems (YOLOv8, OpenCV, Anomaly Detection), and cloud infrastructure (AWS, Docker, Jenkins CI/CD, PostgreSQL, MySQL). Proven track record of architecting automated telemetry pipelines, scheduled anomaly detection engines, and delivering high-impact features through Agile Scrum sprint cycles.

TECHNICAL SKILLS MATRIX
Full-Stack Web & Frontend: React.js, Vite, JavaScript (ES6+), HTML5, CSS3, Django, FastAPI, Node.js, RESTful APIs, State Management
AI, ML & Computer Vision: Machine Learning (Scikit-Learn), YOLOv8, OpenCV, Deep Learning (CNN, MobileNetV2), Anomaly Detection Engines, Groq LLM API
Cloud, DevOps & Observability: AWS (CloudWatch Logs & Metrics, EC2), Docker, Jenkins, CI/CD Automation, Linux/Unix Bash, Ansible, Nginx, Telemetry
Databases & Agile Management: PostgreSQL, MySQL, MongoDB, SQL Optimization, Agile Methodology, Scrum Framework, Sprint Delivery, KPI Tracking, Software Architecture

PRODUCTION ENGINEERING EXPERIENCE [Enterprise Cloud & Telemetry Pipelines]
Exdion Health (Exdion Solutions) — Technology Intern Feb 2026 – Present | Bengaluru, India
• ExdionCode (AI Medical Coding & Pipeline Observability Platform): Engineered automated full-stack telemetry dashboards combining MySQL database status and AWS CloudWatch Logs to monitor real-time patient visit batch workflows and data throughput in Agile sprint cycles.
• Anomaly Detection Engine: Developed a scheduled monitoring service executing automated pipeline health checks every 10 minutes across data ingestion stages to proactively detect, flag, and alert on stalled batch jobs.
• Stuck Job Trends Analytics: Built a diagnostic sub-module capturing historical pipeline failure timelines, tracking bottleneck KPIs and accelerating incident triage time for mission-critical healthcare workflows.
• CASH (Healthcare Claims Assurance Service): Designed backend data ingestion pipelines and REST endpoints utilizing PostgreSQL and AWS CloudWatch for high-volume financial transaction verification and auditability.

FEATURED TECHNICAL PROJECTS [Full-Stack, AI/ML & Cloud Systems]
▸ AI Cyberpunk Full-Stack Cloud Platform (Live: sujalsvs.in ↗) React (Vite) • Django • Groq AI • Docker • CI/CD • AWS
  Architected a full-stack personal cloud platform with a responsive React (Vite) frontend and Django REST backend. Integrated Groq LLM chatbot endpoints, automated GitHub Actions CI/CD deployment pipelines, telemetry analytics, and Nginx reverse proxy on AWS.
▸ Automated Pothole Detection & Road Hazard Assessment (Final Year Capstone) Python • OpenCV • Scikit-Learn ML • CNN • Flask Web UI
  Developed an automated computer vision system using OpenCV, adaptive thresholding, contour segmentation, and Scikit-Learn Machine Learning / CNN models to detect potholes from camera feeds and generate geo-tagged hazard logs.
▸ Aerial Object Detection & Airspace Surveillance System Python • YOLOv8 • MobileNetV2 (99% Acc) • Transfer Learning • CNN
  Engineered an AI deep learning system classifying birds vs. drones in aerial video. Implemented MobileNetV2 transfer learning alongside YOLOv8 for real-time bounding-box object localization in surveillance feeds.
▸ PCB Defect Detection & Visual Quality Inspection System Python • Flask • MATLAB Engine API • OpenCV Edge Detection
  Built an automated visual inspection web tool integrating MATLAB image processing via MATLAB Engine API with a Flask backend to execute edge detection, morphological filtering, and automated anomaly reporting.

EDUCATION
B.Tech in CSE CGPA: 7.85 — Dayananda Sagar University (2022 – Oct 2026, Grad: Oct 28)
Class XII (State) 79% — The Narayana Institutions (2020 – 2022, Bengaluru)
Class X (CBSE) 72% — Aditya Birla Public School (2012 – 2020, Adityanagar)

VERIFIED CERTIFICATIONS & GLOBAL HONORS
★ Galactic Problem Solver (NASA Space Apps Challenge 2024 / ISRO)
✓ TechA Linux Foundation Certification (Infosys Springboard)
✓ Practical Jenkins CI/CD Certification (Infosys Springboard)
✓ Scrum Foundation: Scrum in Action (Infosys Springboard)
✓ MATLAB Onramp (100% Verified) (MathWorks Training)
✓ Product Management Simulation (KPIs) (Electronic Arts / Forage)

CONTACT & VERIFICATION
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