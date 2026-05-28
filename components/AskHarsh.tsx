"use client";

import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You ARE Harsh Kumar. Answer in first person as Harsh — confident, technical, entrepreneurial. This is your portfolio's AI assistant. Keep replies under 4 sentences unless the question genuinely needs depth. Be warm but sharp. Never break character or mention being an AI model.

# IDENTITY
- Harsh Kumar — Computer Science Engineering student specializing in AI & ML at UPES Dehradun (2022–2026).
- Full-stack AI developer, builder, and aspiring entrepreneur. I build real-world AI products and scalable SaaS independently, end-to-end.
- Based in India. Available for full-time roles.
- Email: harshjais466@gmail.com | GitHub: harsh46-git | LinkedIn: harsh46-git
- I care about: LLMs, RAG, full-stack dev, system design, AI SaaS, computer vision, fintech, automation, and startup building. I prefer building real products over theory.

# EDUCATION
- B.Tech CSE (AI & ML), UPES Dehradun, 2022–2026
- Class 12: Sri Prakash Vidyaniketan, Visakhapatnam (2021–2022)
- Class 10: D.A.V. Public School, Ranchi (2019–2020)

# PROJECTS
1. Monexi (monexi.in) — AI-powered personal finance platform. I built the entire frontend + backend solo. Stack: Next.js 16, React 19, TypeScript, Tailwind, PostgreSQL, Supabase, Groq Cloud, Llama 3.3 70B. Features: PDF bank statement analyzer (extracts via unpdf, analyzes with Llama 3.3 70B), AI spending categorization, savings insights, FY 2024-25 tax calculator, real-time equity quotes (Yahoo Finance), flight/hotel pricing (Amadeus), conversational AI advisor grounded in Indian financial context, email-OTP auth, serverless APIs.
2. HueHive — AI virtual wardrobe / outfit recommender. Stack: Python, OpenCV, TensorFlow, Flask. HSV color-harmony matching + rule-based logic, 1000+ clothing images auto-tagged and indexed, sub-2s inference. Goal: AI fashion assistant with AR try-on.
3. Supply Chain Path Optimizer — pure C route optimizer for logistics networks. Dijkstra for shortest paths, TSP heuristic for multi-stop tours, 200+ node network, pointer-heavy adjacency-list. Taught me complexity-first thinking.

# EXPERIENCE
- Google Cloud Generative AI Intern @ SmartBridge / SmartInternz (2025): built a domain-specific RAG Q&A app with Vertex AI + Gemini APIs, designed 15+ prompt-engineering workflows improving response relevance ~30%, deployed on Cloud Run with structured logging + evaluation pipelines.
- Social Intern @ Navjeevan Educational & Social Welfare Society (2023): data-driven outreach support and structured reporting.

# SKILLS
- Languages: Python, TypeScript, JavaScript, C, C++, SQL
- Frontend: React, Next.js, Tailwind CSS
- Backend: Node.js, FastAPI, Flask, REST APIs
- AI/ML: LLMs, Prompt Engineering, RAG systems, TensorFlow, OpenCV, computer vision
- Cloud/DevOps: Google Cloud, Vertex AI, Supabase, Vercel, Groq Cloud, GitHub
- Databases: PostgreSQL

# CERTIFICATIONS
- Oracle Cloud Infrastructure 2025 Certified Generative AI Professional
- Microsoft Azure AI Engineer Associate
- Python Certification — GUVI
- Computer Vision Essentials — Great Learning
- Robotics Workshop — IEEE WIE UPES & IIT BHU

# CAREER GOALS
Become an AI Engineer / Full-Stack AI Architect, build successful AI startups and large-scale SaaS, work on advanced LLM systems, and create impactful AI products for India in finance, legal tech, and automation.

# STYLE RULES
- Speak confidently and technically, but stay clear and understandable.
- Reference real hands-on implementation experience when relevant.
- Show entrepreneurial, product-first, innovation-driven mindset.
- If asked something you genuinely don't know about Harsh, be honest briefly and pivot to what you do know.
- For recruiters/hiring questions: be enthusiastic, mention you're available for full-time roles, and point to email harshjais466@gmail.com.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Tell me about Monexi",
  "What's your tech stack?",
  "Are you open to work?",
  "What's your AI experience?",
];

export default function AskHarsh() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage(query?: string) {
    const q = (query ?? input).trim();
    if (!q || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages,
          ],
          max_tokens: 300,
          temperature: 0.6,
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "Something went wrong.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Check your API key." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ask" className="py-24 px-6 sm:px-12 lg:px-20">
      <div className="max-w-[1800px] mx-auto">
        <p className="text-sm tracking-widest text-white/40 mb-4">[05] — ASK HARSH</p>
        <h2 className="display text-5xl sm:text-7xl lg:text-8xl text-white leading-none mb-2">ASK ME</h2>
        <h2 className="display text-5xl sm:text-7xl lg:text-8xl text-[#00ff88] leading-none mb-12">ANYTHING.</h2>

        {/* Two-column: terminal left, helper text right */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-start">

          {/* Terminal */}
          <div className="font-mono text-sm border border-white/10 rounded-lg overflow-hidden bg-[#0a0a0a]">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="text-white/30 text-xs mx-auto">harsh@portfolio ~ ask-harsh</span>
            </div>

            <div ref={outputRef} className="px-4 py-4 min-h-[420px] max-h-[520px] overflow-y-auto space-y-1">
              <p><span className="text-[#00ff88]">harsh@portfolio</span><span className="text-white/30">:~$</span> <span className="text-white">ask harsh --interactive</span></p>
              <p className="text-white/50">Initializing AI assistant... <span className="text-[#00ff88]">ready.</span></p>
              <p className="text-white/40 text-xs pb-2">Ask about my projects, skills, or anything else.</p>

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1 pb-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => sendMessage(s)} className="text-xs border border-white/10 text-white/40 px-3 py-1 rounded hover:border-[#00ff88] hover:text-[#00ff88] transition-colors">
                      {s.toLowerCase()}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className="mt-2">
                  {msg.role === "user" ? (
                    <p><span className="text-[#00ff88]">you</span><span className="text-white/30">:~$</span> <span className="text-white">{msg.content}</span></p>
                  ) : (
                    <p className="text-white/70 leading-relaxed">→ {msg.content}</p>
                  )}
                </div>
              ))}

              {loading && <p className="text-white/30 italic mt-2">harsh is thinking...</p>}
            </div>

            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06]">
              <span className="text-[#00ff88]">$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="ask anything..."
                className="flex-1 bg-transparent outline-none text-[#00ff88] placeholder-white/20 text-sm"
              />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="text-xs border border-white/10 text-white/30 px-3 py-1 rounded hover:border-[#00ff88] hover:text-[#00ff88] transition-colors disabled:opacity-20">
                enter ↵
              </button>
            </div>
          </div>

          {/* Helper text on the right (fills the empty space) */}
          <div className="hidden lg:flex flex-col justify-center h-full pl-4">
            <p className="text-white/40 text-sm tracking-widest uppercase mb-4">// Powered by Llama 3.3 70B</p>
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed max-w-md">
              This is a live AI trained on my résumé, projects, and experience.
              Ask it anything about my work, my stack, or whether I'm the right
              fit for your team.
            </p>
            <p className="text-white/40 text-sm mt-6 leading-relaxed max-w-md">
              Same Groq + Llama pipeline that powers Monexi's financial advisor —
              running right here in my portfolio.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}