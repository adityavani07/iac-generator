# AI Cloud Architect — IaC Generator

> Turn plain English into production-ready Infrastructure-as-Code, powered by Gemini AI.

Describe your cloud infrastructure in natural language, pick your provider (AWS / GCP / Azure) and tool (Terraform / CloudFormation), and get secure, best-practice code generated instantly.

---

## Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | React 19 (Vite), Tailwind CSS v4, Lucide     |
| Backend  | Node.js (ES Modules), Express 5              |
| AI       | Google Gemini 2.5 Flash (`@google/genai`)    |

## Quick Start

### Prerequisites
- Node.js ≥ 18
- A [Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/iac-generator.git
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
│   ├── server.js          # Express API + Gemini integration
│   ├── .env.example       # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Tailwind + custom theme
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## Branch Strategy

| Branch                         | Owner       | Purpose                        |
| ------------------------------ | ----------- | ------------------------------ |
| `main`                         | Team Lead   | Protected, merge via PR only   |
| `feature/frontend-styling`     | Teammate A  | UI/UX improvements             |
| `feature/backend-error-handling`| Teammate B | API hardening & error handling |

---

## License

MIT
