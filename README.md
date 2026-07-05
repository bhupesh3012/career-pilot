<div align="center">

<br/>

<img src="https://img.shields.io/badge/CareerPilot-AI%20Career%20Advisor-2563eb?style=for-the-badge&logo=sparkles&logoColor=white" alt="CareerPilot" height="40"/>

<br/><br/>

# 🚀 CareerPilot

### *Your AI-powered strategic career co-pilot*

<p align="center">
  CareerPilot is a full-stack AI career intelligence platform that helps engineers and tech professionals plan their trajectory, optimize their resumes, ace interviews, and land their next role — all from a single sleek workspace.
</p>

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)

<br/>

---

</div>

## ✨ Feature Overview

<table>
<tr>
<td width="50%">

### 🗺️ AI Career Pathfinder
Generate a personalized, milestone-by-milestone career trajectory from your current role to your target executive position. Powered by Gemini AI, it maps skill gaps, certifications, timelines, and compensation benchmarks at each stage.

</td>
<td width="50%">

### 🤖 AI Co-Pilot Chat
A real-time AI advisor tuned for career strategy. Ask about compensation negotiation, technical certifications, role deliverables, or interview tactics — with full context of your current → target role transition.

</td>
</tr>
<tr>
<td width="50%">

### 📄 Resume Optimizer
Upload your PDF resume and get an AI-powered ATS audit in seconds. Receive keyword gap analysis, a rewritten summary, bullet-point rewrites, and a matching cover letter — all tailored to your target role.

</td>
<td width="50%">

### 🎯 Interview Simulator
Practice role-specific MCQ interview rounds with AI-generated questions calibrated to your experience level. Get instant explanations for every answer and track your score across sessions.

</td>
</tr>
<tr>
<td width="50%">

### 💼 Placements Matrix
Browse curated internship and placement opportunities with smart skill-matching scores calculated against your profile. Filter by role, mode (Remote / Hybrid / On-site), and stipend range.

</td>
<td width="50%">

### 📊 Workspace Dashboard
A command-center overview of your profile completion, ATS score, active applications, identified skill gaps, and a live career trajectory graph — all derived from your uploaded resume and session data.

</td>
</tr>
</table>

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, Vite 6 |
| **Styling** | Tailwind CSS v4, Motion (Framer) |
| **Backend** | Node.js, Express 4, TypeScript |
| **AI Engine** | Google Gemini API (`@google/genai`) |
| **Icons** | Lucide React |
| **Build** | esbuild, TSX |

---

## 📁 Project Structure

```
careerpilot/
├── src/
│   ├── components/
│   │   ├── Auth.tsx               # Login & Sign-up screen
│   │   ├── Dashboard.tsx          # Workspace overview hub
│   │   ├── CareerPathGenerator.tsx # AI Pathfinder module
│   │   ├── CoPilotChat.tsx        # AI chat advisor
│   │   ├── ResumeOptimizer.tsx    # Resume upload & ATS audit
│   │   ├── InterviewPrep.tsx      # MCQ interview simulator
│   │   ├── InternshipsPage.tsx    # Placements matrix
│   │   ├── CoverLetterTailor.tsx  # Cover letter generator
│   │   ├── LearningRoadmap.tsx    # Milestone roadmap view
│   │   └── Sidebar.tsx            # Navigation strip
│   ├── context/
│   │   └── ProfileContext.tsx     # Global user profile state
│   ├── services/
│   │   ├── copilotService.ts      # Gemini chat API calls
│   │   ├── interviewService.ts    # MCQ generation via Gemini
│   │   ├── pathfinderService.ts   # Career path generation
│   │   └── resumeAnalysisService.ts # Resume parsing & audit
│   ├── utils/
│   │   └── matchingAlgorithm.ts   # Internship skill-match scoring
│   ├── types.ts                   # Shared TypeScript types
│   ├── App.tsx                    # Root layout & routing
│   └── main.tsx                   # Entry point
├── server.ts                      # Express dev/prod server
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API key** — get one free at [aistudio.google.com](https://aistudio.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/bhupesh3012/career-pilot.git
cd career-pilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
# Copy the example env file
cp .env.example .env.local
```

Open `.env.local` and set your key:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

### 4. Start the development server

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build frontend + bundle server for production |
| `npm run start` | Run the production build |
| `npm run lint` | TypeScript type-check (no emit) |

---

## 🌐 Deployment

The project is designed for **Google Cloud Run** deployment via AI Studio, but can be deployed on any Node.js-compatible host (Railway, Render, Fly.io, etc.).

```bash
npm run build
npm run start
```

The Express server in `server.ts` serves both the Vite-built frontend and the API routes from a single process.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for all AI features |
| `APP_URL` | ⚠️ Optional | Hosting URL — used for self-referential links |

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change, then submit a PR against `master`.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ using **React**, **Gemini AI**, and **TypeScript**

⭐ Star this repo if you find it useful!

</div>
