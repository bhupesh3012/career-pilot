import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  HelpCircle, 
  ArrowUpRight, 
  TrendingUp, 
  BookOpen, 
  DollarSign, 
  Award, 
  Briefcase,
  Layers,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  FileText,
  UserCheck,
  AlertTriangle,
  MapPin,
  Calendar,
  Zap,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useProfile } from "../context/ProfileContext";

interface DashboardProps {
  currentRole: string;
  targetRole: string;
  onNavigateToTab: (tab: string) => void;
  careerPathData?: any;
}

export default function Dashboard({ 
  currentRole, 
  targetRole, 
  onNavigateToTab,
  careerPathData 
}: DashboardProps) {
  const { profile } = useProfile();
  // Local state for selected node in the trajectory graph
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const [greeting, setGreeting] = useState<string>("Welcome back");
  const [activeSubTab, setActiveSubTab] = useState<"internships" | "projects">("internships");

  // Dynamic Greeting Logic based on local hour
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting("Good morning");
    } else if (hours >= 12 && hours < 17) {
      setGreeting("Good afternoon");
    } else if (hours >= 17 && hours < 22) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good late night");
    }
  }, []);

  // Realistic Student mock data arrays
  const mockInternships = [
    {
      id: "int-1",
      role: "Distributed Infrastructure Engineering Intern",
      company: "Google",
      location: "Mountain View, CA (Hybrid)",
      compensation: "$45 - $58 / hr",
      matchScore: 94,
      skills: ["Go / Python", "Kubernetes", "gRPC", "Linux Systems"],
      logoBg: "bg-rose-500/10 text-rose-400"
    },
    {
      id: "int-2",
      role: "Fullstack Product Engineering Intern",
      company: "Stripe",
      location: "San Francisco, CA (On-site)",
      compensation: "$42 - $55 / hr",
      matchScore: 89,
      skills: ["React / TypeScript", "Ruby on Rails", "REST APIs", "SQL"],
      logoBg: "bg-indigo-500/10 text-indigo-400"
    },
    {
      id: "int-3",
      role: "Frontend Architect Intern",
      company: "Vercel",
      location: "Remote (Global)",
      compensation: "$40 - $52 / hr",
      matchScore: 85,
      skills: ["Next.js", "Tailwind CSS", "Web Vitals", "Edge Middleware"],
      logoBg: "bg-amber-500/10 text-amber-400"
    }
  ];

  const mockProjects = [
    {
      id: "proj-1",
      role: "High-Throughput Distributed Rate Limiter",
      company: "Distributed Systems Core",
      location: "Level: Advanced (Individual)",
      compensation: "Est. Time: 25 hrs",
      matchScore: 95,
      skills: ["Go", "Redis Cluster", "Docker Cluster", "gRPC / Protobuf"],
      logoBg: "bg-emerald-500/10 text-emerald-400"
    },
    {
      id: "proj-2",
      role: "Event-Driven Financial Ledger System",
      company: "Transactional Backend",
      location: "Level: Advanced (Individual)",
      compensation: "Est. Time: 30 hrs",
      matchScore: 90,
      skills: ["Node.js", "Apache Kafka", "PostgreSQL", "Prisma ORM"],
      logoBg: "bg-purple-500/10 text-purple-400"
    },
    {
      id: "proj-3",
      role: "Multi-Tenant SaaS IAM & Session Provider",
      company: "Cloud & SecOps Core",
      location: "Level: Intermediate (Individual)",
      compensation: "Est. Time: 18 hrs",
      matchScore: 87,
      skills: ["React / Next.js", "OAuth 2.0", "Redis Session", "JWT Sync"],
      logoBg: "bg-pink-500/10 text-pink-400"
    }
  ];

  const mockActivities = [
    {
      id: "act-1",
      title: "ATS Resume Scanned",
      desc: "Compared resume parameters against Google Infrastructure Intern role.",
      time: "24 minutes ago",
      icon: FileText,
      iconColor: "text-brand-primary"
    },
    {
      id: "act-2",
      title: "Co-Pilot Advisory Consultation",
      desc: "Discussed the impact of mastering AWS Solutions Architect certifications.",
      time: "2 hours ago",
      icon: Sparkles,
      iconColor: "text-brand-secondary"
    },
    {
      id: "act-3",
      title: "Trajectory Pathfinder Formulated",
      desc: "Generated custom milestone trajectory from Fullstack Engineer to Technical Lead.",
      time: "Yesterday",
      icon: TrendingUp,
      iconColor: "text-brand-tertiary"
    },
    {
      id: "act-4",
      title: "Profile Baseline Completed",
      desc: "Calibrated experience variables, active applications count, and baseline competencies.",
      time: "3 days ago",
      icon: UserCheck,
      iconColor: "text-emerald-400"
    }
  ];

  // Default trajectory nodes if none generated yet
  const defaultMilestones = [
    {
      title: "Fullstack Engineer (Current)",
      salary: "$115,000",
      skills: ["React/TypeScript", "Node.js", "SQL", "Git"],
      growth: "Steady",
      score: 98,
      status: "completed",
      timeframe: "Now",
      details: "Solid performance on product features, state management, and API design."
    },
    {
      title: "Senior Fullstack Engineer",
      salary: "$145,000",
      skills: ["System Design", "Cloud Infrastructure (AWS)", "Performance Tuning", "Mentoring"],
      growth: "High Demand (+18% YoY)",
      score: 87,
      status: "in-progress",
      timeframe: "12-18 Months",
      details: "Take ownership of full-system architecture, database optimization, and lead feature squads."
    },
    {
      title: "Technical Architect",
      salary: "$175,000",
      skills: ["Distributed Systems", "Kubernetes", "Enterprise Security", "Technical Strategy"],
      growth: "Extreme Demand (+24% YoY)",
      score: 74,
      status: "planned",
      timeframe: "3-5 Years",
      details: "Define enterprise-wide engineering standards, cross-team interfaces, and cloud topology blueprints."
    },
    {
      title: "Tech Lead / CTO",
      salary: "$210,000+",
      skills: ["Team Leadership", "Budgeting", "Product Roadmap Alignment", "Developer Relations"],
      growth: "Top Tier",
      score: 65,
      status: "planned",
      timeframe: "5-7 Years",
      details: "Formulate business-aligned tech strategies, build high-performing engineering cultures, and report directly to executive boards."
    }
  ];

  // Dynamic Trajectory check
  const activeMilestones = careerPathData && careerPathData.milestones && careerPathData.milestones.length > 0
    ? careerPathData.milestones.map((milestone: any, index: number) => ({
        title: milestone.title,
        salary: index === 0 ? "$115,000" : index === 1 ? "$145,000" : index === 2 ? "$170,000" : "$210,000+",
        skills: milestone.skillsToLearn || [],
        growth: index === 3 ? "Top Tier" : "High Growth",
        score: milestone.confidenceScore || 85,
        status: index === 0 ? "completed" : index === 1 ? "in-progress" : "planned",
        timeframe: milestone.timeframe || `Stage ${index + 1}`,
        details: milestone.description
      }))
    : defaultMilestones;

  // Selected trajectory node object
  const selectedNode = activeMilestones[selectedNodeIndex] || activeMilestones[0];

  // Default skill matrix comparing current vs target role
  const defaultSkills = [
    { name: "Frontend Architecture", current: 85, target: 95, gap: 10 },
    { name: "Distributed Systems", current: 40, target: 80, gap: 40 },
    { name: "Cloud Engineering (AWS/GCP)", current: 55, target: 85, gap: 30 },
    { name: "Team Mentoring", current: 60, target: 90, gap: 30 },
    { name: "Security & Compliance", current: 35, target: 75, gap: 40 },
    { name: "Business Alignment", current: 25, target: 70, gap: 45 }
  ];

  return (
    <div id="dashboard-tab" className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Welcome Panel with Dynamic Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#1d1f27] via-[#161821] to-[#0c0e16] border border-[#434655]/20 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-brand-primary-container/5 rounded-full blur-3xl"></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ffb596] bg-[#ffb596]/10 px-2.5 py-0.5 rounded border border-[#ffb596]/20">
              Co-Pilot Active Session
            </span>
            <span className="font-mono text-xs text-[#8d90a0] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-time UTC Sync</span>
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold font-sans tracking-tight text-white mt-2 flex items-center gap-2">
            <span>{greeting}, {profile.full_name || "Candidate"}</span>
            <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-sm text-[#c3c6d7] mt-1.5 max-w-2xl">
            You are currently mapping a transition trajectory from <span className="text-brand-primary font-semibold">{currentRole}</span> to <span className="text-brand-secondary font-semibold">{targetRole}</span>. AI Pathfinder compliance is exceptionally high.
          </p>
        </div>

        <button 
          id="btn-run-pathfinder"
          onClick={() => onNavigateToTab("pathfinder")}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-brand-primary-container text-white font-semibold text-sm hover:bg-[#1d4ed8] transition-all cursor-pointer shadow-md shadow-brand-primary-container/20 shrink-0 self-start md:self-center"
        >
          <span>Configure AI Pathfinder</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Premium "Get Started" Attention-Grabbing Banner */}
      {(profile.ats_score === 0 || profile.profile_completion === 0) && (
        <div className="p-6 rounded-2xl bg-[#ffb596]/10 border border-[#ffb596]/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-[#ffb596]/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffb596]/20 flex items-center justify-center text-[#ffb596] shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-base">Welcome to CareerPilot!</h3>
              <p className="text-xs text-[#c3c6d7] mt-1.5 leading-relaxed">
                Establish your profile metrics by uploading your resume. Unlock your AI match scores, customized trajectory paths, skill gap analysis, and interview simulations in seconds.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab("resume")}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffb596] to-brand-secondary text-[#0c0e16] font-bold text-xs hover:opacity-90 transition-all cursor-pointer shrink-0 self-start md:self-center shadow-md"
          >
            <span>Upload Resume Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* QUICK STUDENT STATISTIC CARDS (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* STAT 1: Resume ATS Score */}
        <div 
          id="stat-card-ats"
          onClick={() => onNavigateToTab("resume")}
          className="rounded-xl bg-[#1d1f27] border border-[#434655]/15 p-5 hover:border-brand-primary/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Resume ATS Score</span>
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{profile.ats_score}%</span>
            <span className="font-mono text-[10px] text-emerald-400 font-semibold">
              {profile.ats_score > 78 ? `+${profile.ats_score - 78}% improved` : "+6% improved"}
            </span>
          </div>
          <div className="mt-2.5 h-1.5 bg-[#11131b] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${profile.ats_score}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="text-[11px] text-[#8d90a0] mt-2 group-hover:text-white transition-colors flex items-center gap-0.5">
            <span>Diagnose resume gaps</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* STAT 2: Profile Completion % */}
        <div 
          id="stat-card-profile"
          className="rounded-xl bg-[#1d1f27] border border-[#434655]/15 p-5 hover:border-brand-secondary/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Profile Completion</span>
            <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 text-brand-secondary flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{profile.profile_completion}%</span>
            <span className="font-mono text-[10px] text-[#8d90a0]">Baseline parameters</span>
          </div>
          <div className="mt-2.5 h-1.5 bg-[#11131b] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${profile.profile_completion}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="text-[11px] text-[#8d90a0] mt-2">
            Experience levels validated
          </p>
        </div>

        {/* STAT 3: Active Applications */}
        <div 
          id="stat-card-applications"
          className="rounded-xl bg-[#1d1f27] border border-[#434655]/15 p-5 hover:border-brand-tertiary/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Active Applications</span>
            <div className="w-8 h-8 rounded-lg bg-brand-tertiary/10 text-brand-tertiary flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{profile.active_applications}</span>
            <span className="font-mono text-[10px] text-amber-400 font-semibold">
              {profile.active_applications > 0 ? "In review" : "Baseline"}
            </span>
          </div>
          <div className="mt-2.5 h-1.5 bg-[#11131b] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-tertiary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, profile.active_applications * 15)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="text-[11px] text-[#8d90a0] mt-2">
            {profile.active_applications > 0 ? "Across global tech firms" : "No active submissions"}
          </p>
        </div>

        {/* STAT 4: Identified Skill Gaps */}
        <div 
          id="stat-card-gaps"
          onClick={() => onNavigateToTab("pathfinder")}
          className="rounded-xl bg-[#1d1f27] border border-[#434655]/15 p-5 hover:border-rose-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0]">Identified Skill Gaps</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{profile.identified_gaps.length}</span>
            <span className="font-mono text-[10px] text-rose-400 font-semibold">Critical deficits</span>
          </div>
          <div className="mt-2.5 h-1.5 bg-[#11131b] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-rose-500/50 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, profile.identified_gaps.length * 15)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="text-[11px] text-[#8d90a0] mt-2 group-hover:text-white transition-colors flex items-center gap-0.5">
            <span>Calibrate Pathfinder matrices</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

      </div>

      {/* STUDENT ADVOCACY GRID: Recommended Internships & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RECOMMENDED PLACEMENTS & PRACTICAL PROJECTS (7 Columns) */}
        <div id="recommended-internships-card" className="lg:col-span-7 rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#434655]/10 pb-4 mb-4 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-primary-container/10 text-brand-primary flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
                </div>
                <div>
                  <h2 className="font-sans font-bold text-white text-base">
                    {activeSubTab === "internships" ? "Recommended Internships" : "Recommended Projects"}
                  </h2>
                  <p className="text-xs text-[#8d90a0]">
                    {activeSubTab === "internships" 
                      ? "Top global placement alignment based on your current skill sets." 
                      : "Strategic engineering tasks mapped to close target credential deficits."}
                  </p>
                </div>
              </div>
              
              {/* Segmented Control */}
              <div className="flex bg-[#11131b] p-0.5 rounded-lg border border-[#434655]/15 self-start sm:self-center">
                <button
                  id="tab-toggle-internships"
                  onClick={() => setActiveSubTab("internships")}
                  className={`px-3 py-1.5 rounded-md font-sans text-[11px] font-semibold transition-all cursor-pointer ${
                    activeSubTab === "internships"
                      ? "bg-[#1d1f27] text-white border border-[#434655]/15 shadow-sm"
                      : "text-[#8d90a0] hover:text-white"
                  }`}
                >
                  Internships
                </button>
                <button
                  id="tab-toggle-projects"
                  onClick={() => setActiveSubTab("projects")}
                  className={`px-3 py-1.5 rounded-md font-sans text-[11px] font-semibold transition-all cursor-pointer ${
                    activeSubTab === "projects"
                      ? "bg-[#1d1f27] text-white border border-[#434655]/15 shadow-sm"
                      : "text-[#8d90a0] hover:text-white"
                  }`}
                >
                  Practical Projects
                </button>
              </div>
            </div>

            {/* Render List based on Active Tab */}
            <div className="space-y-4">
              {activeSubTab === "internships" ? (
                mockInternships.map((intern) => (
                  <div 
                    key={intern.id}
                    className="p-4 rounded-xl bg-[#11131b] border border-[#434655]/15 hover:border-brand-primary/30 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={`px-2.5 py-1 rounded font-sans font-bold text-xs ${intern.logoBg}`}>
                          {intern.company}
                        </div>
                        <span className="font-mono text-[10px] bg-[#191b23] border border-[#434655]/30 text-[#c3c6d7] px-2 py-0.5 rounded">
                          {intern.compensation}
                        </span>
                        <span className="font-mono text-[10px] text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded">
                          {intern.matchScore}% Match
                        </span>
                      </div>

                      <h3 className="font-sans font-bold text-white text-sm group-hover:text-brand-primary transition-colors">
                        {intern.role}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-[#8d90a0]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{intern.location}</span>
                        </span>
                      </div>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {intern.skills.map((skill, sIdx) => (
                          <span 
                            key={sIdx}
                            className="font-mono text-[10px] text-[#c3c6d7] bg-[#191b23] px-2 py-0.5 rounded border border-[#434655]/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => onNavigateToTab("copilot")}
                      className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#191b23] hover:bg-[#282a32] border border-[#434655]/20 text-xs font-semibold text-white transition-all cursor-pointer self-stretch md:self-center shrink-0"
                    >
                      <span>Consult Coach</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#8d90a0]" />
                    </button>
                  </div>
                ))
              ) : (
                mockProjects.map((proj) => (
                  <div 
                    key={proj.id}
                    className="p-4 rounded-xl bg-[#11131b] border border-[#434655]/15 hover:border-brand-secondary/30 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={`px-2.5 py-1 rounded font-sans font-bold text-xs ${proj.logoBg}`}>
                          {proj.company}
                        </div>
                        <span className="font-mono text-[10px] bg-[#191b23] border border-[#434655]/30 text-[#c3c6d7] px-2 py-0.5 rounded">
                          {proj.compensation}
                        </span>
                        <span className="font-mono text-[10px] text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded">
                          {proj.matchScore}% Match
                        </span>
                      </div>

                      <h3 className="font-sans font-bold text-white text-sm group-hover:text-brand-secondary transition-colors">
                        {proj.role}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-[#8d90a0]">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{proj.location}</span>
                        </span>
                      </div>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {proj.skills.map((skill, sIdx) => (
                          <span 
                            key={sIdx}
                            className="font-mono text-[10px] text-[#c3c6d7] bg-[#191b23] px-2 py-0.5 rounded border border-[#434655]/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => onNavigateToTab("copilot")}
                      className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#191b23] hover:bg-[#282a32] border border-[#434655]/20 text-xs font-semibold text-white transition-all cursor-pointer self-stretch md:self-center shrink-0"
                    >
                      <span>Get Project Guide</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#8d90a0]" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-[#434655]/10 pt-4 flex items-center justify-between text-xs text-[#8d90a0]">
            <span>
              {activeSubTab === "internships" 
                ? "Showing matched internships in California & Remote" 
                : "Showing top recommended open-source templates"}
            </span>
            <button 
              onClick={() => onNavigateToTab("copilot")}
              className="text-brand-primary font-medium hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Explore all career options</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RECENT ACTIVITIES (5 Columns) */}
        <div id="recent-activities-card" className="lg:col-span-5 rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#434655]/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 text-brand-secondary flex items-center justify-center">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="font-sans font-bold text-white text-base">Recent Activities</h2>
                  <p className="text-xs text-[#8d90a0]">Audit history of student parameter modulations.</p>
                </div>
              </div>
              <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest font-semibold">
                TIMELINE
              </span>
            </div>

            {/* Timeline element structure */}
            <div className="relative pl-5 border-l border-[#434655]/20 space-y-5 py-2">
              {profile.ats_score === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#11131b] border border-[#434655]/20 flex items-center justify-center mx-auto text-[#8d90a0]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-xs text-white">No Activities Logged</h4>
                    <p className="font-sans text-[11px] text-[#8d90a0] max-w-xs mx-auto leading-relaxed">
                      Your timeline is empty. Upload your first resume to automatically log profile calibration events and matching scans!
                    </p>
                  </div>
                </div>
              ) : (
                mockActivities.map((act) => {
                  const IconComponent = act.icon;
                  return (
                    <div key={act.id} className="relative group">
                      
                      {/* Ring timeline point */}
                      <span className="absolute -left-[27px] top-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#1d1f27] border-2 border-[#434655] group-hover:border-brand-primary transition-colors"></span>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <IconComponent className={`w-3.5 h-3.5 ${act.iconColor}`} />
                            <span className="font-sans font-bold text-xs text-white group-hover:text-brand-primary transition-colors">
                              {act.title}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-[#8d90a0] shrink-0">
                            {act.time}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-[#c3c6d7] leading-relaxed">
                          {act.desc}
                        </p>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-[#434655]/10 pt-4 flex items-center justify-center">
            <button 
              onClick={() => onNavigateToTab("pathfinder")}
              className="font-sans text-xs font-semibold text-[#c3c6d7] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Refresh Control Hub Timeline</span>
              <Activity className="w-3.5 h-3.5 text-[#8d90a0]" />
            </button>
          </div>
        </div>

      </div>

      {/* Trajectory peak graph detail section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Alignment & Health */}
        <div className="lg:col-span-1 rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-sans font-semibold text-white text-base">Career Health Alignment</h2>
              <HelpCircle className="w-4 h-4 text-[#8d90a0] cursor-pointer" />
            </div>
            
            {/* Health Meter Radial SVG */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    className="stroke-[#11131b]" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    className="stroke-brand-primary" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="377"
                    strokeDashoffset={377 - (377 * profile.ats_score) / 100}
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                  <span className="font-sans text-3xl font-extrabold text-white">{profile.ats_score}%</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#8d90a0] mt-0.5">
                    {profile.ats_score >= 85 ? "Optimal Match" : "High Match"}
                  </span>
                </div>
              </div>
            </div>

            {/* Health metrics list */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#11131b] border border-[#434655]/10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="font-sans text-xs text-[#c3c6d7]">Market Skill Demand</span>
                </div>
                <span className="font-mono text-xs text-white font-bold">85% (High)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#11131b] border border-[#434655]/10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></span>
                  <span className="font-sans text-xs text-[#c3c6d7]">Target Role Gap</span>
                </div>
                <span className="font-mono text-xs text-white font-bold">{profile.identified_gaps.length} Missing Skills</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#11131b] border border-[#434655]/10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span className="font-sans text-xs text-[#c3c6d7]">ATS Compatibility</span>
                </div>
                <span className="font-mono text-xs text-white font-bold">{profile.ats_score}/100 Score</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#8d90a0] text-center font-mono mt-4">
            *Metrics recalculated using deep real-time ATS modeling.
          </p>
        </div>

        {/* Right Columns: Interactive Trajectory Graph */}
        <div className="lg:col-span-2 rounded-2xl bg-[#1d1f27] border border-[#434655]/15 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-sans font-semibold text-white text-base">Visual Transition Path</h2>
                <p className="text-xs text-[#8d90a0] mt-0.5">Click each node to analyze compensation and core skill requirements.</p>
              </div>
              <span className="font-mono text-[10px] text-brand-primary bg-brand-primary-container/20 px-2.5 py-1 rounded-md">
                Co-Pilot Generated
              </span>
            </div>

            {/* Trajectory Timeline Nodes (Visual Map) */}
            <div className="relative py-8 px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Central horizontal line for desktop */}
              <div className="hidden md:block absolute left-[12%] right-[12%] top-[40%] h-0.5 bg-[#434655]/20 -z-0"></div>
              
              {activeMilestones.map((node: any, idx: number) => {
                const isSelected = selectedNodeIndex === idx;
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedNodeIndex(idx)}
                    className="relative flex flex-col items-center text-center cursor-pointer group focus:outline-none z-10 w-full md:w-auto"
                  >
                    {/* Node Circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                          ? "bg-brand-primary text-surface-bg border-4 border-brand-primary-container/30" 
                          : node.status === "completed"
                            ? "bg-emerald-500 text-white"
                            : node.status === "in-progress"
                              ? "bg-brand-secondary text-surface-bg animate-pulse"
                              : "bg-[#191b23] text-[#8d90a0] border border-[#434655]/30 group-hover:border-[#c3c6d7]"
                      }`}
                    >
                      {node.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="font-mono text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Timeframe Chip */}
                    <span className="font-mono text-[10px] text-[#8d90a0] mt-2 group-hover:text-white transition-colors">
                      {node.timeframe}
                    </span>

                    {/* Title Text */}
                    <span className={`font-sans text-xs font-medium max-w-[120px] mt-1 line-clamp-1 ${
                      isSelected ? "text-brand-primary font-semibold" : "text-[#c3c6d7] group-hover:text-white"
                    }`}>
                      {node.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Node Info Card Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNodeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-4 p-5 rounded-xl bg-[#11131b] border border-[#434655]/15"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#434655]/10 pb-3 mb-3">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#8d90a0]">Milestone {selectedNodeIndex + 1} Profile</span>
                    <h3 className="font-sans font-bold text-white text-base mt-0.5">{selectedNode.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#2563eb]/10 border border-[#2563eb]/25 text-[#b4c5ff] px-2 py-1 rounded-md font-mono text-xs">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{selectedNode.salary} Avg</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#c3c0ff]/10 border border-[#c3c0ff]/25 text-[#c3c0ff] px-2 py-1 rounded-md font-mono text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Match Alignment {selectedNode.score}%</span>
                    </div>
                  </div>
                </div>

                <p className="font-sans text-sm text-[#c3c6d7] leading-relaxed mb-4">
                  {selectedNode.details}
                </p>

                {/* Prerequisite skills list */}
                <div>
                  <span className="font-mono text-[10px] text-[#8d90a0] uppercase tracking-wider block mb-2">Prerequisite Core Capabilities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.skills.map((skill: string, index: number) => (
                      <span 
                        key={index}
                        className="font-mono text-[11px] text-white bg-[#191b23] border border-[#434655]/20 px-2.5 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  );
}
