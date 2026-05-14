from django.urls import path

from .views import *


urlpatterns = [

    path('', home),

    path('projects/', projects),

    path('github/', github_repos),

    path('chatbot/', chatbot),

    path('contact/', contact),

    path('track/', track_visitor),

    path('resume-download/', resume_download),

    path('analytics/', analytics),

]