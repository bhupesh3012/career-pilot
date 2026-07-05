import React, { useState } from "react";
import { 
  FileText, 
  Building2, 
  Briefcase, 
  Sparkles, 
  Copy, 
  Download, 
  Check, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle,
  FileCheck2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CoverLetterTailorProps {
  currentRole?: string;
}

export default function CoverLetterTailor({ currentRole = "Fullstack Developer" }: CoverLetterTailorProps) {
  const [companyName, setCompanyName] = useState<string>("Google");
  const [roleDescription, setRoleDescription] = useState<string>("Senior Infrastructure Engineer");
  const [jobDescription, setJobDescription] = useState<string>(
    `Seeking a Senior Infrastructure Engineer to lead scalable system architecture and modular deployments. Experience with Kubernetes, multi-tier microservices, high-throughput caching systems, and secure transaction handshakes is highly desired.`
  );
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Custom generated or fallback template state
  const [coverLetter, setCoverLetter] = useState<string>(() => getFallbackTemplate("Google", "Senior Infrastructure Engineer", currentRole));

  // High quality offline fallback generator
  function getFallbackTemplate(company: string, role: string, curRole: string) {
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    return `Bhupesh
bhupeshr.1230@gmail.com | Silicon Valley, CA
LinkedIn: linkedin.com/in/bhupesh-careerpilot

Date: ${today}

Hiring Committee
${company} Recruiting Team
${company} HQ Address

Subject: Application for ${role} Role

Dear Hiring Manager and Members of the Selection Committee,

I am writing to express my enthusiastic interest in the ${role} position at ${company}. As a highly disciplined ${curRole} with extensive hands-on experience structuring high-throughput APIs, designing fault-tolerant databases, and optimizing rendering performances, I am eager to contribute to ${company}'s core product and engineering deliverables.

In my current capacity, I have pioneered critical service refactoring that boosted network performance throughput by 42% and secured complex state orchestration across distributed node architectures. Your job description specifically emphasizes the need for expertise in scalable infrastructure and secure transactional handshakes. I have successfully resolved race conditions and built token-bucket rate limiters that confidently protect public-facing systems under extreme peak loads. I believe this alignment will enable me to seamlessly blend with your engineering team and start shipping reliable solutions immediately.

What excites me most about ${company} is your unwavering commitment to architectural excellence and developer-first user experiences. I thrive in collaborative environments where engineering craftsmanship is treated as a priority, and I would love the opportunity to leverage my skills to optimize your system scalability goals.

Thank you for your time, consideration, and dedication to reviewing my credentials. I am highly proactive about discussing how my background aligns with your core roadmaps in an interview.

Sincerely,

Bhupesh
Software Architect & Systems Optimizer`;
  }

  // Handle Cover Letter Generation via Gemini API
  const handleGenerateCoverLetter = async () => {
    if (!companyName.trim() || !roleDescription.trim() || !jobDescription.trim()) {
      setError("Please fill out all the form fields to customize your cover letter.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
          roleDescription: roleDescription.trim(),
          jobDescription: jobDescription.trim(),
          candidateName: "Bhupesh",
          experienceLevel: "Senior / Lead"
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate cover letter.");
      }

      const data = await response.json();
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
      } else {
        throw new Error("Invalid response format received from AI server.");
      }
    } catch (err: any) {
      console.warn("AI Generation failed. Loading robust fallback template matching parameters:", err);
      // Fallback with current parameters if Gemini key is missing or errored
      const fallback = getFallbackTemplate(companyName.trim(), roleDescription.trim(), currentRole);
      setCoverLetter(fallback);
      setError("Note: Live AI Generation failed. Created a highly optimized contextual template fallback instead.");
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard action
  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  // Download cover letter as a raw text file
  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_Tailor_${companyName.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClearForm = () => {
    setCompanyName("");
    setRoleDescription("");
    setJobDescription("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Description Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#8d90a0]">Document Tailoring & Delivery</span>
            <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base mt-0.5">
              Cover Letter & Resume Tailor Workbench
            </h3>
          </div>
        </div>
        <p className="text-xs text-slate-600 dark:text-[#c3c6d7] leading-relaxed max-w-4xl">
          Instantly craft an elite, high-conversion cover letter aligned precisely with your target company's job postings. Align your core architectural, performance, and transactional achievements directly to the target role's expectations.
        </p>
      </div>

      {/* SPLIT PANEL WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDE: INPUT PARAMETERS (5 Columns) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-brand-primary" />
              <h4 className="font-sans font-bold text-slate-950 dark:text-white text-xs uppercase tracking-wide">Target Role Parameters</h4>
            </div>
            <button
              id="btn-clear-letter-form"
              onClick={handleClearForm}
              className="font-mono text-[9px] text-slate-400 hover:text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Fields</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Target Company */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Target Company Name</label>
              <input
                id="input-company-name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google, Stripe, Netflix"
                className="font-sans text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-[#11131b] border border-slate-200 dark:border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg px-3.5 py-2.5 transition-all"
              />
            </div>

            {/* Role Title */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Role Description / Title</label>
              <input
                id="input-role-title"
                type="text"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="e.g. Senior Backend Architect"
                className="font-sans text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-[#11131b] border border-slate-200 dark:border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg px-3.5 py-2.5 transition-all"
              />
            </div>

            {/* Paste Job Description */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Job Description Copy-Paste</label>
              <textarea
                id="textarea-job-description"
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job post requirements here to analyze and integrate keywords..."
                className="font-sans text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-[#11131b] border border-slate-200 dark:border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg p-3.5 transition-all leading-relaxed"
              />
            </div>

            {/* Submit Tailor Action Trigger */}
            <button
              id="btn-tailor-coverletter"
              onClick={handleGenerateCoverLetter}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-container disabled:opacity-55 text-white font-sans text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Aligning & Architecting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>Generate Tailored Cover Letter</span>
                </>
              )}
            </button>

            {/* Notification / Error details */}
            {error && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span className="font-sans text-xs leading-relaxed">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: DOCUMENT PAPER PREVIEW (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Action Ribbon */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#8d90a0] font-bold">Paper Document Canvas</span>
            
            <div className="flex items-center gap-2">
              {/* Copy Clipboard button */}
              <button
                id="btn-copy-letter"
                onClick={handleCopyClipboard}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#434655]/20 bg-white dark:bg-[#1d1f27] hover:bg-slate-50 dark:hover:bg-[#11131b] text-slate-600 dark:text-[#c3c6d7] hover:text-slate-900 dark:hover:text-white font-sans text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>

              {/* Download raw TXT button */}
              <button
                id="btn-download-letter"
                onClick={handleDownloadTxt}
                className="px-3 py-1.5 rounded-lg bg-[#11131b] text-white hover:bg-[#191b23] font-sans text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-[#434655]/25"
              >
                <Download className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Download as .txt</span>
              </button>
            </div>
          </div>

          {/* Polished Business Document Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-[#434655]/15 bg-white shadow-lg overflow-hidden relative">
            
            {/* Side Accent Line representing active/tailored state */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-primary to-brand-secondary" />
            
            {/* Paper Margin padding */}
            <div className="p-8 md:p-10 space-y-6 text-slate-800 dark:text-slate-900 font-sans text-xs leading-relaxed max-h-[640px] overflow-y-auto">
              
              {/* Cover Letter Content Body with proper whitespace wrapping */}
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800 focus:outline-none select-text border-none p-0 m-0 bg-transparent">
                {coverLetter}
              </pre>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
