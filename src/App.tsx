import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CareerPathGenerator from "./components/CareerPathGenerator";
import CoPilotChat from "./components/CoPilotChat";
import ResumeOptimizer from "./components/ResumeOptimizer";
import InternshipsPage from "./components/InternshipsPage";
import InterviewPrep from "./components/InterviewPrep";
import Auth from "./components/Auth";
import { CareerPathData } from "./types";
import { Compass, Sparkles, LogOut } from "lucide-react";
import { useProfile } from "./context/ProfileContext";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  
  // Shared global state for current vs target transition
  const [currentRole, setCurrentRole] = useState<string>("Fullstack Developer");
  const [targetRole, setTargetRole] = useState<string>("Technical Lead");
  const [careerPathData, setCareerPathData] = useState<CareerPathData | null>(null);

  const { resetProfile, setProfileIdentity } = useProfile();

  // Toggle light class on document root based on theme state
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
      document.body.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.body.classList.remove("light");
    }
  }, [theme]);

  // Helper to change tab from within other panels
  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLoginSuccess = (email: string, name: string, role: string, isSignUp: boolean) => {
    setTargetRole(role);
    setIsLoggedIn(true);
    // Reset metrics first (clears previous user's data), then stamp the
    // new user's identity so every context consumer gets the right name/email.
    resetProfile(isSignUp);
    setProfileIdentity(name, email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("dashboard");
  };

  if (!isLoggedIn) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-bg text-on-surface">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Panel Viewport */}
      <main id="main-content-viewport" className="flex-1 flex flex-col h-full overflow-hidden bg-[#11131b]">
        
        {/* Top Minimal Utility Line */}
        <header className="h-16 border-b border-[#434655]/10 flex items-center justify-between px-6 shrink-0 bg-[#0c0e16]/40">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-brand-primary" />
            <span className="font-mono text-xs text-[#8d90a0] uppercase tracking-wider">
              {activeTab === "dashboard" && "Workspace Hub / Overview"}
              {activeTab === "pathfinder" && "Workspace Hub / AI Pathfinder"}
              {activeTab === "copilot" && "Workspace Hub / AI Co-Pilot"}
              {activeTab === "resume" && "Workspace Hub / Resume Tailor"}
              {activeTab === "internships" && "Workspace Hub / Placements Matrix"}
              {activeTab === "interview" && "Workspace Hub / Interview Simulator"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-[10px] text-white/50 tracking-wide uppercase">AI Sandbox Connected</span>
            </div>
            
            <button 
              id="header-logout-btn"
              onClick={handleLogout}
              className="flex items-center gap-1.5 font-mono text-[10px] text-[#8d90a0] hover:text-[#ffb596] border border-[#434655]/20 hover:border-[#ffb596]/30 px-2.5 py-1 rounded bg-[#191b23]/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>LOGOUT</span>
            </button>
          </div>
        </header>

        {/* Scrollable Workspace Panels */}
        <div className="flex-1 overflow-y-auto bg-surface-bg">
          {activeTab === "dashboard" && (
            <Dashboard 
              currentRole={currentRole} 
              targetRole={targetRole} 
              onNavigateToTab={handleNavigateToTab}
              careerPathData={careerPathData}
            />
          )}

          {activeTab === "pathfinder" && (
            <CareerPathGenerator 
              currentRole={currentRole}
              setCurrentRole={setCurrentRole}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              careerPathData={careerPathData}
              setCareerPathData={setCareerPathData}
            />
          )}

          {activeTab === "copilot" && (
            <CoPilotChat 
              currentRole={currentRole} 
              targetRole={targetRole} 
            />
          )}

          {activeTab === "resume" && (
            <ResumeOptimizer 
              currentRole={currentRole} 
              targetRole={targetRole} 
              onNavigateToTab={handleNavigateToTab}
            />
          )}

          {activeTab === "internships" && (
            <InternshipsPage />
          )}

          {activeTab === "interview" && (
            <InterviewPrep />
          )}
        </div>

      </main>
      
    </div>
  );
}
