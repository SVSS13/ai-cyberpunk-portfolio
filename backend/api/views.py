from rest_framework.decorators import api_view

from rest_framework.response import Response

from .models import *

from .serializers import *

from .github import get_github_repos

from .ai_engine import generate_ai_response

from .email_utils import send_contact_email


# =========================
# HOME
# =========================

@api_view(['GET'])
def home(request):

    return Response({
        "message": "Backend Running"
    })


# =========================
# PROJECTS
# =========================

@api_view(['GET'])
def projects(request):

    data = (
        Project.objects
        .all()
        .order_by('-created_at')
    )

    serializer = ProjectSerializer(
        data,
        many=True
    )

    return Response(serializer.data)


# =========================
# GITHUB
# =========================

@api_view(['GET'])
def github_repos(request):

    repos = get_github_repos(
        "SVSS13"
    )

    return Response(repos)


# =========================
# AI CHATBOT
# =========================

@api_view(['POST'])
def chatbot(request):

    message = request.data.get(
        "message"
    )

    session_id = request.META.get(
        "REMOTE_ADDR",
        "default"
    )

    reply = generate_ai_response(
        message,
        session_id
    )

    return Response({
        "reply": reply
    })


# =========================
# CONTACT FORM
# =========================

@api_view(['POST'])
def contact(request):

    try:

        name = request.data.get(
            "name",
            ""
        ).strip()

        email = request.data.get(
            "email",
            ""
        ).strip()

        message = request.data.get(
            "message",
            ""
        ).strip()

        # =========================
        # VALIDATION
        # =========================

        if not name:

            return Response({
                "error":
                "Name is required"
            }, status=400)

        if not email:

            return Response({
                "error":
                "Email is required"
            }, status=400)

        if not message:

            return Response({
                "error":
                "Message is required"
            }, status=400)

        # =========================
        # SEND EMAIL
        # =========================

        send_contact_email(
            name,
            email,
            message
        )

        return Response({

            "success":
            "Message sent successfully"

        })

    except Exception as e:

        print(e)

        return Response({

            "error":
            "Failed to send message"

        }, status=500)


# =========================
# VISITOR TRACKING
# =========================

@api_view(['POST'])
def track_visitor(request):

    ip = request.META.get(
        'REMOTE_ADDR'
    )

    Visitor.objects.create(
        ip_address=ip
    )

    return Response({
        "tracked": True
    })


# =========================
# RESUME DOWNLOAD TRACKING
# =========================

@api_view(['POST'])
def resume_download(request):

    ResumeDownload.objects.create()

    return Response({
        "downloaded": True
    })


# =========================
# ANALYTICS DASHBOARD
# =========================

@api_view(['GET'])
def analytics(request):

    total_projects = (
        Project.objects.count()
    )

    total_visitors = (
        Visitor.objects.count()
    )

    total_resume_downloads = (
        ResumeDownload.objects.count()
    )

    total_chat_sessions = (
        ChatSession.objects.count()
    )

    total_chat_messages = (
        ChatMessage.objects.count()
    )

    latest_visitors = (
        Visitor.objects
        .order_by('-visited_at')[:5]
    )

    visitor_serializer = (
        VisitorSerializer(
            latest_visitors,
            many=True
        )
    )

    return Response({

        "total_projects":
            total_projects,

        "total_visitors":
            total_visitors,

        "total_resume_downloads":
            total_resume_downloads,

        "total_chat_sessions":
            total_chat_sessions,

        "total_chat_messages":
            total_chat_messages,

        "latest_visitors":
            visitor_serializer.data,

    })