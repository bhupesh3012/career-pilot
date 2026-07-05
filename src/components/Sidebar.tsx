import React from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  User,
  LogOut,
  Sliders,
  Sun,
  Moon,
  Briefcase,
  HelpCircle
} from "lucide-react";
import { motion } from "motion/react";
import { useProfile } from "../context/ProfileContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  theme,
  setTheme
}: SidebarProps) {
  const { profile } = useProfile();

  // Resolve display name: prefer profile.full_name, fall back to the part of
  // the email before "@", and finally to a generic label for unauthenticated states.
  const displayName = profile.full_name?.trim()
    || (profile.email ? profile.email.split("@")[0] : "")
    || "Guest Student";
  const displayEmail = profile.email?.trim() || "—";
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Overview & Analytics" },
    { id: "pathfinder", label: "AI Pathfinder", icon: TrendingUp, desc: "Milestone Trajectories" },
    { id: "copilot", label: "AI Co-Pilot", icon: MessageSquare, desc: "Direct Advisory Chat" },
    { id: "resume", label: "Resume Tailor", icon: FileText, desc: "ATS Gap Optimization" },
    { id: "internships", label: "Internships", icon: Briefcase, desc: "AI Match & Placements" },
    { id: "interview", label: "Interview Prep", icon: HelpCircle, desc: "AI Question Practice" },
  ];

  return (
    <motion.aside 
      id="sidebar-container"
      animate={{ width: isCollapsed ? "72px" : "280px" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col h-screen bg-[#0c0e16] border-r border-[#434655]/20 shrink-0 text-[#e1e2ed] z-20"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#434655]/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary-container to-brand-secondary text-surface-bg shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="font-sans font-bold tracking-tight text-white text-base">CareerPilot</span>
              <span className="font-mono text-[9px] text-[#8d90a0] uppercase tracking-widest">Co-Pilot v1.2</span>
            </motion.div>
          )}
        </div>
        
        {/* Collapse Toggle Button */}
        <button 
          id="toggle-sidebar"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-[#191b23] hover:bg-[#282a32] border border-[#434655]/30 text-[#c3c6d7] transition-colors absolute -right-3 top-5"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav id="sidebar-nav" className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-lg text-left transition-all group relative ${
                isActive 
                  ? "bg-[#1d1f27] text-white border-l-2 border-brand-primary" 
                  : "text-[#c3c6d7] hover:text-white hover:bg-[#191b23]/60"
              }`}
            >
              <div className={`shrink-0 transition-colors ${isActive ? "text-brand-primary" : "text-[#8d90a0] group-hover:text-[#c3c6d7]"}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-sm font-medium tracking-tight truncate">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] text-[#8d90a0] truncate mt-0.5 font-normal">
                    {item.desc}
                  </span>
                </div>
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-[#1d1f27] border border-[#434655]/20 text-white text-xs px-2.5 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-lg">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-[10px] text-[#8d90a0] mt-0.5">{item.desc}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Switcher */}
      <div className="px-3 py-2 border-t border-[#434655]/10 bg-[#0c0e16]/80 shrink-0">
        {isCollapsed ? (
          <button
            id="sidebar-theme-toggle-compact"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full h-10 rounded-lg bg-[#191b23]/60 hover:bg-[#191b23] flex items-center justify-center text-[#c3c6d7] hover:text-white transition-all cursor-pointer border border-[#434655]/10"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#ffb596]" />
            ) : (
              <Moon className="w-4 h-4 text-[#2563eb]" />
            )}
          </button>
        ) : (
          <div className="flex bg-[#11131b] p-1 rounded-lg border border-[#434655]/15 w-full items-center">
            <button
              id="theme-select-dark"
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-[#1d1f27] text-white border border-[#434655]/15 shadow-sm"
                  : "text-[#8d90a0] hover:text-white"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              id="theme-select-light"
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-[#ffffff] text-[#0f172a] border border-slate-200 shadow-sm"
                  : "text-[#8d90a0] hover:text-white"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Profile Section */}
      <div className="p-3 border-t border-[#434655]/10 bg-[#0c0e16]">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-[#191b23]/30">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary-container/20 text-brand-primary shrink-0">
            <User className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-xs font-medium text-white truncate">{displayName}</span>
              <span className="font-mono text-[10px] text-[#8d90a0] truncate">{displayEmail}</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
