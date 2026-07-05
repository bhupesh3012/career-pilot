export interface Milestone {
  title: string;
  timeframe: string;
  description: string;
  skillsToLearn: string[];
  resources: string[];
  confidenceScore: number;
  milestoneType: "entry" | "intermediate" | "advanced" | "peak";
}

export interface AlternatePath {
  title: string;
  description: string;
  suitability: string;
}

export interface CareerPathData {
  executiveSummary: string;
  milestones: Milestone[];
  alternatePaths: AlternatePath[];
}

export interface BulletPointRewrite {
  original: string;
  improved: string;
  explanation: string;
}

export interface ResumeOptimizationData {
  score: number;
  matchSummary: string;
  missingKeywords: string[];
  bulletPoints: BulletPointRewrite[];
  suggestedHeadline: string;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
    location: string;
    links: string[];
  };
  skills?: string[];
  atsFeedback?: {
    impactVerbs: string[];
    formattingIssues: string[];
    cloudExperience: string;
    overallRecommendation: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: "Technical" | "Behavioral" | "System Design";
  difficulty: "Easy" | "Medium" | "Hard";
  suggestedStructure?: string;
  hint?: string;
}

export interface InterviewEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

