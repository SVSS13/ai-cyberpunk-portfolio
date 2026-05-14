from django.contrib import admin

from .models import *


# =========================
# PROJECT ADMIN
# =========================

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):

    list_display = (

        'title',

        'category',

        'tech',

        'created_at',

    )

    search_fields = (

        'title',

        'tech',

        'category',

    )

    list_filter = (

        'category',

        'created_at',

    )


# =========================
# VISITOR ADMIN
# =========================

@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):

    list_display = (

        'ip_address',

        'visited_at',

    )

    search_fields = (

        'ip_address',

    )

    list_filter = (

        'visited_at',

    )


# =========================
# RESUME DOWNLOAD ADMIN
# =========================

@admin.register(ResumeDownload)
class ResumeDownloadAdmin(admin.ModelAdmin):

    list_display = (

        'downloaded_at',

    )

    list_filter = (

        'downloaded_at',

    )


# =========================
# CHAT SESSION ADMIN
# =========================

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):

    list_display = (

        'session_id',

        'created_at',

    )

    search_fields = (

        'session_id',

    )

    list_filter = (

        'created_at',

    )


# =========================
# CHAT MESSAGE ADMIN
# =========================

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):

    list_display = (

        'session',

        'role',

        'created_at',

    )

    search_fields = (

        'role',

        'content',

    )

    list_filter = (

        'role',

        'created_at',

    )