"""
AI Engine - DSA-Based Agentic Portfolio Assistant
Uses: Inverted Index, TF-IDF, Bloom Filter, Priority Queue, LRU Cache
"""

import os
import json
import time
import httpx
from functools import lru_cache
from groq import Groq
from django.conf import settings

from .search_engine import (
    get_search_engine, get_bloom_filter, is_about_me,
    cached_search, build_complete_index
)
from .resume_parser import parse_resume_pdf, extract_resume_sections


# =========================================
# CONFIGURATION
# =========================================

client = Groq(api_key=settings.GROQ_API_KEY)

TAVILY_API_KEY = getattr(settings, 'TAVILY_API_KEY', os.getenv('TAVILY_API_KEY'))
GITHUB_TOKEN = getattr(settings, 'GITHUB_TOKEN', os.getenv('GITHUB_TOKEN'))
GITHUB_USERNAME = getattr(settings, 'GITHUB_USERNAME', 'SVSS13')

# YOUR KNOWN IDENTITIES (hardcoded for accuracy)
YOUR_IDENTITIES = {
    "github": {
        "url": "https://github.com/SVSS13",
        "username": "SVSS13",
        "title": "SVSS13 on GitHub"
    },
    "instagram": {
        "url": "https://www.instagram.com/mr_svss_/",
        "username": "mr_svss_",
        "title": "@mr_svss_ on Instagram"
    },
    "linkedin": {
        "url": "https://www.linkedin.com/in/svss13",
        "username": "svss13",
        "title": "Sujal on LinkedIn"
    },
    "portfolio": {
        "url": "https://svs-sujal-portfolio.vercel.app",
        "title": "Sujal's Portfolio"
    }
}


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
    print("Agent initialized with DSA search engine")


# =========================================
# TOOLS - Now using DSA Search Engine
# =========================================

def search_portfolio(query: str) -> dict:
    """
    Search using Inverted Index + TF-IDF.
    O(1) lookup, O(n log n) ranking.
    """
    engine = get_search_engine()
    
    # Check if query is about me
    is_me, confidence = is_about_me(query)
    
    if not is_me:
        return {
            "found": False,
            "results": [],
            "source_type": "portfolio",
            "message": "Query doesn't appear to be about Sujal"
        }
    
    # Search the index
    results = cached_search(query, top_k=5)
    
    return {
        "found": len(results) > 0,
        "results": results,
        "source_type": "portfolio",
        "confidence_boost": confidence
    }


def search_identity(platform: str) -> dict:
    """
    Return known identity with high confidence.
    No web search needed for your own profiles.
    """
    platform = platform.lower()
    
    if platform in YOUR_IDENTITIES:
        identity = YOUR_IDENTITIES[platform]
        return {
            "found": True,
            "profiles": [{
                "url": identity["url"],
                "title": identity["title"],
                "username": identity.get("username", ""),
                "platform": platform,
                "confidence": 1.0,  # Known identity = 100% confidence
                "verified": True
            }],
            "top_confidence": 1.0,
            "source_type": "identity"
        }
    
    # Unknown platform
    return {
        "found": False,
        "profiles": [],
        "top_confidence": 0,
        "source_type": "identity"
    }

# =========================================
# REAL EMAIL ACTION
# =========================================

def send_email_action(visitor_email: str, visitor_message: str) -> dict:
    """
    Actually send email to your address.
    Returns success/failure.
    """
    try:
        from .email_utils import send_contact_email
        
        send_contact_email(
            name="Portfolio Visitor",
            email=visitor_email,
            message=f"From: {visitor_email}\n\nMessage: {visitor_message}\n\n---\nSent via Portfolio AI Agent"
        )
        
        return {
            "success": True,
            "message": f"Email sent to svss.officia13@gmail.com"
        }
    except Exception as e:
        print(f"Email send error: {e}")
        return {
            "success": False,
            "message": f"Failed to send: {str(e)}"
        }


def create_lead(name: str, email: str, message: str) -> dict:
    """
    Create a lead in your system (for recruiter interactions).
    """
    # Store in database or send notification
    try:
        from .email_utils import send_contact_email
        send_contact_email(name, email, message)
        return {
            "success": True,
            "message": "Lead captured and notification sent"
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


def search_github_repos(query: str) -> dict:
    """Search GitHub repos for SVSS13."""
    try:
        headers = {"Accept": "application/vnd.github.v3+json"}
        if GITHUB_TOKEN:
            headers["Authorization"] = f"token {GITHUB_TOKEN}"
        
        # Search user's repos
        url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?sort=updated&per_page=10"
        
        response = httpx.get(url, headers=headers, timeout=10)
        repos_data = response.json()
        
        # Filter by query if provided
        query_lower = query.lower()
        repos = []
        
        for item in repos_data:
            repo_text = f"{item['name']} {item.get('description', '')}".lower()
            
            score = 0
            if query_lower in repo_text:
                score += 2
            if any(q in repo_text for q in query_lower.split()):
                score += 1
            
            repos.append({
                "name": item["name"],
                "description": item.get("description", ""),
                "url": item["html_url"],
                "stars": item["stargazers_count"],
                "language": item.get("language", ""),
                "updated_at": item["updated_at"],
                "match_score": score
            })
        
        # Sort by match score, then by stars
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
    """Web search for unknown queries (fallback)."""
    if not TAVILY_API_KEY:
        return {"found": False, "results": [], "source_type": "web_search"}
    
    try:
        import tavily
        tavily_client = tavily.TavilyClient(api_key=TAVILY_API_KEY)
        
        # Enhance query with your identity
        enhanced_query = query
        if "sujal" in query.lower() and "svss" not in query.lower():
            enhanced_query = f"{query} SVSS13"
        
        response = tavily_client.search(
            query=enhanced_query,
            max_results=5,
            include_answer=True,
            search_depth="advanced"
        )
        
        # Filter results for relevance to you
        filtered_results = []
        for r in response.get("results", []):
            content = r.get("content", "").lower()
            url = r.get("url", "").lower()
            
            # Boost score if mentions your identifiers
            relevance = 0
            if "svss" in content or "svss" in url:
                relevance += 2
            if "sujal" in content:
                relevance += 1
            
            r["relevance_score"] = relevance
            filtered_results.append(r)
        
        # Sort by relevance
        filtered_results.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        return {
            "found": len(filtered_results) > 0,
            "results": filtered_results[:5],
            "answer": response.get("answer", ""),
            "source_type": "web_search"
        }
        
    except Exception as e:
        print(f"Web search error: {e}")
        return {"found": False, "results": [], "source_type": "web_search"}


# =========================================
# AGENT CORE
# =========================================

def analyze_intent(message: str) -> dict:
    """Analyze user intent with improved classification."""
    
    system = """Analyze user intent. Respond ONLY with JSON:
{
    "intent": "portfolio_query|identity_query|github_query|skills_query|experience_query|education_query|contact_query|general",
    "entities": ["keywords"],
    "reasoning": "brief"
}

Intent definitions:
- portfolio_query: projects, work, what built
- identity_query: social media, instagram, linkedin, github, who are you
- github_query: repositories, code, commits
- skills_query: technologies, what can you do, tech stack
- experience_query: work history, jobs, certifications
- education_query: college, degree, university, cgpa
- contact_query: email, phone, how to reach, hire
- general: greetings, thanks, casual chat"""
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": message}
            ],
            temperature=0.3,
            max_tokens=200,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Intent error: {e}")
        return {"intent": "portfolio_query", "entities": [], "reasoning": "fallback"}


def execute_tools(intent: str, message: str):
    """Execute tools based on intent with DSA optimization."""
    rag_results = []
    search_results = []
    tools_used = []
    
    # Intent-based routing
    if intent in ["portfolio_query", "skills_query", "experience_query", "education_query"]:
        result = search_portfolio(message)
        rag_results.append(result)
        tools_used.append("portfolio_search")
        
        # Fallback to web if portfolio search weak
        if not result.get("found") or result.get("confidence_boost", 0) < 0.5:
            web = search_web(message)
            if web["found"]:
                search_results.append(web)
                tools_used.append("web_search")
    
    elif intent == "identity_query":
        # Extract platform from message
        platform = None
        for p in ["instagram", "linkedin", "github", "twitter", "portfolio"]:
            if p in message.lower():
                platform = p
                break
        
        if platform:
            result = search_identity(platform)
            search_results.append(result)
            tools_used.append("identity_search")
        else:
            # Return all identities
            all_identities = []
            for platform, data in YOUR_IDENTITIES.items():
                all_identities.append({
                    "url": data["url"],
                    "title": data["title"],
                    "platform": platform,
                    "confidence": 1.0
                })
            search_results.append({
                "found": True,
                "profiles": all_identities,
                "top_confidence": 1.0,
                "source_type": "identity"
            })
            tools_used.append("identity_search")
    
    elif intent == "github_query":
        result = search_github_repos(message)
        search_results.append(result)
        tools_used.append("github_search")
    
    elif intent == "contact_query":
        # Provide contact info — NO fake actions
        search_results.append({
            "found": True,
            "profiles": [{
                "url": "mailto:svss.officia13@gmail.com",
                "title": "Email: svss.officia13@gmail.com",
                "platform": "email",
                "confidence": 1.0
            }, {
                "url": "tel:8105115505",
                "title": "Phone: 8105115505",
                "platform": "phone",
                "confidence": 1.0
            }],
            "top_confidence": 1.0,
            "source_type": "identity"
        })
        tools_used.append("identity_search")
    
    elif intent == "general":
        # Check if it's about you anyway
        is_me, _ = is_about_me(message)
        if is_me:
            result = search_portfolio(message)
            rag_results.append(result)
            tools_used.append("portfolio_search")
    
    return rag_results, search_results, tools_used


def calculate_confidence(rag_results, search_results):
    """Calculate weighted confidence score."""
    scores = []
    weights = []
    
    for rag in rag_results:
        if rag.get("found"):
            base = 0.9
            boost = rag.get("confidence_boost", 0)
            scores.append(min(base + boost * 0.1, 1.0))
            weights.append(2.0)  # Higher weight for portfolio data
        else:
            scores.append(0.0)
            weights.append(1.0)
    
    for search in search_results:
        if search.get("source_type") == "identity":
            scores.append(search.get("top_confidence", 0))
            weights.append(1.5)
        elif search.get("source_type") == "github":
            scores.append(0.8 if search.get("found") else 0.0)
            weights.append(1.0)
        elif search.get("source_type") == "web_search":
            num_results = len(search.get("results", []))
            scores.append(min(0.5 + num_results * 0.1, 0.8))
            weights.append(0.5)  # Lower weight for web (less reliable)
    
    # Weighted average
    if not scores:
        return 0.5
    
    weighted_sum = sum(s * w for s, w in zip(scores, weights))
    total_weight = sum(weights)
    
    return min(weighted_sum / total_weight, 1.0)


def build_sources(rag_results, search_results):
    """Build sources with aggressive deduplication."""
    sources = []
    seen_urls = set()  # Track by URL only
    seen_titles = set()  # Track by title as backup
    
    # Process all sources in order: portfolio -> identity -> github -> web
    all_raw_sources = []
    
    # Collect from RAG
    for rag in rag_results:
        for r in rag.get("results", []):
            all_raw_sources.append({
                "title": r.get("title", "Portfolio"),
                "url": r.get("url", ""),
                "content": r.get("content", "")[:200],
                "confidence": 0.9,
                "source_type": r.get("source_type", "portfolio")
            })
    
    # Collect from searches
    for search in search_results:
        if search.get("source_type") == "identity":
            for p in search.get("profiles", []):
                all_raw_sources.append({
                    "title": p.get("title", f"{p.get('platform', 'Social')} Profile"),
                    "url": p.get("url", ""),
                    "content": f"@{p.get('username', '')}" if p.get("username") else p.get("title", ""),
                    "confidence": p.get("confidence", 1.0),
                    "source_type": "identity"
                })
        elif search.get("source_type") == "github":
            for r in search.get("results", []):
                all_raw_sources.append({
                    "title": r.get("name", "GitHub Repo"),
                    "url": r.get("url", ""),
                    "content": f"{r.get('description', '')[:100]} ⭐{r.get('stars', 0)}",
                    "confidence": 0.8,
                    "source_type": "github"
                })
        elif search.get("source_type") == "web_search":
            for r in search.get("results", []):
                all_raw_sources.append({
                    "title": r.get("title", "Web Result"),
                    "url": r.get("url", ""),
                    "content": r.get("content", r.get("snippet", ""))[:200],
                    "confidence": 0.6,
                    "source_type": "web_search"
                })
    
    # DEDUPLICATE: Keep first occurrence by URL
    for s in all_raw_sources:
        url = s.get("url", "") or s.get("title", "")  # Use title if no URL
        title = s.get("title", "")
        
        # Skip if URL seen
        if url and url in seen_urls:
            continue
        if url:
            seen_urls.add(url)
        
        # Skip if title seen (for items without URL)
        if title in seen_titles:
            continue
        seen_titles.add(title)
        
        sources.append(s)
    
    return sources


def synthesize(message, intent, rag_results, search_results, confidence, memory):
    """Generate final response. NEVER claims to send emails or perform actions."""
    
    context_parts = []
    
    for rag in rag_results:
        if rag.get("found"):
            for r in rag["results"]:
                content = r.get("content", "")
                title = r.get("title", "")
                source_type = r.get("source_type", "portfolio")
                context_parts.append(f"[{source_type.upper()}] {title}: {content[:200]}")
    
    for search in search_results:
        if search.get("source_type") == "identity":
            for p in search.get("profiles", []):
                context_parts.append(f"[IDENTITY] {p.get('title')}: {p.get('url')}")
        elif search.get("source_type") == "github":
            for r in search.get("results", []):
                context_parts.append(f"[GITHUB] {r.get('name')}: {r.get('description', '')}")
        elif search.get("source_type") == "web_search":
            if search.get("answer"):
                context_parts.append(f"[WEB] {search['answer']}")
    
    context = "\n".join(context_parts) if context_parts else "No specific sources found."
    
    # STRICT SYSTEM PROMPT — prevents fake actions
    system = f"""You are Sujal's AI Portfolio Assistant.

STRICT RULES:
- ONLY provide information and contact details
- NEVER say you sent an email, made a call, or performed any action
- NEVER say "Email sent" or "I have sent"
- If user wants to contact Sujal, say: "You can reach Sujal at..."
- Provide email: svss.officia13@gmail.com
- Provide phone: 8105115505
- Cite sources with [Source: type]
- Be concise (max 80 words)
- No hallucinations

Confidence: {confidence:.0%}
Sources:
{context}"""
    
    messages = [{"role": "system", "content": system}]
    for msg in memory[-3:]:
        messages.append(msg)
    messages.append({"role": "user", "content": message})
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.3,  # Lower temp = less hallucination
        max_tokens=120
    )
    
    return response.choices[0].message.content

# =========================================
# MAIN ENTRY POINT
# =========================================

def generate_ai_response(message: str, session_id: str = "default"):
    """
    DSA-Optimized Agentic Response.
    Returns dict with full structured data.
    """
    
    # Rate limiting
    current_time = time.time()
    
    if session_id not in request_tracker:
        request_tracker[session_id] = []
    
    request_tracker[session_id] = [
        t for t in request_tracker[session_id]
        if current_time - t < 60
    ]
    
    if len(request_tracker[session_id]) >= 10:
        return {
            "answer": "⚠️ Rate limit exceeded. Please wait a minute.",
            "confidence": 0,
            "sources": [],
            "tools_used": [],
            "error": "rate_limit"
        }
    
    request_tracker[session_id].append(current_time)
    
    # Memory management
    if session_id not in conversation_memory:
        conversation_memory[session_id] = []
    
    memory = conversation_memory[session_id]
    memory.append({"role": "user", "content": message[:250]})
    memory = memory[-4:]
    
    # Agent pipeline
    intent_data = analyze_intent(message)
    intent = intent_data.get("intent", "portfolio_query")
    
    rag_results, search_results, tools_used = execute_tools(intent, message)
    confidence = calculate_confidence(rag_results, search_results)
    sources = build_sources(rag_results, search_results)
    
    # Generate response
    answer = synthesize(message, intent, rag_results, search_results, confidence, memory)
    
    # Save to memory
    memory.append({"role": "assistant", "content": answer[:300]})
    conversation_memory[session_id] = memory[-4:]
    
    return {
        "answer": answer,
        "confidence": confidence,
        "sources": sources,
        "tools_used": tools_used,
        "intent": intent
    }

# =========================================
# REAL EMAIL ACTION (Optional)
# =========================================

def send_email_to_sujal(visitor_email: str, visitor_message: str) -> dict:
    """
    Actually send email to your address.
    Call this from views.py, not from the agent directly.
    """
    try:
        from .email_utils import send_contact_email
        
        send_contact_email(
            name="Portfolio Visitor",
            email=visitor_email,
            message=f"From: {visitor_email}\n\nMessage: {visitor_message}\n\n---\nSent via Portfolio AI Agent"
        )
        
        return {
            "success": True,
            "message": f"Email sent to svss.officia13@gmail.com"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed: {str(e)}"
        }