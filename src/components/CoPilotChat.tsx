import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  ArrowUpRight, 
  User, 
  HelpCircle,
  Clock,
  Code
} from "lucide-react";
import { motion } from "motion/react";
import { ChatMessage } from "../types";
import { generateCoPilotResponse } from "../services/copilotService";

interface CoPilotChatProps {
  currentRole: string;
  targetRole: string;
}

export default function CoPilotChat({ currentRole, targetRole }: CoPilotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content: `Hello! I am your CareerPilot AI Advisor. 

I possess deep understanding of career alignment models, interview strategies, engineering compensation ranges, and ATS criteria.

Ask me anything about transition trajectories, technical negotiation strategies, certification selection, or skill mastery templates. Try clicking any of our strategic prompts below to start our consultation.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    "How do I negotiate compensation during a transition?",
    `What technical certifications validate ${targetRole} readiness?`,
    `Review typical weekly deliverables for a ${targetRole}.`,
    "List the 4 best books for software architecture mastery."
  ];

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const responseText = await generateCoPilotResponse(
        textToSend,
        currentRole || "Fullstack Developer",
        targetRole || "Technical Lead"
      );

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message || "Failed to formulate response from AI Advisor. Please verify your GEMINI_API_KEY in the Secrets panel."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  // Custom visual inline Markdown text parser to keep output beautiful without extra complex NPM libraries
  const renderMessageText = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, lineIdx) => {
      // Handle list bullet line
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const bulletText = line.replace(/^[-*]\s+/, "");
        return (
          <li key={lineIdx} className="ml-5 list-disc mt-1 text-[#c3c6d7] font-sans text-sm leading-relaxed">
            {parseBoldAndCode(bulletText)}
          </li>
        );
      }
      
      // Handle numbered lists
      const numberListRegex = /^\d+\.\s+/;
      if (numberListRegex.test(line.trim())) {
        const numberedText = line.replace(numberListRegex, "");
        const num = line.match(/^\d+/)?.toString();
        return (
          <li key={lineIdx} className="ml-5 list-decimal mt-1 text-[#c3c6d7] font-sans text-sm leading-relaxed">
            {parseBoldAndCode(numberedText)}
          </li>
        );
      }

      // Handle Code Block start/end
      if (line.trim().startsWith("```")) {
        return null; // Skip markdown wrappers
      }

      // Default paragraph line
      return (
        <p key={lineIdx} className="min-h-[1.25rem] text-[#c3c6d7] font-sans text-sm leading-relaxed my-1.5">
          {parseBoldAndCode(line)}
        </p>
      );
    });
  };

  // Parsing bold emphasis and inline code blocks
  const parseBoldAndCode = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIdx = 0;
    
    // Quick token parser for **bold** and `code`
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const matches = [...text.matchAll(regex)];

    if (matches.length === 0) {
      return text;
    }

    matches.forEach((match, matchIdx) => {
      const start = match.index!;
      const matchText = match[0];
      
      // text preceding match
      if (start > currentIdx) {
        parts.push(text.substring(currentIdx, start));
      }

      // parsed formatting styling
      if (matchText.startsWith("**") && matchText.endsWith("**")) {
        parts.push(
          <strong key={matchIdx} className="text-white font-semibold">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith("`") && matchText.endsWith("`")) {
        parts.push(
          <code key={matchIdx} className="font-mono text-xs text-brand-primary bg-[#11131b] border border-[#434655]/15 px-1.5 py-0.5 rounded">
            {matchText.slice(1, -1)}
          </code>
        );
      }

      currentIdx = start + matchText.length;
    });

    if (currentIdx < text.length) {
      parts.push(text.substring(currentIdx));
    }

    return parts;
  };

  return (
    <div id="copilot-tab" className="p-6 max-w-5xl mx-auto h-[calc(100vh-2rem)] flex flex-col justify-between">
      
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-[#434655]/10 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#c3c0ff] text-surface-bg shadow-md">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">AI Co-Pilot Advisor</h1>
            <p className="text-xs text-[#8d90a0] flex items-center gap-1 mt-0.5">
              <span>Currently consultation mode on: </span>
              <span className="text-brand-primary font-mono font-medium">{currentRole} → {targetRole}</span>
            </p>
          </div>
        </div>
        
        <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20 px-2.5 py-1 rounded">
          Active Sandbox
        </span>
      </div>

      {/* Main Messages Container */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5 px-1 my-2">
        {messages.map((msg) => {
          const isAi = msg.role === "assistant";
          
          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-3.5 ${isAi ? "justify-start" : "justify-end"}`}
            >
              {/* Profile Avatar circle */}
              {isAi && (
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1d1f27] border border-[#434655]/20 text-brand-primary shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                </div>
              )}

              {/* Message Bubble Card */}
              <div className={`max-w-[85%] rounded-2xl p-5 ${
                isAi 
                  ? "bg-gradient-to-b from-[#1d1f27] to-[#14161f] border border-[#434655]/15 text-[#c3c6d7]" 
                  : "bg-brand-primary-container text-white shadow-md shadow-brand-primary-container/10"
              }`}>
                {/* Meta details */}
                <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2 mb-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-white/60">
                    {isAi ? "CareerPilot Advisor" : "Bhupesh (Candidate)"}
                  </span>
                  <span className="font-mono text-[9px] opacity-50 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{msg.timestamp}</span>
                  </span>
                </div>

                {/* Styled output content text */}
                <div className="space-y-1">
                  {isAi ? (
                    renderMessageText(msg.content)
                  ) : (
                    <p className="font-sans text-sm leading-relaxed text-white">
                      {msg.content}
                    </p>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-secondary text-surface-bg font-sans text-xs font-bold shrink-0 mt-1">
                  B
                </div>
              )}
            </div>
          );
        })}

        {/* Loading strategic bubble indicator */}
        {loading && (
          <div className="flex items-start gap-3.5 justify-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1d1f27] border border-[#434655]/20 text-brand-primary shrink-0 mt-1 animate-pulse">
              <Sparkles className="w-4 h-4 text-brand-secondary" />
            </div>
            <div className="max-w-[70%] rounded-2xl p-5 bg-[#1d1f27] border border-[#434655]/15 text-[#8d90a0] flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2.5 h-2.5 bg-brand-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2.5 h-2.5 bg-brand-tertiary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              <span className="font-mono text-[10px] uppercase tracking-widest ml-1 animate-pulse">Coach formulating response...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Preset Strategy Prompts (only if no custom chats have loaded or show as support) */}
      <div className="py-2 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 shrink-0 border-t border-[#434655]/5 pt-4">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => handleSend(preset)}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#191b23] hover:bg-[#282a32] border border-[#434655]/15 text-xs text-[#c3c6d7] hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            <span>{preset}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8d90a0]" />
          </button>
        ))}
      </div>

      {/* Input Form field */}
      <form onSubmit={handleFormSubmit} className="flex gap-2.5 mt-2.5 shrink-0 relative">
        <input
          id="chat-input-text"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about transitioning, negotiating compensation, or mastering AWS certifications...`}
          className="flex-1 font-sans text-sm text-white bg-[#11131b] border border-[#434655]/20 focus:border-brand-primary focus:outline-none rounded-xl px-4 py-3.5 pr-12 transition-all focus:ring-2 focus:ring-brand-primary/10"
          disabled={loading}
        />
        <button
          id="btn-send-message"
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 w-9 h-9 flex items-center justify-center rounded-lg bg-brand-primary-container text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
