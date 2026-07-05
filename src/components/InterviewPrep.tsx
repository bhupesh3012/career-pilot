import React, { useState } from "react";
import { 
  Award, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  Target, 
  TrendingUp, 
  ShieldAlert,
  Lightbulb,
  FileText,
  BookmarkCheck,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateInterviewMCQs, MCQQuestion } from "../services/interviewService";

const COMMON_ROLES = [
  "Frontend Engineer (React)",
  "Backend Developer (Node.js)",
  "Fullstack Developer",
  "Technical Lead / Architect",
  "AI / Machine Learning Engineer",
  "DevOps & Platform Engineer",
  "Product Manager",
  "Data Scientist"
];

export default function InterviewPrep() {
  // Required local React states
  const [selectedRole, setSelectedRole] = useState<string>("Fullstack Developer");
  const [customRole, setCustomRole] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("Intermediate");
  const [quizQuestions, setQuizQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Additional options
  const [totalQuestions, setTotalQuestions] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);

  const activeRole = selectedRole === "Custom" ? customRole : selectedRole;

  // Handle start MCQ quiz
  const handleStartQuiz = async () => {
    if (selectedRole === "Custom" && !customRole.trim()) {
      setError("Please write in a custom role title first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const questions = await generateInterviewMCQs(activeRole, experienceLevel, totalQuestions);
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
      } else {
        throw new Error("The AI model returned an empty list of questions. Falling back.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate dynamic multiple-choice questions. Please verify your GEMINI_API_KEY.");
    } finally {
      setIsLoading(false);
    }
  };

  // Option select handler
  const handleSelectOption = (option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  // Move to next question or submit
  const handleNextQuestion = () => {
    if (!selectedAnswers[currentQuestionIndex]) return; // Must select an answer

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  // Restart handler
  const handleResetQuiz = () => {
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setError(null);
  };

  // Calculate score stats
  let correctCount = 0;
  if (showResults) {
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
  }

  const scorePercentage = quizQuestions.length > 0 
    ? Math.round((correctCount / quizQuestions.length) * 100) 
    : 0;

  return (
    <div id="interview-tab" className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner Header */}
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-[#8d90a0]">Interactive MCQ Simulator</span>
        <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
          <Award className="w-6 h-6 text-brand-secondary animate-pulse" />
          <span>AI Interactive Technical MCQ Interview</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#c3c6d7] mt-1.5 max-w-3xl">
          Complete with multi-choice dynamic quizzes, live correct/incorrect status evaluation, custom experience filters, and deep developer explanation panels generated instantly by Google Gemini.
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* SETUP STATE PANEL */}
        {!isLoading && quizQuestions.length === 0 && (
          <motion.div
            key="quiz-setup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Configuration Side (8 columns) */}
            <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Target className="w-5 h-5 text-brand-primary" />
                <h3 className="font-sans font-bold text-slate-950 dark:text-white text-base">Select Your Interview Target</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Role selection block */}
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-[#8d90a0] font-bold block">
                    Target Role / Title
                  </label>
                  <select
                    id="setup-role-dropdown"
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      if (e.target.value !== "Custom") setCustomRole("");
                    }}
                    className="w-full px-4 h-11 rounded-xl border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none text-xs font-sans font-medium transition-all"
                  >
                    {COMMON_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                    <option value="Custom">Custom Role Title...</option>
                  </select>

                  {selectedRole === "Custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-2"
                    >
                      <input
                        type="text"
                        placeholder="e.g. Lead Devops Architect"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        className="w-full px-4 h-11 rounded-xl border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none text-xs font-sans"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Experience level selection block */}
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-[#8d90a0] font-bold block">
                    Experience Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Beginner", "Intermediate", "Advanced"].map((tier) => {
                      const isActive = experienceLevel === tier;
                      return (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setExperienceLevel(tier)}
                          className={`h-11 rounded-xl text-xs font-sans border font-bold transition-all text-center cursor-pointer ${
                            isActive
                              ? "bg-white text-slate-950 dark:bg-[#11131b] dark:text-white border-brand-primary shadow-sm"
                              : "bg-slate-50 dark:bg-[#1d1f27]/50 text-slate-600 dark:text-[#8d90a0] border-slate-200 dark:border-[#434655]/10 hover:text-white hover:bg-slate-100 dark:hover:bg-[#11131b]"
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question size configuration */}
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-[#8d90a0] font-bold block">
                    Total Questions
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 10].map((num) => {
                      const isActive = totalQuestions === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setTotalQuestions(num)}
                          className={`h-11 rounded-xl text-xs font-sans border font-bold transition-all text-center cursor-pointer ${
                            isActive
                              ? "bg-white text-slate-950 dark:bg-[#11131b] dark:text-white border-brand-primary shadow-sm"
                              : "bg-slate-50 dark:bg-[#1d1f27]/50 text-slate-600 dark:text-[#8d90a0] border-slate-200 dark:border-[#434655]/10 hover:text-white hover:bg-slate-100 dark:hover:bg-[#11131b]"
                          }`}
                        >
                          {num} Qs
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3 text-xs animate-scaleIn">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                id="btn-start-mcq"
                onClick={handleStartQuiz}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-slate-950 font-sans font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start MCQ Interview</span>
              </button>
            </div>

            {/* Right Information Side (4 columns) */}
            <div className="lg:col-span-4 rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b border-[#434655]/10 pb-3">
                <BookOpen className="w-4 h-4 text-brand-secondary" />
                <h4 className="font-sans font-bold text-white text-xs uppercase tracking-wide">Quiz Architecture</h4>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="font-sans text-xs font-bold text-white block">Tailored Cognitive Scope</span>
                  <p className="font-sans text-[11px] text-[#c3c6d7] leading-relaxed">
                    Beginners focus on core programming syntax and language constructs. Advanced candidates face heavy questions touching distributed concurrency, race-conditions, memory leak isolation, and system bottlenecks.
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="font-sans text-xs font-bold text-white block">Verified Logic Checking</span>
                  <p className="font-sans text-[11px] text-[#c3c6d7] leading-relaxed">
                    Once submitted, you receive instant scoring alongside clear explanations detailing precisely why specific concepts win over alternatives.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOADING ANIMATED SKELETON STATE */}
        {isLoading && (
          <motion.div
            key="quiz-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-6 shadow-sm space-y-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                <span className="font-sans font-bold text-slate-900 dark:text-white text-sm">Gemini AI Interviewer is Curating MCQs...</span>
              </div>
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>

            <div className="space-y-4">
              {/* Question Placeholder */}
              <div className="space-y-2">
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>

              {/* Options Placeholders */}
              <div className="space-y-2.5 pt-4">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="h-11 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ACTIVE QUIZ GAME CARD STATE */}
        {!isLoading && quizQuestions.length > 0 && !showResults && (
          <motion.div
            key="quiz-active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {/* Top Stats HUD */}
            <div className="flex items-center justify-between px-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded-full font-bold">
                  {experienceLevel}
                </span>
                <span className="font-mono bg-slate-100 dark:bg-[#1d1f27] text-slate-500 dark:text-[#8d90a0] px-2.5 py-1 rounded-full font-bold">
                  {activeRole}
                </span>
              </div>
              <div className="font-mono text-slate-400 font-bold">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
            </div>

            {/* Progress indicator bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#11131b] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-6 shadow-sm space-y-6">
              
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-[#8d90a0] uppercase tracking-widest block font-bold">Active Question</span>
                <h2 className="font-sans font-bold text-slate-900 dark:text-white text-base leading-relaxed">
                  {quizQuestions[currentQuestionIndex]?.question}
                </h2>
              </div>

              {/* Options vertical list */}
              <div className="space-y-3 pt-2">
                {quizQuestions[currentQuestionIndex]?.options.map((option, oIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === option;
                  return (
                    <button
                      key={oIdx}
                      id={`quiz-option-${oIdx}`}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left p-4 rounded-xl border font-sans text-xs font-semibold leading-relaxed transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-slate-50 dark:bg-[#11131b] border-brand-primary text-slate-950 dark:text-white shadow-sm"
                          : "bg-white dark:bg-transparent border-slate-200/60 dark:border-[#434655]/15 hover:border-slate-300 dark:hover:border-[#434655]/30 text-slate-700 dark:text-[#c3c6d7]"
                      }`}
                    >
                      <span>{option}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isSelected 
                          ? "border-brand-primary bg-brand-primary/10 text-brand-primary" 
                          : "border-slate-300 dark:border-slate-700 group-hover:border-slate-400"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Control Actions Row */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                <button
                  onClick={handleResetQuiz}
                  className="px-4 h-11 rounded-xl border border-slate-200 dark:border-[#434655]/15 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#11131b] font-sans text-xs font-bold transition-all cursor-pointer"
                >
                  Exit Quiz
                </button>

                <button
                  id="btn-next-mcq"
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswers[currentQuestionIndex]}
                  className="px-5 h-11 rounded-xl bg-brand-primary hover:opacity-90 disabled:opacity-50 text-white font-sans text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <span>{currentQuestionIndex === quizQuestions.length - 1 ? "Submit Quiz" : "Next Question"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* RESULTS SCORECARD VIEW */}
        {!isLoading && showResults && (
          <motion.div
            key="quiz-results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            
            {/* Scorecard HUD Panel */}
            <div className="rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-6 shadow-sm text-center space-y-5">
              
              <div className="w-16 h-16 rounded-2xl bg-brand-secondary/15 text-brand-secondary flex items-center justify-center mx-auto animate-bounce">
                <BookmarkCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[9px] text-[#8d90a0] uppercase tracking-widest block font-bold">Interview Prep Performance Scorecard</span>
                <h2 className="font-sans font-black text-slate-900 dark:text-white text-3xl">
                  {correctCount} / {quizQuestions.length} Correct ({scorePercentage}%)
                </h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  You are evaluated against standard <span className="text-brand-primary font-semibold">{experienceLevel}</span> criteria for <span className="text-brand-primary font-semibold">{activeRole}</span>.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  id="btn-quiz-retry"
                  onClick={handleStartQuiz}
                  className="px-5 h-11 bg-brand-primary text-white font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again (New Qs)</span>
                </button>

                <button
                  onClick={handleResetQuiz}
                  className="px-5 h-11 border border-slate-200 dark:border-[#434655]/15 text-slate-700 dark:text-white font-sans text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer"
                >
                  <span>Back to Settings</span>
                </button>
              </div>

            </div>

            {/* Questions Detailed Report breakdown */}
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase text-slate-400 dark:text-[#8d90a0] tracking-wider block font-bold pl-1">
                Detailed Evaluation Report
              </span>

              {quizQuestions.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div 
                    key={q.id || idx}
                    className={`rounded-2xl border p-5 space-y-4 bg-white dark:bg-[#1d1f27] transition-all ${
                      isCorrect 
                        ? "border-emerald-500/30" 
                        : "border-rose-500/30"
                    }`}
                  >
                    
                    {/* Header badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#8d90a0] font-bold">
                        Question {idx + 1}
                      </span>
                      <span className={`font-sans text-[10px] font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                        isCorrect
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}>
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Correct Choice</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Incorrect choice</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Question Statement */}
                    <h3 className="font-sans font-bold text-slate-900 dark:text-white text-sm leading-relaxed">
                      {q.question}
                    </h3>

                    {/* Choices evaluation indicator */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isUserSelect = userChoice === opt;
                        const isCorrectAnswer = q.correctAnswer === opt;
                        
                        let optStyle = "border-slate-200 dark:border-[#434655]/10 text-slate-600 dark:text-[#8d90a0]";
                        if (isCorrectAnswer) {
                          optStyle = "border-emerald-500/50 bg-emerald-500/[0.03] text-emerald-600 dark:text-emerald-400 font-bold";
                        } else if (isUserSelect && !isCorrect) {
                          optStyle = "border-rose-500/50 bg-rose-500/[0.03] text-rose-600 dark:text-rose-400 font-bold";
                        }

                        return (
                          <div key={oIdx} className={`p-3 rounded-xl border text-xs font-sans ${optStyle}`}>
                            <div className="flex items-center justify-between gap-1.5">
                              <span>{opt}</span>
                              {isCorrectAnswer && (
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              )}
                              {isUserSelect && !isCorrect && (
                                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Technical explanation container */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11131b]/60 border border-slate-200/50 dark:border-[#434655]/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-brand-primary text-xs font-bold">
                        <Lightbulb className="w-4 h-4 text-brand-primary" />
                        <span className="font-sans uppercase tracking-wide text-[10px]">Technical Concept Analysis</span>
                      </div>
                      <p className="font-sans text-xs text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
