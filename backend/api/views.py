from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import *
from .serializers import *
from .github import get_github_repos
from .ai_engine import generate_ai_response, initialize_agent
from .email_utils import send_contact_email


# Initialize agent on first import (server startup)
try:
    initialize_agent()
except Exception as e:
    print(f"Agent initialization error: {e}")


# =========================
# HOME
# =========================

@api_view(['GET'])
def home(request):
    return Response({
        "message": "Backend Running",
        "agent": "DSA-Optimized Agent v2.0"
    })


# =========================
# PROJECTS
# =========================

@api_view(['GET'])
def projects(request):
    data = Project.objects.all().order_by('-created_at')
    serializer = ProjectSerializer(data, many=True)
    return Response(serializer.data)


# =========================
# GITHUB
# =========================

@api_view(['GET'])
def github_repos(request):
    repos = get_github_repos("SVSS13")
    return Response(repos)


# =========================
# AI CHATBOT - DSA AGENTIC
# =========================
@api_view(['POST'])
def chatbot(request):
    message = request.data.get("message")
    session_id = request.META.get("REMOTE_ADDR", "default")
    
    if not message:
        return Response({"reply": "Hello! Ask me anything about Sujal's skills, projects, or background."})

    try:
        result = generate_ai_response(message, session_id)
    except Exception as e:
        print(f"Chatbot generation error: {e}")
        return Response({
            "reply": "Hello! I am Sujal's portfolio AI assistant. Feel free to browse through the projects, skills, or leave a message via the contact form!",
            "confidence": 0.8,
            "sources": ["portfolio_static"],
            "tools_used": ["fallback"],
            "intent": "general"
        })
    
    # Check if user wants to send email or be contacted
    msg_lower = message.lower()
    wants_contact = any(word in msg_lower for word in ["email", "send", "contact", "reach", "hire", "message"])
    
    # Try to extract visitor email
    import re
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', message)
    visitor_email = email_match.group(0) if email_match else None
    
    # If they want contact AND provided email, ACTUALLY SEND
    if wants_contact and visitor_email and visitor_email != "svss.officia13@gmail.com":
        try:
            from .ai_engine import send_email_action
            email_result = send_email_action(visitor_email, message)
            
            if email_result["success"]:
                result["answer"] += f"\n\n✅ {email_result['message']}"
                result["tools_used"].append("send_email")
            else:
                result["answer"] += f"\n\n⚠️ Could not send email. You can manually reach Sujal at svss.officia13@gmail.com"
        except Exception as e:
            print(f"Email action error: {e}")
    
    return Response({
        "reply": result["answer"],
        "confidence": result["confidence"],
        "sources": result["sources"],
        "tools_used": result["tools_used"],
        "intent": result["intent"]
    })

# =========================
# CONTACT FORM
# =========================

@api_view(['POST'])
def contact(request):
    try:
        name = request.data.get("name", "").strip()
        email = request.data.get("email", "").strip()
        message = request.data.get("message", "").strip()

        if not name:
            return Response({"error": "Name is required"}, status=400)
        if not email:
            return Response({"error": "Email is required"}, status=400)
        if not message:
            return Response({"error": "Message is required"}, status=400)

        send_contact_email(name, email, message)
        return Response({"success": "Message sent successfully"})

    except Exception as e:
        print(e)
        return Response({"error": "Failed to send message"}, status=500)


# =========================
# VISITOR TRACKING
# =========================

@api_view(['POST'])
def track_visitor(request):
    ip = request.META.get('REMOTE_ADDR')
    Visitor.objects.create(ip_address=ip)
    return Response({"tracked": True})


# =========================
# RESUME DOWNLOAD TRACKING
# =========================

@api_view(['POST'])
def resume_download(request):
    ResumeDownload.objects.create()
    return Response({"downloaded": True})


# =========================
# ANALYTICS DASHBOARD
# =========================

@api_view(['GET'])
def analytics(request):
    try:
        total_projects = Project.objects.count()
        total_visitors = Visitor.objects.count()
        total_resume_downloads = ResumeDownload.objects.count()
        total_chat_sessions = ChatSession.objects.count()
        total_chat_messages = ChatMessage.objects.count()

        latest_visitors = Visitor.objects.order_by('-visited_at')[:5]
        visitor_serializer = VisitorSerializer(latest_visitors, many=True)

        return Response({
            "total_projects": total_projects,
            "total_visitors": total_visitors,
            "total_resume_downloads": total_resume_downloads,
            "total_chat_sessions": total_chat_sessions,
            "total_chat_messages": total_chat_messages,
            "latest_visitors": visitor_serializer.data,
        })
    except Exception as e:
        import traceback
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        return Response({
            "error": str(e),
            "traceback": traceback.format_exc()
        }, status=500)

# =========================
# SAMURAI TEXT TO SPEECH (TTS) - NEURAL MALE VOICES
# =========================
import io
import re
import asyncio
from django.http import HttpResponse

SAMURAI_PERSONAS = {
    'ghost': {
        'voice': 'ja-JP-KeitaNeural',
        'pitch': '-12Hz',
        'rate': '-8%',
    },
    'shimura': {
        'voice': 'en-US-ChristopherNeural',
        'pitch': '-22Hz',
        'rate': '-14%',
    },
    'ronin': {
        'voice': 'en-GB-RyanNeural',
        'pitch': '-15Hz',
        'rate': '-6%',
    },
}

async def generate_edge_audio(text, persona='ghost'):
    import edge_tts
    cfg = SAMURAI_PERSONAS.get(persona, SAMURAI_PERSONAS['ghost'])
    communicate = edge_tts.Communicate(
        text=text,
        voice=cfg['voice'],
        pitch=cfg['pitch'],
        rate=cfg['rate'],
    )
    buf = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk['type'] == 'audio':
            buf.write(chunk['data'])
    buf.seek(0)
    return buf.read()

@api_view(['GET', 'POST'])
def tts_voice(request):
    text = request.data.get("text") if request.method == 'POST' else request.GET.get("text", "")
    persona = request.data.get("persona") if request.method == 'POST' else request.GET.get("persona", "ghost")
    
    if not text:
        text = "I am the spirit of the blade. Standing ready on the fields of Tsushima."
    clean_text = re.sub(r'[*_#`\[\]()<>]', '', text).strip()
    if not clean_text:
        clean_text = "I am listening."
    if len(clean_text) > 400:
        clean_text = clean_text[:400] + "..."

    # 1. Generate via Microsoft Neural Edge-TTS
    try:
        audio_bytes = asyncio.run(generate_edge_audio(clean_text, persona))
        if audio_bytes and len(audio_bytes) > 500:
            return HttpResponse(audio_bytes, content_type="audio/mpeg")
    except Exception as e:
        print(f"Edge-TTS failed: {e}, falling back to gTTS")

    # 2. Fallback via gTTS Japanese English
    try:
        from gtts import gTTS
        tts = gTTS(text=clean_text, lang='en', tld='co.jp')
        buf = io.BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)
        return HttpResponse(buf.read(), content_type="audio/mpeg")
    except Exception as e2:
        return HttpResponse(f"Error: {e2}", status=500)
