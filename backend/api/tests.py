from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from .models import Project, Visitor, ResumeDownload, ChatSession, ChatMessage


class ApiEndpointsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create sample project
        self.project = Project.objects.create(
            title="Cyberpunk Portfolio",
            description="Personal AI-driven portfolio",
            tech="React, Django, Tailwind",
            github="https://github.com/SVSS13/ai-cyberpunk-portfolio",
            demo="https://svs-sujal-portfolio.vercel.app",
            category="Fullstack",
        )

    def test_home_endpoint(self):
        """Verify GET /api/ returns 200 and expected status keys."""
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertIn("agent", response.data)

    def test_projects_endpoint(self):
        """Verify GET /api/projects/ returns list of projects."""
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Cyberpunk Portfolio")

    @patch('api.views.get_github_repos')
    def test_github_endpoint(self, mock_repos):
        """Verify GET /api/github/ returns repository list."""
        mock_repos.return_value = [
            {"name": "test-repo", "stars": 5, "forks": 1, "language": "Python"}
        ]
        response = self.client.get('/api/github/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)

    @patch('api.views.generate_ai_response')
    def test_chatbot_endpoint(self, mock_ai):
        """Verify POST /api/chatbot/ returns AI response."""
        mock_ai.return_value = {
            "answer": "Hello! I am Sujal's AI assistant.",
            "confidence": 0.95,
            "sources": ["portfolio"],
            "tools_used": ["dsa_search"],
            "intent": "greeting"
        }
        response = self.client.post('/api/chatbot/', {"message": "Hello"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("reply", response.data)
        self.assertEqual(response.data["reply"], "Hello! I am Sujal's AI assistant.")

    @patch('api.views.send_contact_email')
    def test_contact_endpoint_success(self, mock_send):
        """Verify POST /api/contact/ with valid payload."""
        payload = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "message": "Interested in collaborating!"
        }
        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("success", response.data)
        mock_send.assert_called_once_with("Jane Doe", "jane@example.com", "Interested in collaborating!")

    def test_contact_endpoint_validation_error(self):
        """Verify POST /api/contact/ returns 400 when required fields are missing."""
        response = self.client.post('/api/contact/', {"name": "Incomplete"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_track_visitor_endpoint(self):
        """Verify POST /api/track/ creates a Visitor entry."""
        initial_count = Visitor.objects.count()
        response = self.client.post('/api/track/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("tracked"), True)
        self.assertEqual(Visitor.objects.count(), initial_count + 1)

    def test_resume_download_endpoint(self):
        """Verify POST /api/resume-download/ tracks download event."""
        initial_count = ResumeDownload.objects.count()
        response = self.client.post('/api/resume-download/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("downloaded"), True)
        self.assertEqual(ResumeDownload.objects.count(), initial_count + 1)

    def test_analytics_endpoint(self):
        """Verify GET /api/analytics/ returns metrics aggregates."""
        response = self.client.get('/api/analytics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_projects", response.data)
        self.assertIn("total_visitors", response.data)
        self.assertIn("total_resume_downloads", response.data)
        self.assertIn("total_chat_sessions", response.data)
        self.assertIn("total_chat_messages", response.data)
        self.assertIn("latest_visitors", response.data)

    def test_admin_login_endpoint(self):
        """Verify GET /admin/login/ returns 200."""
        response = self.client.get('/admin/login/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
