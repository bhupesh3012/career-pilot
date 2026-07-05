import React, { useState, useMemo } from "react";
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Plus, 
  Trash2, 
  X, 
  Building, 
  Check, 
  CheckCircle, 
  Sparkles, 
  ChevronRight,
  SlidersHorizontal,
  PlusCircle,
  HelpCircle,
  Info,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { calculateMatchingScore } from "../utils/matchingAlgorithm";

export interface Internship {
  id: string;
  role: string;
  company: string;
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  stipend: number; // monthly USD
  requiredSkills: string[];
  logoBg: string;
}

const DEFAULT_INTERNSHIPS: Internship[] = [
  {
    id: "intern-1",
    role: "Backend Engineering Intern",
    company: "Stripe",
    location: "Remote, US",
    mode: "Remote",
    stipend: 9000,
    requiredSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "RESTful API Design"],
    logoBg: "bg-indigo-500/10 text-indigo-400"
  },
  {
    id: "intern-2",
    role: "Frontend React Developer",
    company: "Meta",
    location: "Menlo Park, CA",
    mode: "On-site",
    stipend: 7500,
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Git", "GitHub"],
    logoBg: "bg-blue-500/10 text-blue-400"
  },
  {
    id: "intern-3",
    role: "Cloud Infrastructure & SecOps Intern",
    company: "Amazon Web Services",
    location: "Seattle, WA",
    mode: "Hybrid",
    stipend: 6500,
    requiredSkills: ["Docker basics", "Git", "Node.js", "RESTful API Design"],
    logoBg: "bg-amber-500/10 text-amber-500"
  },
  {
    id: "intern-4",
    role: "Core Database Systems Intern",
    company: "Snowflake",
    location: "San Mateo, CA",
    mode: "On-site",
    stipend: 8500,
    requiredSkills: ["C++", "PostgreSQL", "Git", "Node.js"],
    logoBg: "bg-sky-500/10 text-sky-400"
  },
  {
    id: "intern-5",
    role: "Fullstack Engineering Intern",
    company: "Vercel",
    location: "Remote, US",
    mode: "Remote",
    stipend: 8000,
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express"],
    logoBg: "bg-pink-500/10 text-pink-400"
  }
];

const DEFAULT_USER_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "RESTful API Design",
  "PostgreSQL",
  "Git",
  "GitHub",
  "Tailwind CSS"
];

export default function InternshipsPage() {
  const [viewMode, setViewMode] = useState<"student" | "admin">("student");
  const [internships, setInterships] = useState<Internship[]>(DEFAULT_INTERNSHIPS);
  const [userSkills, setUserSkills] = useState<string[]>(DEFAULT_USER_SKILLS);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedMode, setSelectedMode] = useState<"All" | "Remote" | "Hybrid" | "On-site">("All");
  const [minStipend, setMinStipend] = useState(0);

  // Modal / Add Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newMode, setNewMode] = useState<"Remote" | "Hybrid" | "On-site">("Remote");
  const [newStipend, setNewStipend] = useState<number>(6000);
  const [newSkillsRaw, setNewSkillsRaw] = useState("");
  const [addError, setAddError] = useState("");

  // Application & Skills states
  const [appliedInternshipIds, setAppliedInternshipIds] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [applicationSuccess, setApplicationSuccess] = useState<string | null>(null);

  // Extract unique locations for the dropdown
  const locations = useMemo(() => {
    const list = new Set<string>();
    internships.forEach(item => {
      // Clean up state/country to get a simplified location name
      const parts = item.location.split(",");
      const loc = parts[parts.length - 1].trim();
      list.add(loc);
    });
    return ["All", ...Array.from(list)];
  }, [internships]);

  // Client-side filtering logic
  const filteredInternships = useMemo(() => {
    return internships.filter(item => {
      const matchesSearch = 
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requiredSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation = 
        selectedLocation === "All" || 
        item.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesMode = 
        selectedMode === "All" || 
        item.mode === selectedMode;

      const matchesStipend = item.stipend >= minStipend;

      return matchesSearch && matchesLocation && matchesMode && matchesStipend;
    });
  }, [internships, searchQuery, selectedLocation, selectedMode, minStipend]);

  // Handle Application submission
  const handleApply = (internshipId: string, company: string, role: string) => {
    if (appliedInternshipIds.includes(internshipId)) return;
    
    setAppliedInternshipIds(prev => [...prev, internshipId]);
    setApplicationSuccess(`Application submitted successfully to ${company} for the ${role} position!`);
    
    setTimeout(() => {
      setApplicationSuccess(null);
    }, 4000);
  };

  // Add new skill to profile list
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = newSkillInput.trim();
    if (cleanSkill && !userSkills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
      setUserSkills(prev => [...prev, cleanSkill]);
      setNewSkillInput("");
    }
  };

  // Delete skill from profile
  const handleDeleteSkill = (skillToDelete: string) => {
    setUserSkills(prev => prev.filter(s => s !== skillToDelete));
  };

  // Create new internship
  const handleCreateInternship = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    if (!newRole.trim()) {
      setAddError("Role title is required");
      return;
    }
    if (!newCompany.trim()) {
      setAddError("Company name is required");
      return;
    }
    if (!newLocation.trim()) {
      setAddError("Location is required");
      return;
    }

    const parsedSkills = newSkillsRaw
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (parsedSkills.length === 0) {
      setAddError("Please enter at least one required skill");
      return;
    }

    const bgs = [
      "bg-emerald-500/10 text-emerald-400",
      "bg-purple-500/10 text-purple-400",
      "bg-pink-500/10 text-pink-400",
      "bg-blue-500/10 text-blue-400",
      "bg-indigo-500/10 text-indigo-400"
    ];
    const randomBg = bgs[Math.floor(Math.random() * bgs.length)];

    const newInternship: Internship = {
      id: `intern-${Date.now()}`,
      role: newRole.trim(),
      company: newCompany.trim(),
      location: newLocation.trim(),
      mode: newMode,
      stipend: newStipend,
      requiredSkills: parsedSkills,
      logoBg: randomBg
    };

    setInterships(prev => [newInternship, ...prev]);
    setIsAddModalOpen(false);

    // Reset fields
    setNewRole("");
    setNewCompany("");
    setNewLocation("");
    setNewMode("Remote");
    setNewStipend(6000);
    setNewSkillsRaw("");
  };

  // Delete internship (Admin only)
  const handleDeleteInternship = (id: string) => {
    if (window.confirm("Are you sure you want to remove this internship posting?")) {
      setInterships(prev => prev.filter(item => item.id !== id));
      if (appliedInternshipIds.includes(id)) {
        setAppliedInternshipIds(prev => prev.filter(item => item !== id));
      }
    }
  };

  return (
    <div id="internships-tab-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#8d90a0]">Placement Matrix</span>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-primary" />
            <span>AI-Driven Internship Matcher</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#c3c6d7] mt-1.5">
            Discover matched global placements, analyze real-time skill intersections, and apply directly.
          </p>
        </div>

        {/* View Switcher (Segmented Control) */}
        <div className="flex bg-[#11131b] p-1 rounded-xl border border-slate-200 dark:border-[#434655]/15 self-start">
          <button
            id="btn-switch-student-view"
            onClick={() => setViewMode("student")}
            className={`px-4 py-2 rounded-lg font-sans text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "student"
                ? "bg-[#1d1f27] text-white border border-[#434655]/15 shadow-sm"
                : "text-[#8d90a0] hover:text-white"
            }`}
          >
            <span>Student Hub</span>
          </button>
          <button
            id="btn-switch-admin-view"
            onClick={() => setViewMode("admin")}
            className={`px-4 py-2 rounded-lg font-sans text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "admin"
                ? "bg-[#1d1f27] text-white border border-[#434655]/15 shadow-sm"
                : "text-[#8d90a0] hover:text-white"
            }`}
          >
            <span>Admin Console</span>
          </button>
        </div>
      </div>

      {/* Real-time Toast Application Alerts */}
      <AnimatePresence>
        {applicationSuccess && (
          <motion.div
            id="toast-application-success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 shadow-md"
          >
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="font-sans text-sm font-medium">{applicationSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STUDENT HUB VIEW */}
      {viewMode === "student" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SEARCH FILTERS PANEL (Left Side - 3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Filters Container */}
            <div className="rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-5 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
                <h3 className="font-sans font-bold text-slate-950 dark:text-white text-sm">Custom Search Filters</h3>
              </div>

              {/* Text Search */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">Role, Firm, or Skill</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="filter-search-query"
                    type="text"
                    placeholder="Search placement..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
              </div>

              {/* Location Select */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">Location Area</label>
                <select
                  id="filter-location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none"
                >
                  {locations.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc === "All" ? "All Locations" : loc}</option>
                  ))}
                </select>
              </div>

              {/* Mode Select */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">Work Setup Mode</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["All", "Remote", "Hybrid", "On-site"] as const).map((mode) => (
                    <button
                      id={`filter-mode-${mode}`}
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`py-1.5 rounded text-[10px] font-mono uppercase tracking-wide transition-colors ${
                        selectedMode === mode 
                          ? "bg-brand-primary text-white font-bold" 
                          : "bg-slate-100 dark:bg-[#11131b] text-slate-600 dark:text-[#8d90a0] hover:text-white hover:bg-slate-200 dark:hover:bg-[#191b23]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Stipend Range */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">
                  <span>Min Monthly Stipend</span>
                  <span className="text-brand-primary font-bold font-sans">${minStipend.toLocaleString()}</span>
                </div>
                <input
                  id="filter-stipend-slider"
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={minStipend}
                  onChange={(e) => setMinStipend(Number(e.target.value))}
                  className="w-full accent-brand-primary h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[8px] text-slate-400">
                  <span>$0</span>
                  <span>$5,000</span>
                  <span>$10,000</span>
                </div>
              </div>

            </div>

            {/* MY SKILLS PROFILE ACCORDION (FOR RE-CALCULATING LIVE MATCHES) */}
            <div className="rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-secondary animate-pulse" />
                  <h3 className="font-sans font-bold text-slate-950 dark:text-white text-sm">My Skills Profile</h3>
                </div>
                <span className="font-mono text-[10px] text-brand-secondary bg-brand-secondary/10 px-1.5 py-0.5 rounded font-bold">
                  {userSkills.length} SKILLS
                </span>
              </div>

              <p className="font-sans text-[11px] text-slate-500 dark:text-[#8d90a0] leading-relaxed">
                Add or delete skills below to watch matching percentages of all internships recalculate instantly.
              </p>

              {/* Add Skill form */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  id="input-skill-add"
                  type="text"
                  placeholder="e.g., Python"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  id="btn-add-profile-skill"
                  type="submit"
                  className="px-2.5 py-1.5 rounded-md bg-brand-primary hover:bg-brand-primary-container text-white text-xs font-semibold cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Skills Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                {userSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 font-mono text-[10px] text-slate-700 dark:text-[#c3c6d7] bg-slate-100 dark:bg-[#11131b] pl-2 pr-1 py-0.5 rounded-md border border-slate-200/50 dark:border-[#434655]/10"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill)}
                      className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>

            </div>

          </div>

          {/* INTERNSHIP CARDS GRID (Right Side - 9 Columns) */}
          <div className="lg:col-span-9 space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-[#8d90a0]">
                Showing {filteredInternships.length} Available Placements
              </span>
              <span className="font-mono text-[10px] text-[#8d90a0]">
                Sorted by alignment score
              </span>
            </div>

            {filteredInternships.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-[#434655]/20 p-12 text-center bg-[#1d1f27]/10 dark:bg-[#1d1f27]/30">
                <Info className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base">No Matching Internships Found</h3>
                <p className="text-xs text-slate-500 dark:text-[#8d90a0] mt-1.5 max-w-sm mx-auto">
                  No listings matched your criteria. Try loosening search terms or adjusting the minimum monthly stipend.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInternships.map((item) => {
                  const matchScore = calculateMatchingScore(userSkills, item.requiredSkills);
                  const isApplied = appliedInternshipIds.includes(item.id);

                  // Color gradient or tone depending on score tier
                  let scoreColor = "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                  if (matchScore < 50) {
                    scoreColor = "text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20";
                  } else if (matchScore < 80) {
                    scoreColor = "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
                  }

                  return (
                    <motion.div
                      id={`internship-card-${item.id}`}
                      key={item.id}
                      layout
                      className="rounded-2xl bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/15 p-5 shadow-sm hover:shadow-md hover:border-brand-primary/30 dark:hover:border-brand-primary/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Title, Badge & Meta */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`px-2 py-1 rounded font-sans font-extrabold text-[11px] uppercase tracking-wide shrink-0 ${item.logoBg}`}>
                              {item.company}
                            </div>
                            <span className="font-mono text-[9px] text-[#8d90a0] bg-slate-100 dark:bg-[#11131b] px-2 py-0.5 rounded uppercase font-semibold">
                              {item.mode}
                            </span>
                          </div>

                          {/* Match Badge */}
                          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${scoreColor}`}>
                            {matchScore}% Match
                          </span>
                        </div>

                        {/* Role Title */}
                        <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base mt-3.5 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                          {item.role}
                        </h3>

                        {/* Location and Stipend */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-xs text-slate-600 dark:text-[#8d90a0]">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.location}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">${item.stipend.toLocaleString()} / mo</span>
                          </span>
                        </div>

                        {/* Required Skills list */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-[#434655]/10">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-2 font-bold">Required Credentials:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.requiredSkills.map((skill, sIdx) => {
                              const isSkillMatched = userSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                              return (
                                <span
                                  key={sIdx}
                                  className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-colors ${
                                    isSkillMatched
                                      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/10 font-medium"
                                      : "text-slate-500 dark:text-[#8d90a0] bg-slate-50 dark:bg-[#191b23] border-slate-200 dark:border-[#434655]/10"
                                  }`}
                                >
                                  {skill}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Action Apply Button */}
                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#434655]/10 flex items-center justify-between gap-3">
                        <div className="text-[10px] font-sans text-slate-500 dark:text-[#8d90a0] flex items-center gap-1">
                          <Info className="w-3 h-3 text-slate-400" />
                          <span>Fast-track available</span>
                        </div>
                        
                        <button
                          id={`btn-apply-internship-${item.id}`}
                          onClick={() => handleApply(item.id, item.company, item.role)}
                          disabled={isApplied}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                            isApplied
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default"
                              : "bg-brand-primary hover:bg-brand-primary-container text-white border border-brand-primary/20 shadow-sm"
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied</span>
                            </>
                          ) : (
                            <span>Quick Apply</span>
                          )}
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ADMIN CONSOLE VIEW */}
      {viewMode === "admin" && (
        <div className="space-y-6">
          
          {/* Controls line */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base">Active Postings Directory</h3>
              <p className="text-xs text-[#8d90a0]">Configure parameters for recommended placement vectors.</p>
            </div>

            <button
              id="btn-open-add-modal"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-container text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Internship</span>
            </button>
          </div>

          {/* List/Table of Postings */}
          <div className="rounded-2xl border border-slate-200 dark:border-[#434655]/15 bg-white dark:bg-[#1d1f27] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-slate-50 dark:bg-[#11131b] border-b border-slate-200 dark:border-[#434655]/10 font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">
                  <tr>
                    <th className="p-4">Internship Post</th>
                    <th className="p-4">Location Setup</th>
                    <th className="p-4">Stipend</th>
                    <th className="p-4">Skills Mandated</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-white">
                  {internships.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-[#191b23]/30 transition-colors">
                      {/* Name/Company */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`px-2.5 py-1 rounded font-sans font-extrabold text-[10px] ${item.logoBg}`}>
                            {item.company}
                          </div>
                          <div>
                            <span className="font-bold text-sm block">{item.role}</span>
                            <span className="font-mono text-[10px] text-slate-400">ID: {item.id}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Location & Mode */}
                      <td className="p-4">
                        <div>
                          <span className="font-semibold block">{item.location}</span>
                          <span className="font-mono text-[10px] text-[#8d90a0] uppercase">{item.mode}</span>
                        </div>
                      </td>

                      {/* Monthly Stipend */}
                      <td className="p-4 font-bold font-mono text-sm text-brand-primary dark:text-brand-primary">
                        ${item.stipend.toLocaleString()} / mo
                      </td>

                      {/* Required Skills tags */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[280px]">
                          {item.requiredSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="font-mono text-[9px] text-[#c3c6d7] bg-slate-100 dark:bg-[#11131b] px-1.5 py-0.5 rounded border border-[#434655]/10"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <button
                          id={`btn-delete-internship-${item.id}`}
                          onClick={() => handleDeleteInternship(item.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete posting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {internships.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-[#8d90a0] font-sans">
                No active postings found. Click "+ Add New Internship" to generate one.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ADD NEW INTERNSHIP MODAL DIALOG */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div id="modal-add-internship-backdrop" className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <motion.div
              id="modal-add-internship-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#1d1f27] border border-slate-200 dark:border-[#434655]/20 rounded-2xl p-6 w-full max-w-lg shadow-xl relative text-slate-900 dark:text-white"
            >
              {/* Close Button */}
              <button
                id="btn-close-add-modal"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-sans font-bold text-lg">Add New Internship Posting</h3>
              </div>

              {addError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <span>{addError}</span>
                </div>
              )}

              {/* Form fields */}
              <form onSubmit={handleCreateInternship} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">Role Title</label>
                    <input
                      id="input-add-role"
                      type="text"
                      placeholder="e.g., Software Dev Intern"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">Company Name</label>
                    <input
                      id="input-add-company"
                      type="text"
                      placeholder="e.g., Google"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">Location Area</label>
                    <input
                      id="input-add-location"
                      type="text"
                      placeholder="e.g., Mountain View, CA"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">Work Setup Mode</label>
                    <select
                      id="select-add-mode"
                      value={newMode}
                      onChange={(e) => setNewMode(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">Monthly Stipend (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      id="input-add-stipend"
                      type="number"
                      placeholder="6000"
                      value={newStipend}
                      onChange={(e) => setNewStipend(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#8d90a0]">Required Skill Tags</label>
                    <span className="font-mono text-[8px] text-[#8d90a0]">Comma-separated</span>
                  </div>
                  <input
                    id="input-add-skills"
                    type="text"
                    placeholder="React, TypeScript, Postgres, Docker"
                    value={newSkillsRaw}
                    onChange={(e) => setNewSkillsRaw(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-[#434655]/20 bg-slate-50 dark:bg-[#11131b] text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    id="btn-cancel-add-internship"
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#191b23] text-xs font-semibold cursor-pointer text-slate-700 dark:text-[#c3c6d7]"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-submit-add-internship"
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-container text-white text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Create Post
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
