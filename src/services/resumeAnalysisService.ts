/**
 * Service to handle resume parsing, ATS scoring, and alignment checks using the Gemini API.
 */

export interface ParsedResumeResult {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    links: string[];
  };
  score: number;
  matchSummary: string;
  skills: string[];
  suggestedHeadline: string;
  missingKeywords: string[];
  bulletPoints: Array<{
    original: string;
    improved: string;
    explanation: string;
  }>;
  atsFeedback: {
    impactVerbs: string[];
    formattingIssues: string[];
    cloudExperience: string;
    overallRecommendation: string;
  };
}

/**
 * Analyzes resume raw PDF (as base64) against a targeted industry role.
 * 
 * @param pdfBase64 Base64 representation of the PDF file.
 * @param targetRole Core title being optimized for.
 * @param currentRole Current title of the candidate.
 * @returns High-fidelity parsed resume response structure.
 */
export async function analyzeResumeWithAI(
  pdfBase64: string,
  targetRole: string,
  currentRole: string
): Promise<ParsedResumeResult> {
  const response = await fetch("/api/resume/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pdfBase64,
      targetRole,
      currentRole,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to analyze resume PDF using Gemini AI.");
  }

  return response.json();
}
