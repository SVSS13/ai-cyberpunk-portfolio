from django.db import models


class Project(models.Model):

    title = models.CharField(max_length=200)

    description = models.TextField()

    tech = models.CharField(max_length=200)

    github = models.URLField()

    demo = models.URLField(blank=True)

    image = models.ImageField(
        upload_to='projects/'
    )

    category = models.CharField(max_length=100)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.title


class Visitor(models.Model):

    ip_address = models.CharField(
        max_length=100
    )

    visited_at = models.DateTimeField(
        auto_now_add=True
    )


class ResumeDownload(models.Model):

    downloaded_at = models.DateTimeField(
        auto_now_add=True
    )


# =========================
# AI CHAT MEMORY
# =========================

class ChatSession(models.Model):

    session_id = models.CharField(
        max_length=255,
        unique=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.session_id


class ChatMessage(models.Model):

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    role = models.CharField(
        max_length=20
    )

    content = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"{self.role} - {self.created_at}"