'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Github, Mail, Copy, Check, ExternalLink, Terminal, Code2, Cpu, BarChart3 } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/lib/portfolio-data';
import { soundEngine } from '@/components/sound/sound-synthesizer';

interface BentoHorizonProps {
  onOpenTerminal: () => void;
}

export function BentoHorizon({ onOpenTerminal }: BentoHorizonProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeSkillCategory, setActiveSkillCategory] = useState(0);
  const [promptPersona, setPromptPersona] = useState<'rag' | 'adtech' | '3d'>('3d');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('nthamba11@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const samplePrompts = {
    '3d': {
      title: 'Parametric Mukteshvara Geometry Shader',
      code: `// Dynamic R3F Torana Arch vertex transformation
const vertexOffset = sin(clock * 1.5 + position.x * 2.0) * 0.12;
vec3 displaced = position + normal * vertexOffset;
gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);`,
      result: 'Maintains 60 FPS across mobile and desktop with zero frame hitching.',
    },
    'rag': {
      title: 'Hybrid Lexical-Dense Vector RAG Pipeline',
      code: `{
  "retrieval_strategy": "reciprocal_rank_fusion",
  "vector_dimensions": 768,
  "top_k": 5,
  "grounding_check": "hallucination_score < 0.015"
}`,
      result: 'Latency <180ms median with structured JSON output conformity.',
    },
    'adtech': {
      title: 'Value-Based Automated Bidding Optimization',
      code: `{
  "target_roas": 3.85,
  "data_signals": ["crm_offline_conversions", "device_tier", "hour_of_day"],
  "auction_floor_adjustment": "dynamic_bid_shading"
}`,
      result: '+34% average ROAS lift across multi-brand Google Ads portfolios.',
    },
  };

  return (
    <section
      ref={sectionRef}
      id="the-horizon"
      className="min-h-screen py-24 px-4 md:px-12 relative flex items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ y: parallaxY }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl"
      >
        {/* Incoming Lifecycle Connection Terminus from Chapter 07 (Neural Spring) */}
        <div className="flex flex-col items-center mb-8 pointer-events-none" aria-hidden="true">
          <div className="w-[2px] h-10 bg-gradient-to-b from-transparent via-emerald-400/40 to-emerald-400/80" />
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400/60 opacity-75" />
            <div className="w-2.5 h-2.5 rounded-full border border-emerald-400/60 bg-neutral-950 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]">
              <div className="w-1 h-1 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-mono text-neutral-400 mb-3">
            <span className="font-semibold text-emerald-400">08. Digital Spring</span>
            <span aria-hidden="true">·</span>
            <span>Current & Future Synthesis</span>
            <span aria-hidden="true">·</span>
            <span>nomadcoder-nt</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-100 mb-3">
            THE HORIZON
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl">
            Where 8+ years of hardware systems, multi-million dollar performance marketing, financial stewardship, and AI engineering unite into modern 3D WebGL craft.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Interactive Stack & Skill Matrix (Spans 2 cols) */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-neutral-200">Core Engineering Stack</span>
                </div>
                <span className="text-xs font-mono text-neutral-400">Production-Grade</span>
              </div>

              {/* Segmented Category Buttons */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-900/90 rounded-lg mb-4">
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSkillCategory(idx);
                      soundEngine.playHapticFeedback('subtle');
                    }}
                    onMouseEnter={() => soundEngine.playHapticFeedback('subtle')}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      activeSkillCategory === idx
                        ? 'bg-neutral-800 text-emerald-300 font-semibold shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {cat.category.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Active Category Skills List */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-neutral-400 mb-1">
                  Proficiency Tier: <span className="text-neutral-200">{SKILL_CATEGORIES[activeSkillCategory].level}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SKILL_CATEGORIES[activeSkillCategory].items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded text-neutral-300 hover:border-emerald-500/40 hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Next.js 15 · React 19 · Three.js · Python</span>
              <span className="text-emerald-400">60 FPS Target</span>
            </div>
          </div>

          {/* Card 2: GitHub Repository & Open Source (Spans 1 col) */}
          <div className="p-6 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-white/10 shadow-xl flex flex-col justify-between group hover:border-cyan-500/40 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-neutral-200">GitHub Workspace</span>
                </div>
                <a
                  href="https://github.com/nomadcoder-nt"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open GitHub profile"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-xs font-mono text-cyan-400 mb-1">@nomadcoder-nt</p>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                Open-source repositories exploring 3D WebGL scenes, generative algorithms, AI prompt harnesses, and full-stack Next.js applications.
              </p>

              <div className="space-y-1.5 text-xs font-mono text-neutral-400">
                <div className="flex justify-between">
                  <span>Public Handle:</span>
                  <span className="text-neutral-200">nomadcoder-nt</span>
                </div>
                <div className="flex justify-between">
                  <span>Focus:</span>
                  <span className="text-neutral-200">R3F & AI Pipelines</span>
                </div>
                <div className="flex justify-between">
                  <span>Commits:</span>
                  <span className="text-neutral-200 tabular-nums">Active Continuous</span>
                </div>
              </div>
            </div>

            <a
              href="https://github.com/nomadcoder-nt"
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-mono font-medium text-white bg-neutral-900 border border-white/10 hover:border-cyan-400 hover:bg-neutral-800 rounded-lg transition-all"
            >
              <span>Visit github.com/nomadcoder-nt</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          </div>

          {/* Card 3: Direct Contact & Dispatch Card (Spans 1 col) */}
          <div className="p-6 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-neutral-200">Dispatch / Contact</span>
                </div>
                <span className="text-xs font-mono text-amber-400">Open to Roles</span>
              </div>

              <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
                Currently exploring opportunities in Creative WebGL Engineering, AI Autonomous Systems, and Technical Strategy.
              </p>

              <div className="p-3 rounded-lg bg-neutral-900/90 border border-white/5 space-y-2 mb-4">
                <div className="text-[11px] font-mono text-neutral-400">Direct Inquiries:</div>
                <div className="text-xs font-mono text-neutral-200 break-all select-all font-semibold">
                  nthamba11@gmail.com
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCopyEmail}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-mono font-medium text-neutral-200 bg-neutral-900 border border-white/10 hover:border-amber-400/50 hover:bg-neutral-800 rounded-lg transition-all"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>

              <a
                href="mailto:nthamba11@gmail.com?subject=Inquiry%20from%20Portfolio%20-%20nomadcoder-nt"
                className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-mono font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Direct Email</span>
              </a>
            </div>
          </div>

          {/* Card 4: Architecture Synthesis & Code Harness (Spans 2 cols) */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-neutral-200">
                    Computational Blueprints
                  </span>
                </div>
                {/* Switcher tabs */}
                <div className="flex items-center gap-1 p-0.5 bg-neutral-900 rounded-lg">
                  {(['3d', 'rag', 'adtech'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPromptPersona(mode)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors uppercase ${
                        promptPersona === mode
                          ? 'bg-neutral-800 text-white font-semibold'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs font-mono text-neutral-300 mb-2 font-semibold">
                {samplePrompts[promptPersona].title}
              </div>

              {/* Code display */}
              <pre className="p-3 rounded-lg bg-neutral-900/95 border border-white/5 text-[11px] font-mono text-neutral-300 overflow-x-auto leading-relaxed">
                <code>{samplePrompts[promptPersona].code}</code>
              </pre>

              <div className="mt-3 text-xs font-mono text-neutral-400">
                <span className="text-neutral-500">Validation: </span>
                <span className="text-emerald-400">{samplePrompts[promptPersona].result}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>TypeScript · WebGL GLSL · Node</span>
              <button
                onClick={onOpenTerminal}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Terminal className="w-3 h-3" />
                <span>Launch Interactive Shell [~]</span>
              </button>
            </div>
          </div>

          {/* Card 5: Career Aggregate Impact (Spans 2 cols) */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-white/10 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-neutral-200">
                  Career Aggregate Track Record
                </span>
              </div>
              <span className="text-xs font-mono text-neutral-400">Cross-Disciplinary</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-neutral-900/70 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Ad Spend</span>
                <span className="text-xl sm:text-2xl font-mono font-bold tabular-nums text-neutral-100">$4.2M+</span>
                <span className="text-[11px] text-neutral-500 block">Google Ops Center</span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/70 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">SMBs Advised</span>
                <span className="text-xl sm:text-2xl font-mono font-bold tabular-nums text-neutral-100">340+</span>
                <span className="text-[11px] text-neutral-500 block">Accenture Cloud</span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/70 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">HW Incidents</span>
                <span className="text-xl sm:text-2xl font-mono font-bold tabular-nums text-neutral-100">50K+</span>
                <span className="text-[11px] text-neutral-500 block">Amazon Echo/Fire</span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/70 border border-white/5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">3D Heritage</span>
                <span className="text-xl sm:text-2xl font-mono font-bold tabular-nums text-neutral-100">1.2M</span>
                <span className="text-[11px] text-neutral-500 block">Torana Polygons</span>
              </div>
            </div>

            <p className="mt-4 text-xs font-mono text-neutral-400">
              Synthesis: Rare hybrid fluency spanning corporate P&L performance marketing to deep mathematical 3D rendering.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
