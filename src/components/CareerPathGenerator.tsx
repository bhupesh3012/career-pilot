import React, { useState } from "react";
import { 
  Sparkles, 
  Target, 
  Map, 
  Layers, 
  GraduationCap, 
  Compass, 
  Briefcase, 
  Bookmark, 
  Clock, 
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Shuffle
} from "lucide-react";
import { motion } from "motion/react";
import { CareerPathData, Milestone, AlternatePath } from "../types";
import LearningRoadmap from "./LearningRoadmap";

interface CareerPathGeneratorProps {
  currentRole: string;
  setCurrentRole: (role: string) => void;
  targetRole: string;
  setTargetRole: (role: string) => void;
  careerPathData: CareerPathData | null;
  setCareerPathData: (data: CareerPathData) => void;
}

export default function CareerPathGenerator({
  currentRole,
  setCurrentRole,
  targetRole,
  setTargetRole,
  careerPathData,
  setCareerPathData
}: CareerPathGeneratorProps) {
  const [focusArea, setFocusArea] = useState<string>("Technical Architecture");
  const [experienceLevel, setExperienceLevel] = useState<string>("Mid-Level");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number | null>(null);
  const [subTab, setSubTab] = useState<"trajectory" | "roadmap">("trajectory");

  const focusAreas = [
    "Technical Architecture",
    "Engineering Leadership",
    "Product Management",
    "AI & Cloud Engineering",
    "Founder / Entrepreneurship"
  ];

  const experienceLevels = [
    "Junior (0-2 years)",
    "Mid-Level (2-5 years)",
    "Senior (5-8 years)",
    "Lead / Principal (8+ years)"
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRole.trim() || !targetRole.trim()) {
      setError("Please fill in both current and target roles.");
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedMilestoneIndex(null);

    try {
      const response = await fetch("/api/career/generate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRole,
          targetRole,
          focusArea,
          experienceLevel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate career path from AI server.");
      }

      const data = await response.json();
      setCareerPathData(data);
      setSelectedMilestoneIndex(0); // auto-select first milestone
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while designing your path.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="pathfinder-tab" className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header section */}
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-[#8d90a0]">Strategic Trajectory Planner</span>
        <h1 className="text-2xl font-bold font-sans tracking-tight text-white mt-1 flex items-center gap-2">
          <Map className="w-6 h-6 text-brand-primary" />
          <span>AI Pathfinder</span>
        </h1>
        <p className="text-sm text-[#c3c6d7] mt-1.5 max-w-3xl">
          Construct an elite milestone path mapping your transition, powered by the intelligence of Gemini. Receive required skill matrices, actionable timeframes, and hyper-realistic, curated learning resources.
        </p>
      </div>

      {/* Sub-tab selection */}
      <div className="flex border-b border-[#434655]/10 pb-1 gap-2">
        <button
          id="btn-subtab-trajectory"
          onClick={() => setSubTab("trajectory")}
          className={`px-4 py-2 font-sans font-bold text-xs border-b-2 transition-all cursor-pointer ${
            subTab === "trajectory"
              ? "border-brand-primary text-white font-extrabold"
              : "border-transparent text-[#8d90a0] hover:text-white"
          }`}
        >
          Milestone Trajectories
        </button>
        <button
          id="btn-subtab-roadmap"
          onClick={() => setSubTab("roadmap")}
          className={`px-4 py-2 font-sans font-bold text-xs border-b-2 transition-all cursor-pointer ${
            subTab === "roadmap"
              ? "border-brand-primary text-white font-extrabold"
              : "border-transparent text-[#8d90a0] hover:text-white"
          }`}
        >
          Interactive 30-60-90 Day Roadmap
        </button>
      </div>

      {subTab === "roadmap" ? (
        <LearningRoadmap currentRole={currentRole} targetRole={targetRole} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Grid: Configuration Form */}
          <div className="lg:col-span-4 rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-6 space-y-5">
            <div>
              <h2 className="font-sans font-semibold text-white text-base">Path Configuration</h2>
              <p className="text-xs text-[#8d90a0] mt-0.5">Customize your transition trajectory parameters.</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              
              {/* Input Current Role */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Current Role</label>
                <input
                  id="input-current-role"
                  type="text"
                  required
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Fullstack Developer"
                  className="font-sans text-sm text-white bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg px-3.5 py-2.5 transition-all focus:ring-2 focus:ring-brand-primary/10"
                />
              </div>

              {/* Input Target Role */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Target Role</label>
                <input
                  id="input-target-role"
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Technical Lead"
                  className="font-sans text-sm text-white bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg px-3.5 py-2.5 transition-all focus:ring-2 focus:ring-brand-primary/10"
                />
              </div>

              {/* Select Focus Area */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Trajectory Focus Area</label>
                <div className="flex flex-wrap gap-1.5">
                  {focusAreas.map((area) => (
                    <button
                      id={`focus-${area.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      type="button"
                      key={area}
                      onClick={() => setFocusArea(area)}
                      className={`font-mono text-[11px] px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
                        focusArea === area
                          ? "bg-brand-primary-container/20 text-brand-primary border-brand-primary"
                          : "bg-[#11131b] text-[#8d90a0] border-[#434655]/15 hover:border-[#434655]/40"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Experience Level */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Current Experience Level</label>
                <select
                  id="select-exp-level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="font-sans text-sm text-white bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg px-3.5 py-2.5 transition-all cursor-pointer"
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Action Button with Gradient Border */}
              <motion.button
                id="btn-generate-trajectory"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-sans text-sm font-semibold text-white cursor-pointer relative overflow-hidden flex items-center justify-center gap-2 ${
                  loading 
                    ? "bg-[#282a32] cursor-not-allowed border border-[#434655]/20" 
                    : "bg-gradient-to-r from-[#2563eb] to-[#06b6d4] shadow-md shadow-brand-primary-container/15 hover:brightness-110"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Formulating Strategy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#ffb596]" />
                    <span>Generate AI Career Path</span>
                  </>
                )}
              </motion.button>
            </form>

            {error && (
              <div className="flex items-start gap-2 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-sans text-xs">{error}</span>
              </div>
            )}
          </div>

          {/* Right Grid: Milestone Timeline Output */}
          <div className="lg:col-span-8 space-y-6">
            
            {!careerPathData && !loading && (
              <div className="rounded-2xl border-2 border-dashed border-[#434655]/15 p-12 text-center flex flex-col items-center justify-center h-[420px] bg-[#1d1f27]/30">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary-container/10 text-brand-primary mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-semibold text-white text-base">No Path Generated Yet</h3>
                <p className="font-sans text-sm text-[#8d90a0] mt-1.5 max-w-sm">
                  Enter your current and target career roles on the left to map your personalized progression.
                </p>
              </div>
            )}

            {loading && (
              <div className="rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-8 flex flex-col items-center justify-center h-[420px] space-y-5">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-primary-container/20 border-t-brand-primary animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-brand-tertiary animate-pulse" />
                </div>
                <div className="text-center space-y-1.5">
                  <h3 className="font-sans font-semibold text-white text-base">Analyzing Trajectory Feasibility</h3>
                  <p className="font-mono text-xs text-[#8d90a0] uppercase tracking-wider animate-pulse">Consulting global ATS requirements & career models...</p>
                </div>
                <p className="font-sans text-xs text-[#c3c6d7] max-w-sm text-center leading-relaxed">
                  "Our agent is currently structuring milestone steps, identifying required skills, and curating course catalogs. This may take 5-10 seconds."
                </p>
              </div>
            )}

            {careerPathData && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Strategy Executive Summary */}
                <div className="rounded-2xl bg-gradient-to-b from-[#1e293b]/70 to-[#0f172a] border border-[#434655]/15 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#ffb596] bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded">
                      Feasibility Assessment
                    </span>
                    <span className="font-mono text-[10px] text-[#8d90a0]">Alignment: Strategic Peak</span>
                  </div>
                  <h3 className="font-sans font-bold text-white text-base">Executive Roadmap Summary</h3>
                  <p className="font-sans text-sm text-[#c3c6d7] leading-relaxed">
                    {careerPathData.executiveSummary}
                  </p>
                </div>

                {/* Progress Timeline Nodes */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Milestones Vertical List */}
                  <div className="md:col-span-5 space-y-3">
                    <span className="font-mono text-[10px] text-[#8d90a0] uppercase tracking-wider block mb-1">Roadmap Stages</span>
                    {careerPathData.milestones.map((milestone, idx) => {
                      const isSelected = selectedMilestoneIndex === idx;
                      
                      return (
                        <button
                          id={`milestone-node-${idx}`}
                          key={idx}
                          onClick={() => setSelectedMilestoneIndex(idx)}
                          className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                            isSelected
                              ? "bg-[#1d1f27] border-brand-primary text-white shadow-lg"
                              : "bg-[#11131b] border-[#434655]/15 text-[#c3c6d7] hover:border-[#434655]/40 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Circle Stage Number */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                              isSelected 
                                ? "bg-brand-primary text-surface-bg" 
                                : "bg-[#1d1f27] text-[#8d90a0] group-hover:text-white"
                            }`}>
                              {idx + 1}
                            </div>
                            
                            <div className="flex flex-col min-w-0">
                              <span className="font-sans text-xs font-medium truncate">{milestone.title}</span>
                              <span className="font-mono text-[10px] text-[#8d90a0] mt-0.5">{milestone.timeframe}</span>
                            </div>
                          </div>

                          <span className="font-mono text-[10px] text-brand-secondary">
                            {milestone.confidenceScore}%
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Milestone Detail Card Panel */}
                  <div className="md:col-span-7">
                    {selectedMilestoneIndex !== null && careerPathData.milestones[selectedMilestoneIndex] && (
                      <motion.div
                        key={selectedMilestoneIndex}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-[#434655]/15 p-6 space-y-5 h-full"
                      >
                        {/* Badge / Header */}
                        <div className="flex items-center justify-between border-b border-[#434655]/10 pb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] uppercase tracking-widest text-[#c3c0ff] bg-brand-secondary/10 border border-brand-secondary/20 px-2 py-0.5 rounded">
                                Stage {selectedMilestoneIndex + 1}
                              </span>
                              <span className="font-mono text-[10px] text-[#ffb596] capitalize">
                                {careerPathData.milestones[selectedMilestoneIndex].milestoneType} Level
                              </span>
                            </div>
                            <h4 className="font-sans font-bold text-white text-base">
                              {careerPathData.milestones[selectedMilestoneIndex].title}
                            </h4>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span className="font-mono text-xs text-[#8d90a0] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{careerPathData.milestones[selectedMilestoneIndex].timeframe}</span>
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#8d90a0] block">Mission Blueprint</span>
                          <p className="font-sans text-sm text-[#c3c6d7] leading-relaxed bg-[#11131b]/50 p-4 rounded-xl border border-[#434655]/5">
                            {careerPathData.milestones[selectedMilestoneIndex].description}
                          </p>
                        </div>

                        {/* Required Skills Matrix */}
                        <div className="space-y-2">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#8d90a0] block">Core Capabilities to Master</span>
                          <div className="flex flex-wrap gap-1.5">
                            {careerPathData.milestones[selectedMilestoneIndex].skillsToLearn.map((skill, index) => (
                              <span 
                                key={index}
                                className="font-mono text-xs text-white bg-[#11131b] border border-[#434655]/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                <span>{skill}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Recommended Curated Learning Resources */}
                        <div className="space-y-2">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#8d90a0] block">Recommended Learning Channels</span>
                          <div className="space-y-2">
                            {careerPathData.milestones[selectedMilestoneIndex].resources.map((resource, index) => (
                              <div 
                                key={index}
                                className="flex items-start gap-2.5 p-3 rounded-lg bg-[#11131b]/60 border border-[#434655]/10 text-xs font-sans text-[#c3c6d7]"
                              >
                                <GraduationCap className="w-4 h-4 text-brand-tertiary shrink-0 mt-0.5" />
                                <span>{resource}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Alternate branches */}
                {careerPathData.alternatePaths && careerPathData.alternatePaths.length > 0 && (
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] text-[#8d90a0] uppercase tracking-wider block">Alternate Trajectory Branches</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {careerPathData.alternatePaths.map((path, idx) => (
                        <div 
                          key={idx}
                          className="rounded-xl bg-[#1d1f27] border border-[#434655]/15 p-5 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-sans font-semibold text-white text-sm">{path.title}</span>
                              <Shuffle className="w-4 h-4 text-brand-secondary shrink-0" />
                            </div>
                            <p className="font-sans text-xs text-[#c3c6d7] leading-relaxed">
                              {path.description}
                            </p>
                          </div>
                          <div className="mt-4 border-t border-[#434655]/10 pt-3 flex items-center gap-1">
                            <span className="font-mono text-[10px] text-[#8d90a0] uppercase tracking-wider">Suitability:</span>
                            <span className="font-sans text-xs text-brand-primary font-medium">{path.suitability}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
