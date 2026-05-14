from rest_framework import serializers

from .models import *


# =========================
# PROJECT SERIALIZER
# =========================

class ProjectSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Project

        fields = "__all__"


# =========================
# VISITOR SERIALIZER
# =========================

class VisitorSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Visitor

        fields = "__all__"


# =========================
# RESUME SERIALIZER
# =========================

class ResumeDownloadSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = ResumeDownload

        fields = "__all__"


# =========================
# CHAT SESSION SERIALIZER
# =========================

class ChatSessionSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = ChatSession

        fields = "__all__"


# =========================
# CHAT MESSAGE SERIALIZER
# =========================

class ChatMessageSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = ChatMessage

        fields = "__all__"