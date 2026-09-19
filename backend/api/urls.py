from django.urls import path
from .views import *

urlpatterns = [
    path('', home),
    path('projects/', projects),
    path('github/', github_repos),
    path('chatbot/', chatbot),
    path('contact/', contact),
    path('contact/send-otp/', contact_send_otp),
    path('contact/verify-and-send/', contact_verify_and_send),
    path('track/', track_visitor),
    path('resume-download/', resume_download),
    path('analytics/', analytics),
    path('tts/', tts_voice),
]
