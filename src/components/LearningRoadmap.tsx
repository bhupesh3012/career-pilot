import React, { useState, useEffect } from "react";
import { 
  Compass, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  BookOpen, 
  Award, 
  Clock, 
  RotateCcw,
  Sparkles,
  BookmarkCheck,
  ChevronRight,
  Target,
  Search,
  CheckSquare,
  Square,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generatePathfinderRoadmap, PathfinderRoadmapItem } from "../services/pathfinderService";

interface LearningRoadmapProps {
  currentRole?: string;
  targetRole?: string;
}

export default function LearningRoadmap({ 
  currentRole = "Fullstack Developer", 
  targetRole = "Technical Lead" 
}: LearningRoadmapProps) {
  // Input parameter states explicitly matching the user's requirements
  const [selectedRole, setSelectedRole] = useState<string>(targetRole);
  const [experienceLevel, setExperienceLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [durationDays, setDurationDays] = useState<30 | 60 | 90>(30);
  const [currentSkills, setCurrentSkills] = useState<string>("React, Node.js, JavaScript, git");

  // Output states
  const [roadmapData, setRoadmapData] = useState<PathfinderRoadmapItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Checked tasks state mapping: `${weekIndex}-${taskIndex}` => boolean
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  // Reset/sync selectedRole whenever targetRole changes from parent
  useEffect(() => {
    if (targetRole) {
      setSelectedRole(targetRole);
    }
  }, [targetRole]);

  // Load cache on mount or when parameters change
  useEffect(() => {
    const cacheKey = `careerpilot_pathfinder_${selectedRole.trim().toLowerCase()}_${experienceLevel}_${durationDays}`;
    const progressKey = `careerpilot_progress_${selectedRole.trim().toLowerCase()}_${experienceLevel}_${durationDays}`;

    try {
      const cachedRoadmap = localStorage.getItem(cacheKey);
      if (cachedRoadmap) {
        setRoadmapData(JSON.parse(cachedRoadmap));
      } else {
        setRoadmapData(null);
      }

      const cachedProgress = localStorage.getItem(progressKey);
      if (cachedProgress) {
        setCheckedTasks(JSON.parse(cachedProgress));
      } else {
        setCheckedTasks({});
      }
    } catch (e) {
      console.error("Failed to load pathfinder cache:", e);
    }
  }, [selectedRole, experienceLevel, durationDays]);

  // Generate the pathfinder roadmap
  const handleGenerateRoadmap = async () => {
    if (!selectedRole.trim()) {
      setError("Please specify a target career role.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const skillsArray = currentSkills
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      const data = await generatePathfinderRoadmap(selectedRole, experienceLevel, durationDays, skillsArray);
      setRoadmapData(data);

      // Save to localStorage cache
      const cacheKey = `careerpilot_pathfinder_${selectedRole.trim().toLowerCase()}_${experienceLevel}_${durationDays}`;
      localStorage.setItem(cacheKey, JSON.stringify(data));

      // Reset progress checkmarks for the new generation
      const progressKey = `careerpilot_progress_${selectedRole.trim().toLowerCase()}_${experienceLevel}_${durationDays}`;
      localStorage.removeItem(progressKey);
      setCheckedTasks({});
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to customize AI timeline. Please check connectivity.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle individual task checkbox status
  const handleToggleTask = (weekIndex: number, taskIndex: number) => {
    const key = `${weekIndex}-${taskIndex}`;
    const updated = {
      ...checkedTasks,
      [key]: !checkedTasks[key]
    };
    setCheckedTasks(updated);

    // Save progress to local storage
    const progressKey = `careerpilot_progress_${selectedRole.trim().toLowerCase()}_${experienceLevel}_${durationDays}`;
    localStorage.setItem(progressKey, JSON.stringify(updated));
  };

  // Reset progress checkmarks
  const handleResetProgress = () => {
    setCheckedTasks({});
    const progressKey = `careerpilot_progress_${selectedRole.trim().toLowerCase()}_${experienceLevel}_${durationDays}`;
    localStorage.removeItem(progressKey);
  };

  // Calculate percentage metrics
  let totalTasksCount = 0;
  let checkedTasksCount = 0;

  if (roadmapData && Array.isArray(roadmapData)) {
    roadmapData.forEach((week, wIdx) => {
      if (week.tasks && Array.isArray(week.tasks)) {
        week.tasks.forEach((_, tIdx) => {
          totalTasksCount++;
          if (checkedTasks[`${wIdx}-${tIdx}`]) {
            checkedTasksCount++;
          }
        });
      }
    });
  }

  const completionPercentage = totalTasksCount > 0 
    ? Math.round((checkedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Curated list of targets for the select role dropdown
  const targetRolesList = [
    "Technical Lead",
    "Senior Frontend Architect",
    "Staff Backend Engineer",
    "Fullstack Developer",
    "AI / Machine Learning Engineer",
    "Cloud DevOps Architect",
    "Product Manager",
    "Mobile App Engineer",
    "Cybersecurity Analyst",
    "Data Engineer"
  ];

  return (
    <div className="space-y-6">
      
      {/* Parameters Configuration Input Banner */}
      <div className="rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#434655]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8d90a0]">Pathfinder Engine</span>
              <h3 className="font-sans font-bold text-white text-base mt-0.5">
                On-Demand Learning Timeline Generator
              </h3>
            </div>
          </div>

          {/* Timeframe selector tabs */}
          <div className="flex items-center gap-2 bg-[#11131b] p-1 rounded-xl border border-[#434655]/15">
            {([30, 60, 90] as const).map((days) => (
              <button
                key={days}
                id={`duration-tab-${days}`}
                onClick={() => setDurationDays(days)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                  durationDays === days
                    ? "bg-white text-slate-950 shadow-md"
                    : "text-[#8d90a0] hover:text-white"
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* Target Role Selector Dropdown */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="font-mono text-[10px] uppercase text-[#8d90a0] tracking-wider block font-bold">
              Target Career Role
            </label>
            <div className="relative">
              <select
                id="select-target-role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full h-11 bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary/50 focus:outline-none rounded-xl px-3.5 pl-9 text-xs font-sans text-white cursor-pointer transition-all"
              >
                {!targetRolesList.includes(selectedRole) && (
                  <option value={selectedRole}>{selectedRole}</option>
                )}
                {targetRolesList.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <Target className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-4" />
            </div>
          </div>

          {/* Experience Level Dropdown */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="font-mono text-[10px] uppercase text-[#8d90a0] tracking-wider block font-bold">
              Experience Level
            </label>
            <div className="relative">
              <select
                id="select-experience-level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full h-11 bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary/50 focus:outline-none rounded-xl px-3.5 pl-9 text-xs font-sans text-white cursor-pointer transition-all"
              >
                <option value="Beginner">Beginner (0-2 years)</option>
                <option value="Intermediate">Intermediate (2-5 years)</option>
                <option value="Advanced">Advanced (5+ years)</option>
              </select>
              <Award className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-4" />
            </div>
          </div>

          {/* Background Skills Comma-separated Text Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="font-mono text-[10px] uppercase text-[#8d90a0] tracking-wider block font-bold">
              Your Current Background Skills
            </label>
            <div className="relative">
              <input
                type="text"
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="React, TypeScript, basic Node, Python"
                className="w-full h-11 bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary/50 focus:outline-none rounded-xl px-3.5 pl-9 text-xs font-sans text-white placeholder-slate-500 transition-all"
              />
              <Compass className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Generate Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleGenerateRoadmap}
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-brand-primary to-brand-secondary text-slate-950 font-sans font-extrabold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Pathfinding...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-2.5 text-xs animate-scaleIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Roadmap Area */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          // Premium interactive stepper skeleton loader
          <motion.div
            key="skeleton-loader"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Skeletal header progress bar */}
            <div className="rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-48 bg-[#11131b] rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-[#11131b] rounded-lg animate-pulse" />
              </div>
              <div className="w-full h-3 bg-[#11131b] rounded-full animate-pulse overflow-hidden">
                <div className="w-1/3 h-full bg-brand-primary/30 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column Skeleton */}
              <div className="lg:col-span-4 rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-5 shadow-sm space-y-4 animate-pulse">
                <div className="h-3 w-1/3 bg-[#11131b] rounded" />
                <div className="h-6 w-3/4 bg-[#11131b] rounded" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 w-full bg-[#11131b] rounded" />
                  <div className="h-3.5 w-full bg-[#11131b] rounded" />
                  <div className="h-3.5 w-5/6 bg-[#11131b] rounded" />
                </div>
              </div>

              {/* Right Timeline Stepper Skeleton */}
              <div className="lg:col-span-8 space-y-6 relative pl-6 md:pl-10">
                <div className="absolute left-10 md:left-14 top-4 bottom-4 w-0.5 bg-slate-800" />
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="relative flex gap-4 animate-pulse">
                    <div className="absolute -left-10 md:-left-14 top-1.5 z-10 w-8 h-8 rounded-full bg-[#11131b] border-2 border-slate-700 flex items-center justify-center font-bold text-slate-500">
                      {idx}
                    </div>
                    <div className="w-full p-5 rounded-2xl border border-slate-800 bg-[#1d1f27] space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-1/3 bg-[#11131b] rounded" />
                        <div className="h-4 w-1/5 bg-[#11131b] rounded" />
                      </div>
                      <div className="h-3.5 w-full bg-[#11131b] rounded" />
                      <div className="space-y-1.5 pt-2">
                        <div className="h-3 w-5/6 bg-[#11131b] rounded" />
                        <div className="h-3 w-4/6 bg-[#11131b] rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : roadmapData && Array.isArray(roadmapData) ? (
          // Main dynamic vertical timeline
          <motion.div
            key="roadmap-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Progress Header */}
            <div className="rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#8d90a0]">Trajectory Checkpoint Tracker</span>
                    <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base mt-0.5">
                      Your Pathfinder Progression Timeline
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-[#8d90a0] block uppercase tracking-wider">Completeness Score</span>
                    <span className="font-sans text-lg font-black text-slate-900 dark:text-white mt-0.5 block animate-scaleIn">
                      {checkedTasksCount} / {totalTasksCount} Tasks Completed ({completionPercentage}%)
                    </span>
                  </div>
                  <button
                    id="btn-reset-roadmap"
                    onClick={handleResetProgress}
                    title="Reset checklist progress"
                    className="p-2 rounded-lg border border-slate-200 dark:border-[#434655]/20 text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-[#11131b] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-3 rounded-full bg-slate-100 dark:bg-[#11131b] overflow-hidden border border-slate-200/40 dark:border-[#434655]/10">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column Phase Summary */}
              <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Target className="w-4 h-4 text-brand-primary" />
                  <h4 className="font-sans font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">Target Objective</h4>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-brand-secondary uppercase tracking-wider block font-bold">
                      {durationDays} Days Blueprint
                    </span>
                    <h3 className="font-sans font-bold text-slate-900 dark:text-white text-sm">
                      Transitioning to {selectedRole}
                    </h3>
                  </div>
                  
                  <p className="font-sans text-xs text-slate-600 dark:text-[#c3c6d7] leading-relaxed">
                    This step-by-step roadmap outlines exactly what is required to advance into high-visibility technical ownership as a <span className="text-white font-bold">{experienceLevel}</span> specialist, taking into account your skill background in <span className="text-brand-primary font-bold">{currentSkills}</span>.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8d90a0] font-bold block">Career Metrics</span>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#11131b] border border-slate-200/50 dark:border-[#434655]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] text-slate-500">Current Base:</span>
                      <span className="font-mono text-[10px] text-slate-800 dark:text-white font-semibold">{currentRole}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] text-slate-500">Target Career:</span>
                      <span className="font-mono text-[10px] text-brand-primary font-bold">{selectedRole}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] text-slate-500">Target Level:</span>
                      <span className="font-mono text-[10px] text-[#ffb596] font-bold">{experienceLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] text-slate-500">Timeframe:</span>
                      <span className="font-mono text-[10px] text-brand-secondary font-bold">{durationDays} Days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Timeline Stepper */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Timeline Wrapper with connecting lines */}
                <div className="relative pl-6 md:pl-10 space-y-8 pb-4">
                  <div className="absolute left-10 md:left-14 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800" />

                  {roadmapData.map((wk, wIdx) => {
                    // Check if all tasks in this week are checked
                    const weekTasksCount = wk.tasks ? wk.tasks.length : 0;
                    let checkedInWeek = 0;
                    if (wk.tasks) {
                      wk.tasks.forEach((_, tIdx) => {
                        if (checkedTasks[`${wIdx}-${tIdx}`]) {
                          checkedInWeek++;
                        }
                      });
                    }
                    const isWeekComplete = weekTasksCount > 0 && checkedInWeek === weekTasksCount;

                    return (
                      <div key={wIdx} className="relative group">
                        
                        {/* Bullet Circle Checkpoint */}
                        <div className="absolute -left-10 md:-left-14 top-1.5 z-10 flex items-center justify-center">
                          <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center transition-all bg-[#11131b] ${
                            isWeekComplete
                              ? "border-brand-secondary text-brand-secondary bg-brand-secondary/5 shadow-md shadow-brand-secondary/15"
                              : "border-slate-300 dark:border-slate-700 hover:border-brand-primary text-slate-400"
                          }`}>
                            {isWeekComplete ? (
                              <CheckCircle2 className="w-5 h-5 text-brand-secondary animate-scaleIn" />
                            ) : (
                              <span className="font-mono text-xs font-bold">{wk.week}</span>
                            )}
                          </div>
                        </div>

                        {/* Week Card */}
                        <div className={`p-5 rounded-2xl border transition-all space-y-4 bg-white dark:bg-[#1d1f27] ${
                          isWeekComplete
                            ? "border-brand-secondary/40 shadow-sm"
                            : "border-slate-200 dark:border-[#434655]/15 hover:border-slate-300 dark:hover:border-[#434655]/30 shadow-none"
                        }`}>
                          
                          {/* Card Header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                            <div className="space-y-0.5">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                                Week {wk.week} Focus
                              </span>
                              <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm">
                                {wk.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-sans text-[10px] text-slate-500 bg-slate-100 dark:bg-[#11131b] px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-[#434655]/10">
                                {checkedInWeek} / {weekTasksCount} Tasks Done
                              </span>
                            </div>
                          </div>

                          {/* Milestone Objective */}
                          <div className="space-y-1">
                            <span className="font-mono text-[8px] uppercase tracking-wider text-brand-primary font-bold">Week Objective</span>
                            <p className="font-sans text-xs text-slate-700 dark:text-[#c3c6d7] leading-relaxed">
                              {wk.milestone}
                            </p>
                          </div>

                          {/* Action Tasks Checkboxes */}
                          <div className="space-y-2 pt-1">
                            <span className="font-mono text-[8px] uppercase tracking-wider text-slate-400 font-bold block">Key Learning Tasks</span>
                            <div className="space-y-2">
                              {wk.tasks && wk.tasks.map((task, tIdx) => {
                                const isChecked = !!checkedTasks[`${wIdx}-${tIdx}`];
                                return (
                                  <button
                                    key={tIdx}
                                    onClick={() => handleToggleTask(wIdx, tIdx)}
                                    className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl border border-dashed border-slate-200/60 dark:border-slate-800/60 hover:border-brand-primary/30 hover:bg-slate-500/[0.02] dark:hover:bg-brand-primary/[0.02] transition-colors cursor-pointer"
                                  >
                                    <div className="shrink-0 mt-0.5 text-brand-secondary">
                                      {isChecked ? (
                                        <CheckSquare className="w-4 h-4 text-brand-secondary" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                                      )}
                                    </div>
                                    <span className={`font-sans text-xs leading-relaxed ${
                                      isChecked ? "text-slate-400 line-through dark:text-slate-500" : "text-slate-700 dark:text-[#c3c6d7]"
                                    }`}>
                                      {task}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Study Resources */}
                          {wk.resources && wk.resources.length > 0 && (
                            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/40 flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[8px] uppercase tracking-wider text-slate-400 font-bold block mr-1">Study Guides:</span>
                              {wk.resources.map((res, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="font-sans text-[10px] text-indigo-500 dark:text-brand-primary font-semibold flex items-center gap-1 bg-indigo-500/[0.03] dark:bg-brand-primary/5 px-2 py-1 rounded border border-indigo-500/10 dark:border-brand-primary/10"
                                >
                                  <BookOpen className="w-3 h-3" />
                                  <span>{res}</span>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}

                </div>

              </div>

            </div>
          </motion.div>
        ) : (
          // Initial clean welcome panel
          <motion.div
            key="welcome-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-[#434655]/30 p-12 text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto shadow-sm">
              <Compass className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-sans font-bold text-white text-lg">
                Design Your Live AI Pathfinder Blueprint
              </h3>
              <p className="text-xs text-[#8d90a0] leading-relaxed max-w-md mx-auto">
                No rigid, hardcoded layouts here. Select your dream career role above, set your background skills, and let Gemini compile a custom, week-by-week transition blueprint tailored on-demand!
              </p>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              className="px-6 h-11 bg-gradient-to-r from-brand-primary to-brand-secondary text-slate-950 font-sans font-extrabold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 mx-auto hover:opacity-95 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Initialize Live Pathfinder</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
