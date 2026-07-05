import React, { useState } from "react";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Compass, 
  Globe, 
  ShieldCheck, 
  Check, 
  ArrowLeft,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthProps {
  onLoginSuccess: (userEmail: string, userName: string, targetRole: string, isSignUp: boolean) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [targetRole, setTargetRole] = useState<string>("Technical Lead");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  const targetRolesPreset = [
    "Technical Lead",
    "Solutions Architect",
    "Director of Engineering",
    "Principal Fullstack Architect",
    "CTO / Tech Founder"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentic security handshake
    setTimeout(() => {
      setLoading(false);
      setSuccessAnimation(true);
      setTimeout(() => {
        onLoginSuccess(email, isSignUp ? name : email.split("@")[0], targetRole, isSignUp);
      }, 800);
    }, 1200);
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess("guest@careerpilot.app", "Guest Student", "Technical Lead", false);
    }, 500);
  };

  return (
    <div id="auth-split-screen" className="min-h-screen w-screen flex bg-[#0c0e16] text-[#e1e2ed] overflow-hidden select-none">
      
      {/* LEFT PANEL: Interactive High-Fidelity Form Column */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 md:p-12 bg-[#0c0e16] border-r border-[#434655]/15 relative z-10">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary-container to-brand-secondary text-surface-bg shadow-lg shadow-brand-primary-container/20">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold tracking-tight text-white text-lg">CareerPilot</span>
            <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest font-semibold">Strategic Executive Advisor</span>
          </div>
        </div>

        {/* Content Body Form */}
        <div className="my-auto max-w-md w-full mx-auto py-8">
          <AnimatePresence mode="wait">
            {!successAnimation ? (
              <motion.div
                key={isSignUp ? "signup" : "login"}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                    {isSignUp ? "Create your pilot profile" : "Consult your co-pilot"}
                  </h1>
                  <p className="text-sm text-[#8d90a0] mt-1.5 leading-relaxed">
                    {isSignUp 
                      ? "Establish your baseline parameters to map your custom milestone trajectory." 
                      : "Enter your credentials to access career intelligence dashboards."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0] flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Candidate Name</span>
                      </label>
                      <input
                        id="auth-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="off"
                        className="font-sans text-sm text-white bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg px-3.5 py-3 transition-all focus:ring-2 focus:ring-brand-primary/10"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0] flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>Corporate Email Address</span>
                    </label>
                    <input
                      id="auth-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className="font-sans text-sm text-white bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg px-3.5 py-3 transition-all focus:ring-2 focus:ring-brand-primary/10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Security Keyphrase</span>
                    </label>
                    <input
                      id="auth-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a secure passphrase"
                      autoComplete="new-password"
                      className="font-sans text-sm text-white bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg px-3.5 py-3 transition-all focus:ring-2 focus:ring-brand-primary/10"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-[#8d90a0] flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>Primary Target Executive Role</span>
                    </label>
                    <select
                      id="auth-role-select"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="font-sans text-sm text-white bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-lg px-3.5 py-3 transition-all cursor-pointer"
                    >
                      {targetRolesPreset.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Agree Terms check */}
                  <div className="flex items-center gap-2 py-1">
                    <input 
                      id="auth-agree-terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 text-brand-primary-container bg-[#11131b] border-[#434655]/30 rounded focus:ring-brand-primary-container"
                    />
                    <label htmlFor="auth-agree-terms" className="font-sans text-xs text-[#8d90a0] cursor-pointer">
                      I agree to the secure <span className="text-white hover:underline">CareerPilot Terms of Service</span>
                    </label>
                  </div>

                  {/* Action Handshake button */}
                  <button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={loading || !agreeTerms}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-lg bg-brand-primary-container hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-sans text-sm font-semibold transition-all cursor-pointer shadow-md shadow-brand-primary-container/20"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="font-mono text-xs uppercase tracking-wider">Establishing Connection Handshake...</span>
                      </>
                    ) : (
                      <>
                        <span>{isSignUp ? "Establish Trajectory Profile" : "Authenticate Co-Pilot Advisory"}</span>
                        <ArrowRight className="w-4 h-4 text-[#eeefff]" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch between log in & sign up */}
                <div className="text-center pt-2">
                  <p className="font-sans text-xs text-[#8d90a0]">
                    {isSignUp ? "Already registered with CareerPilot?" : "New to our executive career model?"}{" "}
                    <button
                      id="auth-toggle-mode"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-brand-primary font-medium hover:underline cursor-pointer"
                    >
                      {isSignUp ? "Access existing account" : "Create standard profile"}
                    </button>
                  </p>
                </div>

                {/* Divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#434655]/10"></div>
                  <span className="flex-shrink mx-4 font-mono text-[9px] uppercase tracking-widest text-[#8d90a0]">Strategic Alternative</span>
                  <div className="flex-grow border-t border-[#434655]/10"></div>
                </div>

                {/* Log in as Guest immediately */}
                <button
                  id="auth-guest-btn"
                  onClick={handleGuestLogin}
                  className="w-full py-3 rounded-lg bg-[#191b23] hover:bg-[#282a32] border border-[#434655]/15 font-sans text-xs font-semibold text-[#c3c6d7] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>Continue as Guest</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-white">Credentials Cleared</h3>
                  <p className="font-mono text-xs uppercase tracking-wider text-brand-primary animate-pulse">Launching CareerPilot Control deck...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info line */}
        <div className="flex items-center justify-between border-t border-[#434655]/10 pt-4 shrink-0 font-mono text-[9px] text-[#8d90a0]">
          <span>© 2026 CareerPilot Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>256-bit Secure TLS</span>
          </span>
        </div>

      </div>

      {/* RIGHT PANEL: Sleek, High-Fidelity Product Showcase (Linear / Vercel style) */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-b from-[#11131b] via-[#0c0e16] to-[#08090f] relative items-center justify-center p-12 overflow-hidden">
        
        {/* Decorative Grid Lines Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-lg space-y-8 relative z-10">
          
          {/* Aesthetic Mockup Box: CareerPilot Transition Trajectory */}
          <div className="rounded-2xl border border-[#434655]/20 bg-[#1d1f27]/80 backdrop-blur-md p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary-container/10 rounded-full blur-2xl"></div>
            
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-[#434655]/10 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-mono text-[10px] text-[#8d90a0] ml-2">co-pilot-analyzer.sh</span>
              </div>
              <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2 py-0.5 rounded">
                Live Trajectory Peak
              </span>
            </div>

            {/* Mock Graph Trajectory Progression */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#11131b] border border-[#434655]/30 text-brand-primary flex items-center justify-center font-mono text-xs font-bold">1</div>
                <div>
                  <span className="font-sans text-xs text-white font-semibold">Fullstack Engineer</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[9px] text-[#8d90a0]">COMPENSATION</span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">$115k</span>
                  </div>
                </div>
              </div>

              <div className="w-0.5 h-6 bg-brand-primary-container/30 ml-4"></div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#11131b] border border-brand-primary text-[#0c0e16] bg-brand-primary flex items-center justify-center font-mono text-xs font-bold shadow-lg shadow-brand-primary/20">2</div>
                <div>
                  <span className="font-sans text-xs text-brand-primary font-semibold">Senior Solutions Architect</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[9px] text-[#8d90a0]">COMPENSATION</span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">$165k Avg</span>
                  </div>
                </div>
              </div>

              <div className="w-0.5 h-6 bg-brand-primary-container/30 ml-4 animate-pulse"></div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#11131b] border border-[#434655]/20 text-[#8d90a0] flex items-center justify-center font-mono text-xs font-bold">3</div>
                <div>
                  <span className="font-sans text-xs text-[#8d90a0]">Director of Technology</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[9px] text-[#8d90a0]">COMPENSATION</span>
                    <span className="font-mono text-[10px] text-emerald-400/50 font-bold">$220k+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing ATS Meter Inside Mockup */}
            <div className="mt-5 p-3.5 bg-[#11131b] border border-[#434655]/15 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary animate-ping"></div>
                <div>
                  <div className="font-sans text-xs font-bold text-white">Target ATS Keyword Sync</div>
                  <div className="font-mono text-[9px] text-[#8d90a0] mt-0.5">Distributed systems + Event-driven AWS profiles</div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded">
                +42% Match
              </span>
            </div>
          </div>

          {/* Inspirational text blocks */}
          <div className="space-y-3 text-left">
            <span className="font-mono text-xs text-brand-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>SaaS-Engineered Precision</span>
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans max-w-sm">
              Forge your trajectory using predictive data model alignment
            </h2>
            <p className="text-sm text-[#c3c6d7] leading-relaxed max-w-md">
              CareerPilot does not just organize roles—it operates as a technical, highly analytical co-pilot. We parse live applicant tracking requirements, cross-examine technical books, and generate tailored resume modifications.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
