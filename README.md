# AI Cloud Architect — IaC Generator

> Turn plain English into production-ready Infrastructure-as-Code, powered by Gemini AI.

**Built by [Pixel Bug](https://github.com/adityavani07/iac-generator)** 🐛

Describe your cloud infrastructure in natural language, pick your provider (AWS / GCP / Azure) and tool (Terraform / CloudFormation), and get secure, best-practice code generated instantly.

---

## Tech Stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Frontend | React 19 (Vite), Tailwind CSS v4, Lucide           |
| Backend  | Node.js (ES Modules), Express 5                    |
| AI       | Google Gemini 3.1 Flash Lite (`@google/genai`)      |
| Deploy   | Vercel (frontend) · Render (backend)                |

## Quick Start

### Prerequisites
- Node.js ≥ 18
- A [Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone & Install

```bash
git clone https://github.com/adityavani07/iac-generator.git
cd iac-generator

# Backend
cd backend
npm install
cp .env.example .env        # ← paste your GEMINI_API_KEY
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 2. Run

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 3001)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
iac-generator/
├── backend/
│   ├── .env.example       # Environment template (GEMINI_API_KEY, CORS_ORIGIN)
│   ├── package.json       # Dependencies & scripts
│   └── server.js          # Express API + Gemini integration
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── index.css      # Tailwind v4 theme + animations
│   │   └── main.jsx       # React DOM entry point
│   ├── index.html         # HTML entry with Google Fonts + SEO meta
│   ├── package.json       # Dependencies & scripts
│   └── vite.config.js     # Vite + React + Tailwind plugins
├── .gitignore             # Ignores node_modules, .env, dist
├── install.cmd            # Windows one-click setup script
├── render.yaml            # Render deployment blueprint
└── README.md
```

## Deployment

| Service  | Platform | Root Directory | URL |
| -------- | -------- | -------------- | --- |
| Backend  | Render   | `backend`      | `https://iac-generator-api-XXXX.onrender.com` |
| Frontend | Vercel   | `frontend`     | `https://iac-generator-XXXX.vercel.app` |

### Environment Variables

**Render (Backend):**

| Key | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `CORS_ORIGIN` | Your Vercel frontend URL (e.g. `https://iac-generator.vercel.app`) |
| `NODE_ENV` | `production` |

**Vercel (Frontend):**

| Key | Description |
|---|---|
| `VITE_API_URL` | Your Render backend URL (e.g. `https://iac-generator-api.onrender.com`) |

---

## Team — Pixel Bug 🐛

| Branch                         | Owner       | Purpose                        |
| ------------------------------ | ----------- | ------------------------------ |
| `main`                         | Team Lead   | Protected, merge via PR only   |
| `feature/frontend-styling`     | Teammate A  | UI/UX improvements             |
| `feature/backend-error-handling`| Teammate B | API hardening & error handling |

---

## License

MIT © Pixel Bug
