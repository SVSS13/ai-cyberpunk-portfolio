"""
Portfolio API Views
===================
Production API endpoints for projects, GitHub integration, AI Spirit Guide,
OTP-authenticated contact gateway, visitor analytics, and Neural Samurai TTS.
"""

import io
import re
import asyncio
import logging
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Project, Visitor, ResumeDownload, ChatSession, ChatMessage
from .serializers import ProjectSerializer, VisitorSerializer
from .github import get_github_repos
from .ai_engine import generate_ai_response, initialize_agent, send_email_action
from .email_verifier import verify_email_address
from .email_utils import send_contact_email
from .otp_service import request_email_otp, verify_otp_and_forward_message

logger = logging.getLogger(__name__)

# Initialize AI agent on first import (server startup)
try:
    initialize_agent()
except Exception as init_err:
    logger.warning("AI Agent initialization warning: %s", init_err)


# =========================
# HEALTH / HOME
# =========================
@api_view(['GET'])
def home(request):
    """Health check and service status."""
    return Response({
        "message": "Backend Running",
        "status": "online",
        "service": "Sujal's Tsushima Portfolio API",
        "agent": "DSA-Optimized Agent v2.0"
    })


# =========================
# PROJECTS
# =========================
@api_view(['GET'])
def projects(request):
    """Retrieve all featured engineering projects."""
    data = Project.objects.all().order_by('-created_at')
    serializer = ProjectSerializer(data, many=True)
    return Response(serializer.data)


# =========================
# GITHUB INTEGRATION
# =========================
@api_view(['GET'])
def github_repos(request):
    """Fetch live public repositories for SVSS13."""
    repos = get_github_repos("SVSS13")
    return Response(repos)


# =========================
# AI CHATBOT (SPIRIT GUIDE)
# =========================
@api_view(['POST'])
def chatbot(request):
    """
    Handles visitor queries via multi-provider agentic AI with real-time web grounding.
    """
    message = request.data.get("message", "").strip()
    session_id = request.META.get("REMOTE_ADDR", "default")

    if not message:
        return Response({
            "reply": "Greetings, traveler. Ask me anything about Sujal's skills, battle experience, projects, or code repositories."
        })

    try:
        result = generate_ai_response(message, session_id)
    except Exception as err:
        logger.error("Chatbot generation error: %s", err)
        return Response({
            "reply": "I am Sujal's AI Spirit Guide. Feel free to explore his projects, review verified skills, or send a transmission via the contact form!",
            "confidence": 0.8,
            "sources": ["portfolio_static"],
            "tools_used": ["fallback"],
            "intent": "general"
        })

    # Check if visitor requested direct email contact with email provided
    msg_lower = message.lower()
    wants_contact = any(word in msg_lower for word in ["email", "send", "contact", "reach", "hire", "message"])
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', message)
    visitor_email = email_match.group(0) if email_match else None

    if wants_contact and visitor_email and visitor_email.lower() != "svss.officia13@gmail.com":
        try:
            email_result = send_email_action(visitor_email, message)
            if email_result.get("success"):
                result["answer"] += f"\n\n✅ {email_result['message']}"
                result.setdefault("tools_used", []).append("send_email")
            else:
                result["answer"] += "\n\n⚠️ Could not deliver transmission. You can reach Sujal directly at svss.officia13@gmail.com."
        except Exception as email_err:
            logger.error("Chatbot email action error: %s", email_err)

    return Response({
        "reply": result.get("answer", ""),
        "confidence": result.get("confidence", 0.95),
        "sources": result.get("sources", []),
        "tools_used": result.get("tools_used", []),
        "intent": result.get("intent", "general")
    })


# =========================
# CONTACT & OTP GATEWAY
# =========================
@api_view(['POST'])
def contact_send_otp(request):
    """
    Validates recipient email and dispatches a 6-digit Shinobi Jutsu OTP.
    """
    name = request.data.get("name", "").strip()
    email = request.data.get("email", "").strip()

    if not name:
        return Response({"error": "Name is required."}, status=400)
    if not email:
        return Response({"error": "Email address is required."}, status=400)

    success, msg = request_email_otp(name, email)
    if not success:
        return Response({"error": msg}, status=400)

    return Response({"success": True, "message": msg})


@api_view(['POST'])
def contact_verify_and_send(request):
    """
    Validates 6-digit OTP and delivers message to Sujal's primary terminal.
    """
    name = request.data.get("name", "").strip()
    email = request.data.get("email", "").strip()
    message = request.data.get("message", "").strip()
    otp = request.data.get("otp", "").strip()

    if not name:
        return Response({"error": "Name is required."}, status=400)
    if not email:
        return Response({"error": "Email address is required."}, status=400)
    if not message:
        return Response({"error": "Message is required."}, status=400)
    if not otp:
        return Response({"error": "6-digit verification code is required."}, status=400)

    success, msg = verify_otp_and_forward_message(name, email, message, otp)
    if not success:
        return Response({"error": msg}, status=400)

    return Response({"success": True, "verified": True, "message": msg})


@api_view(['POST'])
def contact(request):
    """Unified contact entry point (supports direct verification handshake or OTP delivery)."""
    name = request.data.get("name", "").strip()
    email = request.data.get("email", "").strip()
    message = request.data.get("message", "").strip()
    otp = request.data.get("otp", "").strip()

    if not name:
        return Response({"error": "Name is required."}, status=400)
    if not email:
        return Response({"error": "Email address is required."}, status=400)
    if not message and not otp:
        return Response({"error": "Message is required."}, status=400)

    # 1. OTP Verification Flow
    if otp:
        success, msg = verify_otp_and_forward_message(name, email, message, otp)
        if not success:
            return Response({"error": msg}, status=400)
        return Response({"success": True, "verified": True, "message": msg})

    # 2. Direct Transmission Flow (Fallback / Direct API)
    try:
        is_valid, err_msg, suggestion = verify_email_address(email)
        if not is_valid:
            return Response({"error": err_msg, "suggestion": suggestion}, status=400)

        send_contact_email(name, email, message)
        return Response({
            "success": "Message sent successfully! Thank you for reaching out.",
            "verified": True
        })
    except Exception as err:
        logger.error("Contact submission error: %s", err)
        return Response({"error": "Failed to deliver message."}, status=500)


# =========================
# VISITOR & RESUME METRICS
# =========================
@api_view(['POST'])
def track_visitor(request):
    """Track unique visitor telemetry."""
    ip = request.META.get('REMOTE_ADDR')
    Visitor.objects.create(ip_address=ip)
    return Response({"tracked": True})


@api_view(['POST'])
def resume_download(request):
    """Track verified resume PDF downloads."""
    ResumeDownload.objects.create()
    return Response({"downloaded": True})


@api_view(['GET'])
def analytics(request):
    """Portfolio engagement metrics and visitor summary."""
    try:
        latest_visitors = Visitor.objects.order_by('-visited_at')[:5]
        visitor_serializer = VisitorSerializer(latest_visitors, many=True)

        return Response({
            "total_projects": Project.objects.count(),
            "total_visitors": Visitor.objects.count(),
            "total_resume_downloads": ResumeDownload.objects.count(),
            "total_chat_sessions": ChatSession.objects.count(),
            "total_chat_messages": ChatMessage.objects.count(),
            "latest_visitors": visitor_serializer.data,
        })
    except Exception as err:
        logger.error("Analytics retrieval error: %s", err)
        return Response({"error": "Failed to load analytics."}, status=500)


# =========================
# SAMURAI TEXT-TO-SPEECH (TTS)
# =========================
SAMURAI_PERSONAS = {
    'ronin': {
        'voice': 'en-GB-RyanNeural',
        'pitch': '-15Hz',
        'rate': '-6%',
    },
}


async def _generate_edge_audio(text: str, persona: str = 'ronin') -> bytes:
    """Generate audio via Microsoft Neural Edge-TTS."""
    import edge_tts
    cfg = SAMURAI_PERSONAS.get(persona, SAMURAI_PERSONAS['ronin'])
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
    """Neural text-to-speech audio stream for Samurai Spirit Guide."""
    text = request.data.get("text") if request.method == 'POST' else request.GET.get("text", "")
    persona = request.data.get("persona") if request.method == 'POST' else request.GET.get("persona", "ronin")

    if not text:
        text = "I am the spirit of the blade. Standing ready on the fields of Tsushima."

    clean_text = re.sub(r'[*_#`\[\]()<>]', '', text).strip()
    if not clean_text:
        clean_text = "I am listening."
    if len(clean_text) > 400:
        clean_text = clean_text[:400] + "..."

    # 1. Primary: Microsoft Neural Edge-TTS
    try:
        audio_bytes = asyncio.run(_generate_edge_audio(clean_text, persona))
        if audio_bytes and len(audio_bytes) > 500:
            return HttpResponse(audio_bytes, content_type="audio/mpeg")
    except Exception as edge_err:
        logger.warning("Edge-TTS fallback engaged: %s", edge_err)

    # 2. Fallback: Google TTS
    try:
        from gtts import gTTS
        tts = gTTS(text=clean_text, lang='en', tld='co.jp')
        buf = io.BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)
        return HttpResponse(buf.read(), content_type="audio/mpeg")
    except Exception as gtts_err:
        logger.error("TTS voice generation error: %s", gtts_err)
        return HttpResponse("Audio generation error", status=500)
