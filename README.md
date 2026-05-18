# svsfolio — AI Cyberpunk Portfolio

A cyberpunk-themed personal portfolio with an AI-powered chat assistant, live GitHub stats, and smooth 3D animations — built with React + Django.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations & transitions |
| Three.js + React Three Fiber | 3D visuals |
| tsParticles | Background particle effects |
| React GitHub Calendar | Live GitHub contribution graph |
| React Markdown | AI chat response rendering |
| Lenis | Smooth scrolling |
| Axios | API calls |

### Backend
| Technology | Purpose |
|---|---|
| Django 5.2 + Django REST Framework | API server |
| Groq API | AI chat assistant (LLM) |
| GitHub API | Live repository & stats fetching |
| Resend | Contact form email delivery |
| WhiteNoise | Static file serving |
| CORS Headers | Cross-origin request handling |

### Deployment
- **Frontend** — Vercel
- **Backend** — Render

---

## Features

- **AI Chat Assistant** — Powered by Groq LLM, answers questions about the portfolio
- **Live GitHub Stats** — Fetches real-time repos and contribution data via GitHub API
- **3D Animations** — Three.js scenes with React Three Fiber
- **Particle Background** — Interactive tsParticles effects
- **Contact Form** — Email delivery via Resend API
- **Cyberpunk UI** — Neon glow effects, glassmorphism, and smooth transitions
- **Responsive Design** — Mobile + desktop
- **PWA Ready** — Installable as Android APK

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Environment Variables

**Backend `.env`:**
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token
RESEND_API_KEY=your_resend_api_key
```

---

## Project Structure

```
Portfolio-main/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── assets/    # Images, logo
│   │   ├── components/
│   │   └── App.jsx
│   └── public/        # Favicon, manifest
├── backend/           # Django REST API
│   ├── api/           # API views & routes
│   └── portfolio_backend/
└── README.md
```

---

## Live Demo

🔗 [svs-sujal-portfolio.vercel.app](https://svs-sujal-portfolio.vercel.app)

---

## Author

**SVS Sujal** — [GitHub](https://github.com/SVSS13) · [LinkedIn](https://www.linkedin.com/in/svss13)
