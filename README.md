# 𝓼𝓿𝓼𝓯𝓸𝓵𝓲𝓸 — AI Cyberpunk Portfolio

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

### 🚀 Quick Start (Cross-Platform)

You can launch both the Django backend and Vite frontend together with a single command from the project root:

```bash
# Start both backend & frontend concurrently (traps Ctrl+C cleanly)
python run.py dev
# or using npm
npm run dev
```

To run initial setup (creates OS-specific venv, installs requirements, runs migrations & npm install):
```bash
python run.py setup
# or using npm
npm run setup
```

To verify the installation and build:
```bash
python run.py check
```

---

### 🐧 Linux / macOS Options

**Using Scripts:**
```bash
# 1. Setup backend & frontend
./scripts/backend_setup.sh
./scripts/frontend_setup.sh

# 2. Run both concurrently
./scripts/run_dev.sh
```

**Manual Commands:**
```bash
# Backend (in backend/)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (in frontend/)
npm install
npm run dev
```

---

### 🪟 Windows Options

**Using Scripts:**
```cmd
# 1. Setup backend & frontend
scripts\backend_setup.bat
scripts\frontend_setup.bat

# 2. Run both
scripts\run_dev.bat
```

**Manual Commands:**
```cmd
# Backend (in backend\)
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (in frontend\)
npm install
npm run dev
```

### Environment Variables

**Frontend `.env`:**
```env
VITE_API_URL=http://127.0.0.1:8000/api/        # local
# VITE_API_URL=https://your-backend.onrender.com/api/  # production
```

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
