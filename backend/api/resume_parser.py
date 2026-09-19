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
SOFTWARE & CLOUD OBSERVABILITY ENGINEER
📍 Bengaluru, India | 📞 +91 8105115505 | ✉️ svss.officia13@gmail.com | 🌐 Portfolio: sujalsvs.in ↗ |
🔗 linkedin.com/in/svss13 | 💻 github.com/SVSS13

PROFESSIONAL SUMMARY
Software & Cloud Observability Engineer with production experience in backend pipeline health monitoring, scheduled anomaly detection, and cloud telemetry. Proficient in Python, SQL (PostgreSQL, MySQL), AWS CloudWatch, and CI/CD pipelines with Docker and Jenkins. Proven track record of engineering automated job-tracking diagnostic systems that eliminate pipeline downtime across enterprise healthcare workflows.

TECHNICAL SKILLS
Cloud & Observability: AWS (CloudWatch Logs, Metrics, Alarms, EC2), Linux/Unix System Administration, Telemetry Aggregation
Languages & Scripting: Python, SQL (PostgreSQL, MySQL), Bash / Shell Scripting, Java, C, R, JavaScript
DevOps & Infrastructure: Docker, Jenkins, Git, GitHub Actions, Ansible, Power BI, Nginx, CI/CD Automation
Frameworks & Databases: Django, Flask, FastAPI, React, Node.js, PostgreSQL, MySQL, MongoDB, RESTful APIs
AI, Vision & Core Methods: Anomaly Detection Engines, YOLOv8, OpenCV, Groq LLM API, MobileNetV2, Agile/Scrum

PRODUCTION ENGINEERING EXPERIENCE [Cloud & Observability Pipelines]
Exdion Health (Exdion Solutions) — Technology Intern Feb 2026 – Present | Bengaluru, India
• ExdionCode (AI Medical Coding & Pipeline Observability Platform): Engineered automated data monitoring pipelines integrating MySQL database status and AWS CloudWatch Logs to track real-time patient visit batch workflows and data throughput.
• Anomaly Detection Engine: Developed a scheduled monitoring service executing automated pipeline health checks every 10 minutes across processing stages to proactively detect, flag, and alert on stalled or hung batch jobs.
• Stuck Job Trends Analytics: Built a diagnostic sub-module capturing and storing historical pipeline failure timelines, enabling trend visualization to preempt recurrent bottleneck patterns and accelerate incident response.
• CASH (Healthcare Claims Assurance Service): Designed high-reliability backend data ingestion pipelines and telemetry utilizing PostgreSQL and AWS CloudWatch for high-volume financial transaction verification and auditability.

FEATURED TECHNICAL PROJECTS [Grouped: Cloud, Observability & Computer Vision]
▸ AI Cyberpunk Cloud & DevOps Platform (Live: sujalsvs.in ↗) React • Django • Groq AI • Docker • CI/CD • AWS
  Architected a personal cloud portfolio integrating Groq LLM AI chat endpoints, automated GitHub Actions CI/CD deployment pipelines, telemetry analytics dashboard, and Nginx reverse proxy architecture with Android webview deployment support.
▸ Automated Pothole Detection & Road Hazard Assessment (Final Year Capstone) Python • OpenCV • Computer Vision • CNN / ML • Flask
  Developed an automated real-time computer vision system to detect road surface distress and potholes from camera feeds. Implemented adaptive thresholding, contour segmentation, and classification models to generate automated geo-tagged road hazard logs.
▸ Aerial Object Detection & Airspace Surveillance System Python • YOLOv8 • MobileNetV2 (99% Acc) • Transfer Learning
  Engineered a deep learning system classifying birds vs. drones in aerial video. Implemented MobileNetV2 transfer learning alongside YOLOv8 for real-time bounding-box object localization in surveillance video feeds.
▸ PCB Defect Detection & Visual Quality Inspection System Python • Flask • MATLAB Engine API • OpenCV
  Built an automated visual inspection web tool integrating MATLAB image processing via MATLAB Engine API with a Flask backend to execute edge detection, morphological filtering, and automated anomaly reporting.

EDUCATION
B.Tech in CSE CGPA: 7.85 — Dayananda Sagar University (2022 – Oct 2026, Grad: Oct 28)
Class XII (State) 79% — The Narayana Institutions (2020 – 2022, Bengaluru)
Class X (CBSE) 72% — Aditya Birla Public School (2012 – 2020, Adityanagar)

VERIFIED CERTIFICATIONS & GLOBAL HONORS
★ Galactic Problem Solver (NASA Space Apps Challenge 2024 / ISRO)
✓ TechA Linux Foundation Certification (Infosys Springboard) (Linux Bash Scripting & Shell Programming)
✓ Practical Jenkins CI/CD Certification (Infosys Springboard)
✓ Scrum Foundation: Scrum in Action (Infosys Springboard)
✓ MATLAB Onramp (100% Verified) (MathWorks Training)
✓ Product Management Simulation (Electronic Arts / Forage)

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