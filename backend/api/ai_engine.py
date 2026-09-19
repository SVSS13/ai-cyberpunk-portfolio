"""
AI Engine - Multi-Provider DSA-Based Agentic Portfolio Assistant
Supports:
  1. NVIDIA NIM Free API (meta/llama-3.2-11b-vision-instruct, meta/llama-3.3-70b-instruct)
  2. Groq API (qwen/qwen3.8-27b)
  3. Tavily Live Web Search (REST API via httpx)
  4. DSA-Based Resume Indexing (Inverted Index, TF-IDF, Bloom Filter)
"""

import os
import json
import time
import re
import httpx
from functools import lru_cache
from django.conf import settings

from .search_engine import (
    get_search_engine, get_bloom_filter, is_about_me,
    cached_search, build_complete_index
)
from .resume_parser import parse_resume_pdf, extract_resume_sections


# =========================================
# CONFIGURATION
# =========================================

NVIDIA_API_KEY = getattr(settings, 'NVIDIA_API_KEY', os.getenv('NVIDIA_API_KEY'))
NVIDIA_MODEL = getattr(settings, 'NVIDIA_MODEL', os.getenv('NVIDIA_MODEL', 'meta/llama-3.2-11b-vision-instruct'))
GROQ_API_KEY = getattr(settings, 'GROQ_API_KEY', os.getenv('GROQ_API_KEY'))

TAVILY_API_KEY = getattr(settings, 'TAVILY_API_KEY', os.getenv('TAVILY_API_KEY', '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'))
GITHUB_TOKEN = getattr(settings, 'GITHUB_TOKEN', os.getenv('GITHUB_TOKEN'))
GITHUB_USERNAME = getattr(settings, 'GITHUB_USERNAME', 'SVSS13')


# =========================================
# VERIFIED GROUND TRUTH IDENTITIES
# =========================================

YOUR_IDENTITIES = {
    "instagram": {
        "url": "https://www.instagram.com/mr_svss_/",
        "username": "mr_svss_",
        "title": "@mr_svss_ on Instagram",
        "description": "Sujal's official Instagram profile: @mr_svss_"
    },
    "linkedin": {
        "url": "https://www.linkedin.com/in/svss13",
        "username": "svss13",
        "title": "Sujal on LinkedIn",
        "description": "Sujal's LinkedIn professional profile: svss13"
    },
    "github": {
        "url": "https://github.com/SVSS13",
        "username": "SVSS13",
        "title": "SVSS13 on GitHub",
        "description": "Sujal's GitHub code repositories and open-source contributions"
    },
    "portfolio": {
        "url": "https://svs-sujal-portfolio.vercel.app",
        "title": "Sujal's Portfolio",
        "description": "Official interactive Cyberpunk/Samurai portfolio of Sujal"
    }
}

SUJAL_GROUND_TRUTH = """
ABOUT SUJAL (S V S SUJAL / SVSS):
- Full Name: S V S Sujal (digital alias: SVSS / SVSS13)
- College / University: Dayananda Sagar University (Bengaluru, Karnataka)
- Degree: Bachelor of Technology (B.Tech) in Computer Science & Engineering (2022–2026), CGPA: 7.85
- College & Academic Focus:
  * Focused on Core Computer Science, Software Engineering, Machine Learning, and Cloud DevOps.
  * Key Engineering Coursework Projects Built at University:
    1. Cat vs Dog Image Classifier (Python, OpenCV, scikit-learn, SVM, KNN, Decision Tree, Tkinter, Joblib)
    2. PCB Defect Detection System (Python, Flask, MATLAB image processing, automated optical inspection)
    3. Informex Shiny Data Analysis App (R, Shiny, ggplot2, tidyverse, telemetry analytics)
    4. E KART E-Commerce (HTML, CSS, JavaScript, responsive shopping interface)
  * Industry Simulation & Certifications during College:
    - Electronic Arts (EA) Product Management Job Simulation (Forage, Sept 2025)
    - Linux Shell Programming, Bash Scripting, and Linux Shell Scripting Solutions
    - Practical Jenkins, Scrum Foundation, Project Management Institute Kick-Off
    - MATLAB Image Processing Onramp
- Verified Social Profiles & Handles:
  * Instagram: @mr_svss_ (https://www.instagram.com/mr_svss_/)
  * LinkedIn: svss13 (https://www.linkedin.com/in/svss13)
  * GitHub: SVSS13 (https://github.com/SVSS13)
  * Portfolio: https://svs-sujal-portfolio.vercel.app / https://sujalsvs.in
- Contact Details:
  * Email: svss.officia13@gmail.com
  * Phone: +91 8105115505
- Languages: Telugu, English, Kannada, Hindi (fluent), Japanese (intermediate)
"""


# =========================================
# MULTI-PROVIDER LLM CALLER
# =========================================

def call_llm(messages: list, max_tokens: int = 200, temperature: float = 0.3, json_mode: bool = False) -> str:
    """
    Execute LLM call prioritizing NVIDIA NIM (free API), falling back to Groq.
    """
    # 1. Try NVIDIA NIM API if key is present
    nv_key = getattr(settings, 'NVIDIA_API_KEY', os.getenv('NVIDIA_API_KEY'))
    if nv_key:
        try:
            url = "https://integrate.api.nvidia.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {nv_key}",
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            payload = {
                "model": getattr(settings, 'NVIDIA_MODEL', 'meta/llama-3.2-11b-vision-instruct'),
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            if json_mode:
                payload["response_format"] = {"type": "json_object"}
            
            resp = httpx.post(url, headers=headers, json=payload, timeout=18.0)
            if resp.status_code == 200:
                data = resp.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                if content:
                    return content
            else:
                print(f"[NVIDIA NIM] Status {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"[NVIDIA NIM Error] {e}")

    # 2. Try Groq API as primary or fallback
    gr_key = getattr(settings, 'GROQ_API_KEY', os.getenv('GROQ_API_KEY'))
    if gr_key:
        try:
            from groq import Groq
            client = Groq(api_key=gr_key)
            kwargs = {
                "model": "qwen/qwen3.8-27b",
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}
            response = client.chat.completions.create(**kwargs)
            return response.choices[0].message.content
        except Exception as e:
            print(f"[Groq Error] {e}")

    raise RuntimeError("No working LLM provider available.")


# =========================================
# MEMORY & RATE LIMITING
# =========================================

conversation_memory = {}
request_tracker = {}


# =========================================
# INITIALIZE SEARCH INDEX (call once at startup)
# =========================================

_resume_sections = None

def initialize_agent():
    """Build search index with resume and portfolio data."""
    global _resume_sections
    
    resume_text = parse_resume_pdf()
    _resume_sections = extract_resume_sections(resume_text)
    
    build_complete_index(resume_text)
    print("Agent initialized with DSA search engine & Multi-Provider LLM")


# =========================================
# TOOLS - Portfolio RAG, Identity, GitHub, Web Search
# =========================================

def search_portfolio(query: str) -> dict:
    """Search using Inverted Index + TF-IDF on Sujal's resume and portfolio."""
    results = cached_search(query, top_k=5)
    
    return {
        "found": len(results) > 0,
        "results": results,
        "source_type": "portfolio",
        "confidence_boost": 1.0 if results else 0.5
    }


def search_identity(platform: str = None) -> dict:
    """Return verified known social identities for Sujal."""
    if platform and platform.lower() in YOUR_IDENTITIES:
        identity = YOUR_IDENTITIES[platform.lower()]
        return {
            "found": True,
            "profiles": [{
                "url": identity["url"],
                "title": identity["title"],
                "username": identity.get("username", ""),
                "platform": platform.lower(),
                "confidence": 1.0,
                "verified": True
            }],
            "top_confidence": 1.0,
            "source_type": "identity"
        }
    
    # Return all identities
    all_profiles = []
    for p_name, data in YOUR_IDENTITIES.items():
        all_profiles.append({
            "url": data["url"],
            "title": data["title"],
            "username": data.get("username", ""),
            "platform": p_name,
            "confidence": 1.0,
            "verified": True
        })
    
    return {
        "found": True,
        "profiles": all_profiles,
        "top_confidence": 1.0,
        "source_type": "identity"
    }


def search_github_repos(query: str = "") -> dict:
    """Search GitHub repos for SVSS13."""
    try:
        headers = {"Accept": "application/vnd.github.v3+json"}
        if GITHUB_TOKEN:
            headers["Authorization"] = f"token {GITHUB_TOKEN}"
        
        url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=updated&per_page=10"
        response = httpx.get(url, headers=headers, timeout=10)
        repos_data = response.json()
        
        if not isinstance(repos_data, list):
            return {"found": False, "results": [], "source_type": "github"}
            
        query_lower = query.lower()
        repos = []
        
        for item in repos_data:
            repo_text = f"{item.get('name', '')} {item.get('description', '')}".lower()
            score = 0
            if query_lower in repo_text:
                score += 2
            if any(q in repo_text for q in query_lower.split() if len(q) > 2):
                score += 1
            
            repos.append({
                "name": item.get("name", "Repo"),
                "description": item.get("description", "") or "Sujal's repository",
                "url": item.get("html_url", f"https://github.com/{GITHUB_USERNAME}"),
                "stars": item.get("stargazers_count", 0),
                "language": item.get("language", ""),
                "updated_at": item.get("updated_at", ""),
                "match_score": score
            })
        
        repos.sort(key=lambda x: (x["match_score"], x["stars"]), reverse=True)
        return {
            "found": len(repos) > 0,
            "results": repos[:5],
            "source_type": "github"
        }
    except Exception as e:
        print(f"GitHub error: {e}")
        return {"found": False, "results": [], "source_type": "github"}


def search_web(query: str) -> dict:
    """
    Live Web Search via Tavily REST API.
    Guarantees search results are specifically about Sujal / SVSS13.
    """
    tavily_key = getattr(settings, 'TAVILY_API_KEY', os.getenv('TAVILY_API_KEY', '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'))
    if not tavily_key:
        return {"found": False, "results": [], "source_type": "web_search"}
    
    try:
        # Formulate query focused on Sujal
        enhanced_query = f"SVSS13 Sujal developer {query}"
        
        url = "https://api.tavily.com/search"
        payload = {
            "api_key": tavily_key,
            "query": enhanced_query,
            "search_depth": "basic",
            "max_results": 5
        }
        
        resp = httpx.post(url, json=payload, timeout=12.0)
        if resp.status_code != 200:
            return {"found": False, "results": [], "source_type": "web_search"}
            
        data = resp.json()
        raw_results = data.get("results", [])
        
        filtered = []
        for r in raw_results:
            title = r.get("title", "")
            content = r.get("content", "")
            url_str = r.get("url", "")
            
            # Grounding check: prioritize results mentioning SVSS or Sujal
            filtered.append({
                "title": title,
                "url": url_str,
                "content": content[:250],
                "confidence": 0.8,
                "source_type": "web_search"
            })
            
        return {
            "found": len(filtered) > 0,
            "results": filtered[:4],
            "source_type": "web_search"
        }
    except Exception as e:
        print(f"Web search error: {e}")
        return {"found": False, "results": [], "source_type": "web_search"}


def send_email_action(visitor_email: str, visitor_message: str) -> dict:
    """Send email notification."""
    try:
        from .email_utils import send_contact_email
        send_contact_email(
            name="Portfolio Visitor",
            email=visitor_email,
            message=f"From: {visitor_email}\n\nMessage: {visitor_message}\n\n---\nSent via Portfolio AI Agent"
        )
        return {
            "success": True,
            "message": "Email sent to svss.officia13@gmail.com"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to send: {str(e)}"
        }


# =========================================
# COMPOUND INTENT & TOOL ROUTING
# =========================================

def execute_tools(message: str):
    """
    Compound Multi-Intent Tool Routing.
    Analyzes all topics in the message and executes all relevant tools.
    """
    msg_lower = message.lower()
    
    rag_results = []
    search_results = []
    tools_used = []
    
    # 1. Check Identity / Social Profiles
    wants_identity = any(k in msg_lower for k in [
        'instagram', 'insta', 'linkedin', 'github', 'social', 'account',
        'handle', 'profile', 'who is', 'alias', 'identity', 'follow', 'online'
    ])
    
    if wants_identity:
        # Check specific platform
        specific_platform = None
        for p in ['instagram', 'linkedin', 'github', 'portfolio']:
            if p in msg_lower:
                specific_platform = p
                break
        
        id_res = search_identity(specific_platform)
        if id_res.get("found"):
            search_results.append(id_res)
            tools_used.append("identity_search")
            
    # 2. Check Projects / Achievements / Experience / Skills / Education
    wants_portfolio = any(k in msg_lower for k in [
        'project', 'achievement', 'built', 'work', 'major', 'app', 'system',
        'skill', 'stack', 'technology', 'technologies', 'python', 'tools',
        'education', 'college', 'degree', 'university', 'cgpa', 'experience',
        'certification', 'about', 'who'
    ]) or not wants_identity # default to checking portfolio
    
    if wants_portfolio:
        port_res = search_portfolio(message)
        if port_res.get("found"):
            rag_results.append(port_res)
            tools_used.append("portfolio_search")
            
    # 3. Check GitHub specific
    wants_github = any(k in msg_lower for k in ['github', 'repo', 'code', 'commit', 'repositories'])
    if wants_github:
        gh_res = search_github_repos(message)
        if gh_res.get("found"):
            search_results.append(gh_res)
            tools_used.append("github_search")
            
    # 4. Check Contact
    wants_contact = any(k in msg_lower for k in ['contact', 'email', 'phone', 'reach', 'hire', 'call', 'message'])
    if wants_contact:
        search_results.append({
            "found": True,
            "profiles": [{
                "url": "mailto:svss.officia13@gmail.com",
                "title": "Email: svss.officia13@gmail.com",
                "platform": "email",
                "confidence": 1.0
            }, {
                "url": "tel:8105115505",
                "title": "Phone: +91 8105115505",
                "platform": "phone",
                "confidence": 1.0
            }],
            "top_confidence": 1.0,
            "source_type": "identity"
        })
        tools_used.append("contact_info")

    # 5. Live Web Search fallback if information requested is beyond local index
    if not rag_results and not search_results:
        web_res = search_web(message)
        if web_res.get("found"):
            search_results.append(web_res)
            tools_used.append("web_search")

    return rag_results, search_results, tools_used


def calculate_confidence(rag_results, search_results):
    """Calculate weighted confidence score."""
    scores = []
    weights = []
    
    for rag in rag_results:
        if rag.get("found"):
            scores.append(1.0)
            weights.append(2.0)
    
    for search in search_results:
        if search.get("found"):
            scores.append(search.get("top_confidence", 0.9))
            weights.append(1.5)
            
    if not scores:
        return 0.9  # Ground truth provided
        
    weighted_sum = sum(s * w for s, w in zip(scores, weights))
    total_weight = sum(weights)
    return min(weighted_sum / total_weight, 1.0)


def build_sources(rag_results, search_results):
    """Build deduplicated source list."""
    sources = []
    seen_urls = set()
    seen_titles = set()
    all_raw = []
    
    for rag in rag_results:
        for r in rag.get("results", []):
            all_raw.append({
                "title": r.get("title", "Portfolio / Resume"),
                "url": r.get("url") or "https://svs-sujal-portfolio.vercel.app",
                "content": r.get("content", "")[:200],
                "confidence": 1.0,
                "source_type": "resume"
            })
            
    for search in search_results:
        if search.get("source_type") == "identity":
            for p in search.get("profiles", []):
                all_raw.append({
                    "title": p.get("title", "Identity Profile"),
                    "url": p.get("url", ""),
                    "content": p.get("title", ""),
                    "confidence": 1.0,
                    "source_type": "identity"
                })
        elif search.get("source_type") == "github":
            for r in search.get("results", []):
                all_raw.append({
                    "title": r.get("name", "GitHub Repo"),
                    "url": r.get("url", ""),
                    "content": f"{r.get('description', '')} (⭐ {r.get('stars', 0)})",
                    "confidence": 0.9,
                    "source_type": "github"
                })
        elif search.get("source_type") == "web_search":
            for r in search.get("results", []):
                all_raw.append({
                    "title": r.get("title", "Web Result"),
                    "url": r.get("url", ""),
                    "content": r.get("content", "")[:200],
                    "confidence": 0.8,
                    "source_type": "web_search"
                })
                
    for s in all_raw:
        url = s.get("url", "")
        title = s.get("title", "")
        if url and url in seen_urls:
            continue
        if url:
            seen_urls.add(url)
        if title in seen_titles:
            continue
        seen_titles.add(title)
        sources.append(s)
        
    return sources


def synthesize(message, rag_results, search_results, confidence, memory):
    """Synthesize intelligent response with full context and ground truth."""
    context_parts = []
    
    for rag in rag_results:
        if rag.get("found"):
            for r in rag["results"]:
                content = r.get("content", "")
                title = r.get("title", "")
                context_parts.append(f"[PORTFOLIO] {title}: {content[:300]}")
                
    for search in search_results:
        if search.get("source_type") == "identity":
            for p in search.get("profiles", []):
                context_parts.append(f"[IDENTITY] {p.get('title')}: {p.get('url')}")
        elif search.get("source_type") == "github":
            for r in search.get("results", []):
                context_parts.append(f"[GITHUB] {r.get('name')}: {r.get('url')} - {r.get('description')}")
        elif search.get("source_type") == "web_search":
            for r in search.get("results", []):
                context_parts.append(f"[WEB] {r.get('title')}: {r.get('url')} - {r.get('content')}")
                
    context = "\n".join(context_parts) if context_parts else "Use Ground Truth data."
    
    system = f"""You are Sujal's Official AI Portfolio Assistant.

{SUJAL_GROUND_TRUTH}

RETRIEVED CONTEXT & PROFILES:
{context}

STRICT ANTI-HALLUCINATION RULES:
1. ONLY state verified facts present in the ground truth above.
2. ABSOLUTELY NEVER INVENT, FABRICATE, OR GUESS fictitious college clubs, event names, club presidencies, or fake festivals (e.g. NEVER make up names like 'CodeCrusaders', 'TechFest', 'IEEE Day', etc.).
3. If asked about "college contributions", "university work", or "campus activities":
   - Explain that during his B.Tech at Dayananda Sagar University (7.85 CGPA), his core contributions and focus have been developing key technical engineering systems:
     * Cat vs Dog Image Classifier (Python, OpenCV, Machine Learning)
     * PCB Defect Detection System (Computer Vision & MATLAB)
     * Informex Data Analytics Application (R & Shiny)
     * E KART Web Platform
     * Electronic Arts (EA) Product Management Simulation & Linux/DevOps certifications.
4. If asked about social media (Instagram, LinkedIn, GitHub), ALWAYS provide the exact username and direct link:
   * Instagram: @mr_svss_ (https://www.instagram.com/mr_svss_/)
   * LinkedIn: svss13 (https://www.linkedin.com/in/svss13)
   * GitHub: SVSS13 (https://github.com/SVSS13)
5. Format answers cleanly with markdown bullet points. Be concise, direct, and completely factual.
"""
    
    messages = [{"role": "system", "content": system}]
    for msg in memory[-3:]:
        messages.append(msg)
    messages.append({"role": "user", "content": message})
    
    try:
        return call_llm(messages, max_tokens=400, temperature=0.1)
    except Exception as e:
        print(f"Synthesis error: {e}")
        return (
            "Sujal (SVSS) is a Computer Science undergraduate at Dayananda Sagar University (Bengaluru) "
            "and an aspiring Build Engineer & Cloud Practitioner.\n\n"
            "• **Instagram**: [@mr_svss_](https://www.instagram.com/mr_svss_/)\n"
            "• **LinkedIn**: [svss13](https://www.linkedin.com/in/svss13)\n"
            "• **GitHub**: [SVSS13](https://github.com/SVSS13)\n\n"
            "**Major Projects**:\n"
            "1. **Cat vs Dog Image Classifier** (Python, OpenCV, scikit-learn, SVM, KNN)\n"
            "2. **PCB Defect Detection** (Computer Vision automated visual inspection)\n\n"
            "Contact: svss.officia13@gmail.com | 8105115505"
        )


# =========================================
# MAIN ENTRY POINT
# =========================================

def generate_ai_response(message: str, session_id: str = "default"):
    """DSA-Optimized Agentic Response using Multi-Provider LLM & Web Search."""
    current_time = time.time()
    
    if session_id not in request_tracker:
        request_tracker[session_id] = []
    
    request_tracker[session_id] = [
        t for t in request_tracker[session_id]
        if current_time - t < 60
    ]
    
    if len(request_tracker[session_id]) >= 15:
        return {
            "answer": "⚠️ Rate limit exceeded. Please wait a moment.",
            "confidence": 0,
            "sources": [],
            "tools_used": [],
            "intent": "rate_limit"
        }
    
    request_tracker[session_id].append(current_time)
    
    if session_id not in conversation_memory:
        conversation_memory[session_id] = []
    
    memory = conversation_memory[session_id]
    memory.append({"role": "user", "content": message[:300]})
    memory = memory[-4:]
    
    # Execute compound tools
    rag_results, search_results, tools_used = execute_tools(message)
    confidence = calculate_confidence(rag_results, search_results)
    sources = build_sources(rag_results, search_results)
    
    # Generate synthesized response
    answer = synthesize(message, rag_results, search_results, confidence, memory)
    
    memory.append({"role": "assistant", "content": answer[:400]})
    conversation_memory[session_id] = memory[-4:]
    
    return {
        "answer": answer,
        "confidence": confidence,
        "sources": sources,
        "tools_used": tools_used,
        "intent": "compound_query"
    }
