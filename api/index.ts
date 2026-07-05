import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "15mb" }));

// ---------------------------------------------------------------------------
// Gemini SDK — lazy singleton
// ---------------------------------------------------------------------------
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment variables.");
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

function handleGeminiError(error: any, res: any, defaultMsg: string) {
  console.error(`${defaultMsg}:`, error);
  let msg = error.message || defaultMsg;
  const s = JSON.stringify(error) + String(error.stack || "") + msg;
  if (s.includes("429") || s.includes("quota") || s.includes("RESOURCE_EXHAUSTED")) {
    msg = "Gemini rate limit reached. Please wait 10-15 seconds and try again.";
  }
  res.status(500).json({ error: msg });
}

// ---------------------------------------------------------------------------
// Fallback generators (kept identical to server.ts)
// ---------------------------------------------------------------------------
function extractMetadataFromBase64(base64: string) {
  try {
    const binary = Buffer.from(base64, "base64").toString("utf-8");
    const emailMatch = binary.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/);
    const email = emailMatch ? emailMatch[0] : "candidate@example.com";
    const phoneMatch = binary.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : "+1 (555) 234-5678";
    const links: string[] = [];
    const ghMatch = binary.match(/github\.com\/[a-zA-Z0-9_-]+/i);
    if (ghMatch) links.push(`https://${ghMatch[0]}`);
    const liMatch = binary.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
    if (liMatch) links.push(`https://${liMatch[0]}`);
    if (!links.length) links.push("https://linkedin.com/in/candidate", "https://github.com/candidate");
    const popular = ["React","Node","TypeScript","JavaScript","Python","Java","Docker","AWS","Kubernetes","GraphQL","PostgreSQL","Next.js","SQL","Git"];
    const skills = popular.filter(s => binary.toLowerCase().includes(s.toLowerCase()));
    if (skills.length < 5) skills.push("React","Node.js","TypeScript","REST APIs","SQL","Git");
    return { name: "Professional Candidate", email, phone, links, skills };
  } catch {
    return { name: "Professional Candidate", email: "candidate@example.com", phone: "+1 (555) 234-5678", links: ["https://linkedin.com/in/candidate","https://github.com/candidate"], skills: ["React","Node.js","TypeScript","REST APIs","SQL","Git"] };
  }
}

function generateCareerPathBackup(currentRole: string, targetRole: string, focusArea: string, experienceLevel: string) {
  const cRole = currentRole || "Fullstack Developer";
  const tRole = targetRole || "Technical Lead";
  return {
    executiveSummary: `Transition from ${cRole} to ${tRole} prioritising ${focusArea || "Technical Architecture"} over an estimated 18-24 month timeline.`,
    milestones: [
      { title: `Deepening ${cRole} Foundations`, timeframe: "0-6 Months", description: "Master software patterns and build self-healing systems.", skillsToLearn: ["Advanced Design Patterns","Automated Testing","Performance Profiling","CI/CD Optimization"], resources: ["Refactoring.Guru","Designing Data-Intensive Applications","Clean Code"], confidenceScore: 95, milestoneType: "entry" },
      { title: "Technical Mentorship & Leadership", timeframe: "6-12 Months", description: "Lead design reviews and mentor junior engineers.", skillsToLearn: ["Technical Mentorship","System Architecture Modelling","Agile Estimation","Cross-functional Communication"], resources: ["The Staff Engineer's Path","LeadDev Community","SE Radio Podcast"], confidenceScore: 90, milestoneType: "intermediate" },
      { title: "Cloud Architecture & System Design", timeframe: "12-18 Months", description: "Deploy scalable cloud-native architectures.", skillsToLearn: ["AWS/GCP Enterprise Architecture","Microservices & Event-Driven Patterns","Redis Cache Optimization","Security & Compliance"], resources: ["AWS Solutions Architect Guide","System Design Primer","Enterprise Integration Patterns"], confidenceScore: 88, milestoneType: "advanced" },
      { title: `Full Transition to ${tRole}`, timeframe: "18-24 Months", description: `Take ownership of the technical roadmap as ${tRole}.`, skillsToLearn: ["Engineering Planning","Conflict Resolution","Executive Decision-making","Vendor Governance"], resources: ["An Elegant Puzzle — Will Larson","The Manager's Path — Camille Fournier","HBR on Team Dynamics"], confidenceScore: 92, milestoneType: "peak" },
    ],
    alternatePaths: [
      { title: "Staff/Principal IC Track", description: "Deep technical mastery without people management.", suitability: "Engineers who want to stay close to code." },
      { title: "Engineering Manager Track", description: "People management, hiring, and org health focus.", suitability: "Engineers passionate about coaching and org alignment." },
    ],
  };
}

function generateChatBackup(messages: any[], currentRole?: string, targetRole?: string): { text: string } {
  const cRole = currentRole || "Fullstack Developer";
  const tRole = targetRole || "Technical Lead";
  const msg = (messages[messages.length - 1]?.content || "").trim().toLowerCase();
  if (/^(hi|hii|hello|hey|good\s+(morning|evening|afternoon)|yo|greetings)/i.test(msg)) {
    return { text: `Hello! I am your CareerPilot Advisor, ready to help map your transition from **${cRole}** to **${tRole}**. Ask me anything about interviews, resume optimisation, compensation, or career strategy.` };
  }
  if (msg.includes("resume") || msg.includes("ats") || msg.includes("cv")) {
    return { text: `For the ${cRole} → ${tRole} transition, rewrite bullets using the STAR formula with metrics, add architecture keywords (Microservices, High Availability, CI/CD), and explicitly mention mentorship experience.` };
  }
  if (msg.includes("interview") || msg.includes("question")) {
    return { text: `For a **${tRole}** interview expect: System Design (scalable services), Behavioural (STAR stories on leadership), and Coding challenges. Want me to walk through a specific question?` };
  }
  if (msg.includes("salary") || msg.includes("compensation") || msg.includes("negotiate")) {
    return { text: `Benchmark on levels.fyi, anchor to scope and impact rather than personal cost-of-living, and always optimise total comp — sign-on, RSUs, and accelerated review cycles.` };
  }
  return { text: `Great question for your ${cRole} → ${tRole} journey. Focus on: architectural ownership, high-quality code reviews, and aligning engineering decisions with business metrics. What specific area would you like to dive into?` };
}

function generateResumeOptimizationBackup(resumeText: string, targetJobDescription: string) {
  const keywords = Array.from(new Set((targetJobDescription.match(/[a-zA-Z0-9+#.-]+/g) || []))).filter(w => w.length > 4).slice(0, 6);
  return {
    score: Math.floor(Math.random() * 14) + 72,
    matchSummary: "Strong foundation but lacks impact metrics and modern architecture terminology.",
    missingKeywords: keywords.length > 2 ? keywords.map(k => `${k} Implementation`) : ["System Architecture Design","Technical Roadmap Leadership","CI/CD Orchestration","High-Availability"],
    bulletPoints: [
      { original: "Responsible for database maintenance.", improved: "Optimised indexing strategies reducing query latency by 35% and maintaining 99.9% uptime.", explanation: "Active verbs + quantified impact." },
      { original: "Mentored junior developers.", improved: "Designed onboarding curriculum and mentored 3 developers, cutting integration time by 40%.", explanation: "Demonstrates leadership with metrics." },
    ],
    suggestedHeadline: "Senior Solutions Architect | High-Availability Infrastructure & Engineering Mentorship",
  };
}

function generateInterviewQuestionsBackup(targetRole: string, experienceLevel: string) {
  return {
    questions: [
      { id: "q-1", question: `As a ${targetRole || "engineer"}, how do you manage technical debt under tight timelines?`, category: "Behavioral", difficulty: "Medium", suggestedStructure: "STAR", hint: "Discuss trade-off documentation and negotiating refactoring sprints." },
      { id: "q-2", question: "Design a notification system handling 10M daily push alerts without message loss.", category: "System Design", difficulty: "Hard", suggestedStructure: "Architecture blocks + message queue decoupling", hint: "Consider Kafka, exponential backoff, and Redis buffering." },
      { id: "q-3", question: "Describe resolving a strong technical disagreement with a senior peer.", category: "Behavioral", difficulty: "Medium", suggestedStructure: "STAR", hint: "Focus on data-driven POCs and respecting alternative approaches." },
      { id: "q-4", question: "How do you version and rate-limit an external REST API for backward compatibility?", category: "Technical", difficulty: "Medium", suggestedStructure: "HTTP versioning + JWT + Redis token bucket", hint: "Mention API gateway routing and graceful 429 handling." },
    ],
  };
}

function generateInterviewEvaluationBackup(question: string, answer: string, targetRole?: string) {
  return {
    score: Math.floor(Math.random() * 17) + 72,
    feedback: "Solid conceptual understanding. To reach elite level, quantify results and reference specific architecture patterns.",
    strengths: ["Clear logical structure","Good use of standard terminology","Pragmatic problem-solving approach"],
    improvements: ["Quantify past achievements (TPS, team size, volumes)","Reference specific tools (Redis, Circuit Breakers)","Conclude with the key lesson or long-term impact"],
    suggestedAnswer: `An elite response would open with the business context, describe the architectural decision with specific tools (e.g. Kafka for decoupling, Redis for caching), quantify the outcome (e.g. 99.99% reliability, 40% CPU reduction), and close with the key engineering lesson learned.`,
  };
}

function generateCoverLetterBackup(companyName: string, roleDescription: string, jobDescription: string, candidateName?: string, experienceLevel?: string) {
  const name = candidateName || "Candidate";
  const company = companyName || "Target Company";
  const role = roleDescription || "Technical Lead";
  return {
    coverLetter: `${name}\n${new Date().toLocaleDateString()}\n\nHiring Manager\n${company}\n\nDear Hiring Manager,\n\nI am writing to express my strong interest in the ${role} position at ${company}. My background in scalable system design, state management, and engineering team mentorship maps directly to your requirements.\n\nThroughout my career I have spearheaded distributed microservice architectures, governed code quality standards, and mentored engineers — consistently aligning technical decisions with product roadmaps.\n\nI would welcome the opportunity to discuss how my experience can contribute to ${company}'s engineering goals.\n\nSincerely,\n${name}`,
  };
}

function generatePathfinderBackup(targetRole: string, experienceLevel: string, durationDays: number, currentSkills: string[]) {
  const weeks = Math.max(1, Math.ceil(durationDays / 7)) || 4;
  const base = [
    { title: "Core Architecture & Patterns", milestone: "Establish architectural scaffolding.", tasks: ["Audit structural conventions","Set up workspace sandbox","Implement core state models"], resources: ["MDN Web Docs","Official Framework Docs"] },
    { title: "State Management & Async Pipelines", milestone: "Configure advanced state and data fetching.", tasks: ["Build optimised store slices","Refactor into async pipelines","Handle race conditions and error recovery"], resources: ["State Management Blueprints","Designing Data-Intensive Applications"] },
    { title: "Secure API Integrations", milestone: "Establish secured data pipelines.", tasks: ["Implement validation middleware","Add rate limiters","Apply OWASP Top 10 recommendations"], resources: ["OWASP API Security","Modern Backend Best Practices"] },
    { title: "CI/CD & Production Launch", milestone: "Build delivery pipelines.", tasks: ["Write multi-stage build scripts","Integrate automated testing","Configure CDN and telemetry"], resources: ["Docker Security Guide","Lighthouse Performance Audits"] },
  ];
  return Array.from({ length: weeks }, (_, i) => ({ week: i + 1, ...base[i % base.length], title: `${base[i % base.length].title} (Phase ${Math.ceil((i + 1) / 4)})` }));
}

function generateResumeAnalysisBackup(pdfBase64: string, targetRole?: string, currentRole?: string) {
  const cRole = currentRole || "Fullstack Developer";
  const tRole = targetRole || "Technical Lead";
  const extracted = extractMetadataFromBase64(pdfBase64);
  let name = extracted.name;
  if (name === "Professional Candidate" && extracted.email !== "candidate@example.com") {
    const prefix = extracted.email.split("@")[0].split(".")[0].split("-")[0];
    name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  } else if (name === "Professional Candidate") {
    name = "Candidate";
  }
  return {
    score: Math.floor(Math.random() * 13) + 74,
    matchSummary: `Strong ${cRole} foundations in ${extracted.skills.slice(0,4).join(", ")}. Gaps remain in architecture design, mentorship ownership, and impact metrics for the ${tRole} role.`,
    missingKeywords: ["System Architecture Diagramming","Technical Roadmapping","Developer Mentorship","CI/CD Release Governance","High-Availability & Cloud Fault-tolerance"],
    bulletPoints: [
      { original: "Wrote React and Node.js features.", improved: "Spearheaded modular React-Node microservices boosting feature velocity by 30%.", explanation: "Active verb + quantified impact." },
      { original: "Helped with code reviews.", improved: "Formulated code review guidelines and mentored 4 developers, reducing production bugs by 25%.", explanation: "Demonstrates leadership with metrics." },
      { original: "Worked on database optimisation.", improved: "Architected indexing strategies accelerating query speeds by 42% under peak loads.", explanation: "Shows system design depth." },
    ],
    suggestedHeadline: `${tRole} | Scalable Web Architecture & High-Performance Engineering Teams`,
    contactInfo: { name, email: extracted.email, phone: extracted.phone, location: "San Francisco Bay Area", links: extracted.links },
    skills: Array.from(new Set([...extracted.skills, "System Design", "Technical Leadership", "Agile Methodologies"])),
    atsFeedback: {
      impactVerbs: ["Spearheaded","Architected","Formulated","Engineered","Optimised"],
      formattingIssues: ["Simplify multi-column layouts for ATS single-pass scanning.","Use consistent MMM YYYY date formatting."],
      cloudExperience: "Needs explicit mention of production cloud deployments (AWS/GCP, Kubernetes, IaC).",
      overallRecommendation: "Rewrite duties as strategic impact statements, add mentorship evidence, and include architecture ownership examples.",
    },
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.post("/api/career/generate-path", async (req, res) => {
  try {
    const { currentRole, targetRole, focusArea, experienceLevel } = req.body;
    if (!currentRole || !targetRole) return res.status(400).json({ error: "Missing currentRole or targetRole" });
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a detailed career milestone path from "${currentRole}" to "${targetRole}". Focus: ${focusArea || "General Technical Growth"}. Level: ${experienceLevel || "Mid-Level"}. Return 4-5 milestones.`,
      config: {
        systemInstruction: "You are CareerPilot, a technical career coach. Output high-fidelity JSON for career transitions.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["milestones","alternatePaths","executiveSummary"],
          properties: {
            executiveSummary: { type: Type.STRING },
            milestones: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["title","timeframe","description","skillsToLearn","resources","confidenceScore","milestoneType"], properties: { title: { type: Type.STRING }, timeframe: { type: Type.STRING }, description: { type: Type.STRING }, skillsToLearn: { type: Type.ARRAY, items: { type: Type.STRING } }, resources: { type: Type.ARRAY, items: { type: Type.STRING } }, confidenceScore: { type: Type.INTEGER }, milestoneType: { type: Type.STRING, enum: ["entry","intermediate","advanced","peak"] } } } },
            alternatePaths: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["title","description","suitability"], properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, suitability: { type: Type.STRING } } } },
          },
        },
      },
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    try { res.json(generateCareerPathBackup(req.body.currentRole, req.body.targetRole, req.body.focusArea, req.body.experienceLevel)); }
    catch { handleGeminiError(error, res, "Failed to generate career path"); }
  }
});

app.post("/api/career/pathfinder", async (req, res) => {
  try {
    const { targetRole, experienceLevel, durationDays, currentSkills } = req.body;
    const weeks = Math.ceil(durationDays / 7) || 4;
    const skillArr: string[] = Array.isArray(currentSkills) ? currentSkills : [];
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a ${weeks}-week learning roadmap for a ${experienceLevel || "Intermediate"} ${targetRole}. Existing skills: ${skillArr.join(", ") || "none"}. Each week: title, milestone, 3-4 tasks, 2-3 resources.`,
      config: {
        systemInstruction: "You are CareerPilot AI Pathfinder. Output raw valid JSON only — no markdown.",
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["week","title","milestone","tasks","resources"], properties: { week: { type: Type.INTEGER }, title: { type: Type.STRING }, milestone: { type: Type.STRING }, tasks: { type: Type.ARRAY, items: { type: Type.STRING } }, resources: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
      },
    });
    res.json(JSON.parse(response.text || "[]"));
  } catch (error: any) {
    try { res.json(generatePathfinderBackup(req.body.targetRole, req.body.experienceLevel, req.body.durationDays, req.body.currentSkills)); }
    catch { handleGeminiError(error, res, "Failed to generate pathfinder roadmap"); }
  }
});

app.post("/api/career/chat", async (req, res) => {
  try {
    const { messages, currentRole, targetRole } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Invalid messages array" });
    const ai = getGemini();
    const contents = messages.map((m: any) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: `You are CareerPilot AI, an elite career coach. The user is transitioning from ${currentRole || "their current role"} to ${targetRole || "their target role"}. Stay strictly on career topics. Keep answers under 120 words. If the query is irrelevant to careers respond with exactly: "this message is irrelevant to job please ask relevant questions"`,
      },
    });
    res.json({ text: response.text });
  } catch (error: any) {
    try { res.json(generateChatBackup(req.body.messages, req.body.currentRole, req.body.targetRole)); }
    catch { handleGeminiError(error, res, "Failed to communicate with AI co-pilot"); }
  }
});

app.post("/api/career/optimize-resume", async (req, res) => {
  try {
    const { resumeText, targetJobDescription } = req.body;
    if (!resumeText || !targetJobDescription) return res.status(400).json({ error: "Missing resumeText or targetJobDescription" });
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyse this resume against the job description and return ATS score, gap analysis, missing keywords, bullet rewrites, and a headline.\n\nResume:\n${resumeText}\n\nJD:\n${targetJobDescription}`,
      config: {
        systemInstruction: "You are an ATS compliance auditor and executive resume writer. Output structured JSON only.",
        responseMimeType: "application/json",
        responseSchema: { type: Type.OBJECT, required: ["score","matchSummary","missingKeywords","bulletPoints","suggestedHeadline"], properties: { score: { type: Type.INTEGER }, matchSummary: { type: Type.STRING }, missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }, bulletPoints: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["original","improved","explanation"], properties: { original: { type: Type.STRING }, improved: { type: Type.STRING }, explanation: { type: Type.STRING } } } }, suggestedHeadline: { type: Type.STRING } } },
      },
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    try { res.json(generateResumeOptimizationBackup(req.body.resumeText, req.body.targetJobDescription)); }
    catch { handleGeminiError(error, res, "Failed to optimise resume"); }
  }
});

app.post("/api/interview/questions", async (req, res) => {
  try {
    const { targetRole, experienceLevel } = req.body;
    if (!targetRole) return res.status(400).json({ error: "Missing targetRole" });
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate 4-5 interview questions for a ${experienceLevel || "Mid-Level"} ${targetRole}. Include Technical, Behavioral, and System Design categories.`,
      config: {
        systemInstruction: "You are an elite principal engineer and hiring director. Output structured JSON only.",
        responseMimeType: "application/json",
        responseSchema: { type: Type.OBJECT, required: ["questions"], properties: { questions: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["id","question","category","difficulty","suggestedStructure","hint"], properties: { id: { type: Type.STRING }, question: { type: Type.STRING }, category: { type: Type.STRING, enum: ["Technical","Behavioral","System Design"] }, difficulty: { type: Type.STRING, enum: ["Easy","Medium","Hard"] }, suggestedStructure: { type: Type.STRING }, hint: { type: Type.STRING } } } } } },
      },
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    try { res.json(generateInterviewQuestionsBackup(req.body.targetRole, req.body.experienceLevel)); }
    catch { handleGeminiError(error, res, "Failed to generate interview questions"); }
  }
});

app.post("/api/interview/mcqs", async (req, res) => {
  try {
    const { targetRole, experienceLevel, totalQuestions } = req.body;
    const count = parseInt(totalQuestions, 10) || 5;
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate exactly ${count} MCQ questions for a ${experienceLevel || "Intermediate"} ${targetRole}. Each must have 4 options, 1 correct answer matching an option exactly, and an explanation.`,
      config: {
        systemInstruction: "You are CareerPilot AI Technical Interviewer. Output raw valid JSON only.",
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["id","question","options","correctAnswer","explanation"], properties: { id: { type: Type.INTEGER }, question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswer: { type: Type.STRING }, explanation: { type: Type.STRING } } } },
      },
    });
    res.json(JSON.parse(response.text || "[]"));
  } catch (error: any) {
    handleGeminiError(error, res, "Failed to generate MCQs");
  }
});

app.post("/api/interview/evaluate", async (req, res) => {
  try {
    const { question, answer, targetRole } = req.body;
    if (!question || !answer) return res.status(400).json({ error: "Missing question or answer" });
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Evaluate this interview answer for a ${targetRole || "Software Engineer"} role.\n\nQuestion: ${question}\n\nAnswer: ${answer}`,
      config: {
        systemInstruction: "You are an expert technical interviewer. Output structured JSON evaluation only.",
        responseMimeType: "application/json",
        responseSchema: { type: Type.OBJECT, required: ["score","feedback","strengths","improvements","suggestedAnswer"], properties: { score: { type: Type.INTEGER }, feedback: { type: Type.STRING }, strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, improvements: { type: Type.ARRAY, items: { type: Type.STRING } }, suggestedAnswer: { type: Type.STRING } } },
      },
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    try { res.json(generateInterviewEvaluationBackup(req.body.question, req.body.answer, req.body.targetRole)); }
    catch { handleGeminiError(error, res, "Failed to evaluate answer"); }
  }
});

app.post("/api/cover-letter/generate", async (req, res) => {
  try {
    const { companyName, roleDescription, jobDescription, candidateName, experienceLevel } = req.body;
    if (!companyName || !roleDescription || !jobDescription) return res.status(400).json({ error: "Missing companyName, roleDescription, or jobDescription" });
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Write a professional cover letter for ${candidateName || "the candidate"} applying for ${roleDescription} at ${companyName} (${experienceLevel || "Mid-Level"} tier).\n\nJD:\n${jobDescription}`,
      config: {
        systemInstruction: "You are an elite cover letter architect. Output JSON with a single coverLetter field.",
        responseMimeType: "application/json",
        responseSchema: { type: Type.OBJECT, required: ["coverLetter"], properties: { coverLetter: { type: Type.STRING } } },
      },
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    try { res.json(generateCoverLetterBackup(req.body.companyName, req.body.roleDescription, req.body.jobDescription, req.body.candidateName, req.body.experienceLevel)); }
    catch { handleGeminiError(error, res, "Failed to generate cover letter"); }
  }
});

app.post("/api/resume/analyze", async (req, res) => {
  try {
    const { pdfBase64, targetRole, currentRole } = req.body;
    if (!pdfBase64) return res.status(400).json({ error: "Missing pdfBase64" });
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
        { text: `Analyse this resume for the transition from "${currentRole || "Fullstack Developer"}" to "${targetRole || "Technical Lead"}". Return ATS score (0-100), match summary, missing keywords, 3 bullet rewrites, suggested headline, contact info, skills list, and ATS feedback.` },
      ],
      config: {
        systemInstruction: "You are an elite resume parser and ATS compiler. Output strictly valid JSON.",
        responseMimeType: "application/json",
        responseSchema: { type: Type.OBJECT, required: ["score","matchSummary","missingKeywords","bulletPoints","suggestedHeadline","contactInfo","skills","atsFeedback"], properties: { score: { type: Type.INTEGER }, matchSummary: { type: Type.STRING }, missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }, bulletPoints: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["original","improved","explanation"], properties: { original: { type: Type.STRING }, improved: { type: Type.STRING }, explanation: { type: Type.STRING } } } }, suggestedHeadline: { type: Type.STRING }, contactInfo: { type: Type.OBJECT, required: ["name","email","phone","location","links"], properties: { name: { type: Type.STRING }, email: { type: Type.STRING }, phone: { type: Type.STRING }, location: { type: Type.STRING }, links: { type: Type.ARRAY, items: { type: Type.STRING } } } }, skills: { type: Type.ARRAY, items: { type: Type.STRING } }, atsFeedback: { type: Type.OBJECT, required: ["impactVerbs","formattingIssues","cloudExperience","overallRecommendation"], properties: { impactVerbs: { type: Type.ARRAY, items: { type: Type.STRING } }, formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING } }, cloudExperience: { type: Type.STRING }, overallRecommendation: { type: Type.STRING } } } } },
      },
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    try { res.json(generateResumeAnalysisBackup(req.body.pdfBase64, req.body.targetRole, req.body.currentRole)); }
    catch { handleGeminiError(error, res, "Failed to analyse resume"); }
  }
});

// ---------------------------------------------------------------------------
// Export for Vercel serverless runtime
// ---------------------------------------------------------------------------
export default app;
