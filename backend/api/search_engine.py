"""
DSA-Based Search Engine for Portfolio Agent
Implements: Inverted Index, TF-IDF, Bloom Filter, Priority Queue
"""

import math
import hashlib
from collections import defaultdict
from functools import lru_cache
import heapq


# =========================================
# BLOOM FILTER - Quick membership check
# =========================================

class BloomFilter:
    """Probabilistic check if word is in your vocabulary."""
    
    def __init__(self, size=1000, hash_count=3):
        self.size = size
        self.hash_count = hash_count
        self.bit_array = [0] * size
    
    def _hashes(self, item):
        """Generate multiple hash positions."""
        for i in range(self.hash_count):
            yield (hash(item + str(i)) % self.size)
    
    def add(self, item):
        """Add item to filter."""
        for pos in self._hashes(item):
            self.bit_array[pos] = 1
    
    def check(self, item):
        """Check if item might be in set (no false negatives)."""
        return all(self.bit_array[pos] for pos in self._hashes(item))
    
    def add_many(self, items):
        """Add multiple items."""
        for item in items:
            self.add(item)


# =========================================
# INVERTED INDEX - Keyword -> Document mapping
# =========================================

class InvertedIndex:
    """Maps words to documents containing them."""
    
    def __init__(self):
        self.index = defaultdict(list)  # word -> [(doc_id, tf_score), ...]
        self.documents = {}  # doc_id -> full document
        self.doc_count = 0
    
    def add_document(self, doc_id, content, metadata=None):
        """
        Add document to index.
        content: string of text
        metadata: dict with url, source_type, etc.
        """
        words = self._tokenize(content)
        word_freq = defaultdict(int)
        
        for word in words:
            word_freq[word] += 1
        
        # Store document
        self.documents[doc_id] = {
            "content": content,
            "metadata": metadata or {},
            "word_count": len(words),
            "word_freq": dict(word_freq)
        }
        
        # Update index with TF scores
        for word, freq in word_freq.items():
            tf = freq / len(words) if words else 0
            self.index[word].append((doc_id, tf))
        
        self.doc_count += 1
    
    def search(self, query, top_k=5):
        """
        Search index for query.
        Returns ranked results using TF-IDF scoring.
        """
        query_words = self._tokenize(query)
        
        if not query_words:
            return []
        
        # Score documents
        doc_scores = defaultdict(float)
        
        for word in query_words:
            if word not in self.index:
                continue
            
            # IDF: log(total_docs / docs_with_word)
            idf = math.log(self.doc_count / len(self.index[word]))
            
            for doc_id, tf in self.index[word]:
                # TF-IDF score
                doc_scores[doc_id] += tf * idf
        
        # Rank by score using Priority Queue (heapq)
        ranked = []
        for doc_id, score in doc_scores.items():
            # Use negative score for max-heap behavior
            heapq.heappush(ranked, (-score, doc_id))
        
        # Extract top_k
        results = []
        for _ in range(min(top_k, len(ranked))):
            neg_score, doc_id = heapq.heappop(ranked)
            doc = self.documents[doc_id]
            results.append({
                "doc_id": doc_id,
                "score": -neg_score,
                "title": doc["metadata"].get("title", "Unknown"),
                "content": doc["content"][:300],
                "url": doc["metadata"].get("url"),
                "source_type": doc["metadata"].get("source_type", "portfolio")
            })
        
        return results
    
    def _tokenize(self, text):
        """Simple tokenizer - lowercase, remove punctuation, split."""
        text = text.lower()
        # Keep only alphanumeric and spaces
        cleaned = ''.join(c if c.isalnum() or c.isspace() else ' ' for c in text)
        # Split and filter short words
        return [w for w in cleaned.split() if len(w) > 2]


# =========================================
# GLOBAL SEARCH ENGINE INSTANCE
# =========================================

_search_engine = None
_bloom_filter = None


def get_search_engine():
    """Get or create search engine singleton."""
    global _search_engine
    if _search_engine is None:
        _search_engine = InvertedIndex()
    return _search_engine


def get_bloom_filter():
    """Get or create bloom filter singleton."""
    global _bloom_filter
    if _bloom_filter is None:
        _bloom_filter = BloomFilter(size=2000, hash_count=5)
    return _bloom_filter


# =========================================
# INDEX BUILDERS
# =========================================

def index_portfolio_projects():
    """Index all portfolio projects from database."""
    from .models import Project
    
    engine = get_search_engine()
    
    projects = Project.objects.all()
    for p in projects:
        content = f"{p.title} {p.description} {p.tech} {p.category}"
        engine.add_document(
            doc_id=f"project_{p.id}",
            content=content,
            metadata={
                "title": p.title,
                "url": p.github or p.demo,
                "source_type": "portfolio"
            }
        )


def index_resume_text(resume_text: str):
    """Index resume text."""
    engine = get_search_engine()
    
    engine.add_document(
        doc_id="resume",
        content=resume_text,
        metadata={
            "title": "Sujal's Resume",
            "url": None,
            "source_type": "resume"
        }
    )


def index_explicit_data():
    """Index explicit data about you (skills, contact, etc.)."""
    engine = get_search_engine()
    bloom = get_bloom_filter()
    
    # Your explicit profile data
    explicit_data = [
        {
            "doc_id": "profile_skills",
            "content": """
                S V S Sujal skills: Python, Java, C, R programming languages.
                Web development: Django, Node.js, HTML, CSS, JavaScript, React.
                DevOps: Docker, Jenkins, GitHub, Ansible, Bash scripting.
                Cloud: AWS, Linux.
                Data: MySQL, MongoDB, Power BI.
                Machine Learning: OpenCV, scikit-learn, image processing, MATLAB.
                Agile: Scrum, XP, Lean, Kanban.
                Languages: Telugu, English, Kannada, Hindi (fluent), Japanese (intermediate).
            """,
            "metadata": {
                "title": "Skills & Expertise",
                "source_type": "resume"
            }
        },
        {
            "doc_id": "profile_contact",
            "content": """
                S V S Sujal contact information.
                Phone: 8105115505
                Email: svss.officia13@gmail.com
                Location: Bengaluru, India
                LinkedIn: www.linkedin.com/in/svss13
                GitHub: https://github.com/SVSS13
                Instagram: https://www.instagram.com/mr_svss_/
                Portfolio: https://svs-sujal-portfolio.vercel.app
            """,
            "metadata": {
                "title": "Contact Information",
                "source_type": "resume"
            }
        },
        {
            "doc_id": "profile_education",
            "content": """
                S V S Sujal education:
                Dayananda Sagar University - Bachelor's in Computer Science & Engineering (2022-2026), CGPA 7.65.
                The Narayana Institutions - Class XII, 79% (2020-2022).
                The Aditya Birla Public School, Kovaya - Class X, 72% (2010-2020).
            """,
            "metadata": {
                "title": "Education",
                "source_type": "resume"
            }
        },
        {
            "doc_id": "profile_experience",
            "content": """
                S V S Sujal experience and certifications:
                Electronic Arts Product Management Job Simulation (Forage, September 2025).
                Certifications: Linux Shell Programming, Bash Scripting, Linux Shell Scripting Solutions, 
                Tech A Linux Programming Foundation, Image Processing with MATLAB, Image Processing Onramp,
                Practical Jenkins, Scrum Foundation, Product Management Job Simulation, Project Management Institute Kick-Off.
                Skills: Build Engineering, Cloud Practitioner, Project Management, Agile, DevOps.
            """,
            "metadata": {
                "title": "Experience & Certifications",
                "source_type": "resume"
            }
        },
        {
            "doc_id": "profile_projects",
            "content": """
                S V S Sujal projects:
                1. Cat vs Dog Image Classifier - Python, OpenCV, scikit-learn, SVM, KNN, Decision Tree, Tkinter GUI, Joblib.
                2. PCB Defect Detection System - Python, Flask, MATLAB image processing, MATLAB Engine API, edge detection, morphological operations.
                3. Informex Shiny Data Analysis App - R, Shiny, ggplot2, tidyverse, corrplot, DT, statistical analysis.
                4. E KART Online Shopping - HTML, CSS, JavaScript, responsive design, DOM manipulation, cart functionality.
            """,
            "metadata": {
                "title": "Projects Summary",
                "source_type": "resume"
            }
        }
    ]
    
    for item in explicit_data:
        engine.add_document(
            doc_id=item["doc_id"],
            content=item["content"],
            metadata=item["metadata"]
        )
        
        # Add to bloom filter for quick checks
        words = engine._tokenize(item["content"])
        bloom.add_many(words)
    
    # Add your identifiers to bloom filter
    identifiers = ["svss", "svss13", "sujal", "svs", "s.v.s", "mr_svss_", "sujal-svss"]
    bloom.add_many(identifiers)


def build_complete_index(resume_text: str = None):
    """
    Build complete search index.
    Call this once at server startup.
    """
    index_explicit_data()
    index_portfolio_projects()
    
    if resume_text:
        index_resume_text(resume_text)
    
    print(f"Search index built: {get_search_engine().doc_count} documents")


# =========================================
# SEARCH INTERFACE
# =========================================

@lru_cache(maxsize=128)
def cached_search(query: str, top_k: int = 5):
    """Cached search for frequent queries."""
    engine = get_search_engine()
    return engine.search(query, top_k)


def is_about_me(query: str) -> tuple:
    """
    Check if query is about Sujal using Bloom Filter.
    Returns: (is_about_me, confidence)
    """
    bloom = get_bloom_filter()
    words = query.lower().split()
    
    # Check for strong identifiers
    strong_ids = ["svss", "svss13", "sujal", "s.v.s", "mr_svss_"]
    for w in words:
        if any(sid in w for sid in strong_ids):
            return (True, 1.0)
    
    # Check bloom filter for partial matches
    matches = sum(1 for w in words if bloom.check(w))
    ratio = matches / len(words) if words else 0
    
    if ratio >= 0.5:
        return (True, 0.8)
    elif ratio > 0:
        return (True, 0.5)
    
    return (False, 0.0)