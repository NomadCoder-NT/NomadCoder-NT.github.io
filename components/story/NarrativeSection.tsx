'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { NarrativeSectionData, SeasonId } from '@/types/portfolio';
import { useCustomCursor } from '@/components/ui/CustomCursorContext';

interface NarrativeSectionProps {
  section: NarrativeSectionData;
  isActive: boolean;
  onOpenArtifact?: (artifact: string) => void;
  nextSection?: NarrativeSectionData;
  isFirst?: boolean;
  isLast?: boolean;
}

export function NarrativeSection({
  section,
  nextSection,
  isLast = false,
}: NarrativeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { setMagneticTarget } = useCustomCursor();

  // Scroll tracking for parallax and boundary indicators
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.75, 1, 1, 0.75]);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const smoothProgress = useSpring(sectionProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  const scaleX = useTransform(smoothProgress, (val) => Math.min(1, Math.max(0, val)));
  const connectionLineScale = useTransform(smoothProgress, [0.28, 0.96], [0.12, 1]);
  const pulsePosition = useTransform(smoothProgress, [0.22, 0.96], ['0%', '94%']);
  const pulseGlowOpacity = useTransform(smoothProgress, [0.15, 0.45, 0.85, 1], [0.2, 1, 1, 0.35]);

  const getLifecycleGradient = (currentSeason: SeasonId, nextSeason?: SeasonId) => {
    const target = nextSeason || currentSeason;
    if (currentSeason === 'summer' && target === 'summer') return 'from-amber-400 via-orange-400 to-amber-500';
    if (currentSeason === 'summer' && target === 'monsoon') return 'from-amber-400 via-teal-400 to-cyan-400';
    if (currentSeason === 'monsoon' && target === 'monsoon') return 'from-cyan-400 via-sky-500 to-blue-400';
    if (currentSeason === 'monsoon' && target === 'autumn') return 'from-cyan-400 via-amber-300 to-yellow-400';
    if (currentSeason === 'autumn' && target === 'autumn') return 'from-yellow-400 via-amber-500 to-yellow-500';
    if (currentSeason === 'autumn' && target === 'spring') return 'from-yellow-400 via-emerald-400 to-teal-400';
    if (currentSeason === 'spring' && target === 'winter') return 'from-emerald-400 via-teal-400 to-sky-400';
    if (currentSeason === 'winter' && target === 'winter') return 'from-sky-400 via-cyan-400 to-blue-500';
    return 'from-emerald-400 via-teal-400 to-cyan-400';
  };

  const lifecycleGradient = getLifecycleGradient(section.seasonId, nextSection?.seasonId);

  // Season accent classes
  const seasonColorClass = {
    summer: 'text-amber-400',
    monsoon: 'text-cyan-400',
    autumn: 'text-yellow-400',
    spring: 'text-emerald-400',
    winter: 'text-sky-300',
  }[section.seasonId];

  const seasonBorderLClass = {
    summer: 'border-l-amber-500/60',
    monsoon: 'border-l-cyan-400/60',
    autumn: 'border-l-yellow-500/60',
    spring: 'border-l-emerald-500/60',
    winter: 'border-l-sky-400/60',
  }[section.seasonId];

  const seasonProgressGradient = {
    summer: 'from-amber-500 to-amber-300',
    monsoon: 'from-cyan-400 to-sky-400',
    autumn: 'from-yellow-500 to-yellow-300',
    spring: 'from-emerald-500 to-teal-400',
    winter: 'from-sky-400 to-cyan-300',
  }[section.seasonId];

  const seasonPulseDot = {
    summer: 'bg-amber-400',
    monsoon: 'bg-cyan-400',
    autumn: 'bg-yellow-400',
    spring: 'bg-emerald-400',
    winter: 'bg-sky-400',
  }[section.seasonId];

  const paragraphs =
    section.narrativeParagraphs && section.narrativeParagraphs.length > 0
      ? section.narrativeParagraphs
      : [section.summary];

  const isInfrastructureChapter = section.id === 'ignition' || section.id === 'hardware-forge';
  const isAdTechChapter = section.id === 'data-monsoon' || section.id === 'cloud-canopy';
  const isWealthChapter = section.id === 'the-harvest';
  const isHeritageChapter = section.id === 'roots-structure';
  const isStudioChapter = section.id === 'the-horizon';

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className="min-h-screen flex items-center justify-center py-24 px-4 sm:px-8 md:px-12 relative overflow-x-clip pointer-events-none"
    >
      {/* Razor-thin Hairline Boundary Divider */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.08] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className={`h-full w-full bg-gradient-to-r ${seasonProgressGradient} opacity-50`}
        />
      </div>

      {/* Editorial Magazine Container directly on obsidian background */}
      <motion.div
        style={{ y: parallaxY, opacity: opacityFade }}
        className="w-full max-w-7xl mx-auto relative z-10 pointer-events-auto"
      >
        {/* ========================================================================= */}
        {/* FORMAT 1: SECTIONS 01 & 02 (AMAZON & DELL) — INFRASTRUCTURE DOSSIER       */}
        {/* ========================================================================= */}
        {isInfrastructureChapter && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Column: Role, Company & Candid Narrative */}
            <div className="w-full md:col-span-5 md:sticky md:top-24 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold">
                <span className={`w-2 h-2 rounded-full ${seasonPulseDot}`} />
                <span className={seasonColorClass}>
                  {section.index} // {section.title}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {section.organization}
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  {section.period} · <span className="text-neutral-500">{section.location}</span>
                </div>
                <div className="text-xs font-mono text-neutral-300 pt-1">
                  ROLE: {section.role}
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-sans pt-2 border-t border-white/[0.08]">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="text-neutral-300/90 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Right Column: Borderless Stat Counters & Terminal Contribution Log */}
            <div className="w-full md:col-span-7 space-y-8">
              {/* Borderless Large Stat Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-white/[0.08]">
                {section.metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight text-white tabular-nums">
                      {metric.value}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                      {metric.label}
                    </div>
                    <div className="text-xs text-neutral-500 font-sans leading-tight">
                      {metric.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal-Style Contribution Log */}
              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <div className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
                  // TECHNICAL HIGHLIGHTS & INCIDENT TREES
                </div>
                <div className="space-y-3 pt-1">
                  {section.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-neutral-300 leading-relaxed">
                      <span className="text-amber-400 select-none shrink-0">$</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clean Horizontal Stack Row */}
              <div className="pt-4 border-t border-white/[0.08] text-xs font-mono text-neutral-400 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">STACK:</span>
                {section.technologies.map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-neutral-300">{tech}</span>
                    {idx < section.technologies.length - 1 && (
                      <span className="text-neutral-600">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 2: SECTIONS 03 & 04 (GOOGLE & ACCENTURE) — ADTECH AUCTION LEDGER   */}
        {/* ========================================================================= */}
        {isAdTechChapter && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Column: Organization & Strategy Narrative */}
            <div className="w-full md:col-span-5 md:sticky md:top-24 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold">
                <span className={`w-2 h-2 rounded-full ${seasonPulseDot}`} />
                <span className={seasonColorClass}>
                  {section.index} // {section.title}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {section.organization}
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  {section.period} · <span className="text-neutral-500">{section.location}</span>
                </div>
                <div className="text-xs font-mono text-neutral-300 pt-1">
                  ROLE: {section.role}
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-sans pt-2 border-t border-white/[0.08]">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="text-neutral-300/90 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Right Column: Tabular Auction Ledger Grid */}
            <div className="w-full md:col-span-7 space-y-6">
              <div className="border border-white/[0.08] divide-y divide-white/[0.08] font-mono rounded-lg overflow-hidden">
                <div className="bg-white/[0.02] px-4 py-2.5 flex items-center justify-between text-[11px] tracking-wider text-neutral-400 font-semibold uppercase">
                  <span>METRIC / TELEMETRY SIGNAL</span>
                  <span>PERFORMANCE LEDGER</span>
                </div>
                {section.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 hover:bg-white/[0.015] transition-colors"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-wider text-neutral-200 font-medium">
                        {metric.label}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-sans">
                        {metric.detail}
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-cyan-300 tabular-nums">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Algorithmic Contributions */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                  // AUCTION ARCHITECTURE & FIRST-PARTY DATA PIPELINES
                </div>
                <div className="space-y-2.5">
                  {section.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className={`border-l-2 pl-4 py-1 text-sm text-neutral-300 leading-relaxed ${seasonBorderLClass}`}
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Horizontal Tech Stack */}
              <div className="pt-4 border-t border-white/[0.08] text-xs font-mono text-neutral-400 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">INFRASTRUCTURE:</span>
                {section.technologies.map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-neutral-300">{tech}</span>
                    {idx < section.technologies.length - 1 && (
                      <span className="text-neutral-600">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 3: SECTION 05 (ICICI BANK) — CAPITAL STEWARDSHIP & WEALTH ALLOCATION*/}
        {/* ========================================================================= */}
        {isWealthChapter && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Column: Organization & Fiduciary Stewardship */}
            <div className="w-full md:col-span-5 md:sticky md:top-24 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold">
                <span className={`w-2 h-2 rounded-full ${seasonPulseDot}`} />
                <span className={seasonColorClass}>
                  {section.index} // {section.title}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {section.organization}
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  {section.period} · <span className="text-neutral-500">{section.location}</span>
                </div>
                <div className="text-xs font-mono text-neutral-300 pt-1">
                  ROLE: {section.role}
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-sans pt-2 border-t border-white/[0.08]">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="text-neutral-300/90 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Right Column: Quantitative Asset Allocation Breakdown */}
            <div className="w-full md:col-span-7 space-y-6">
              {/* Asset Allocation Metrics Header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-white/[0.08]">
                {section.metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white tabular-nums">
                      {metric.value}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                      {metric.label}
                    </div>
                    <div className="text-xs text-neutral-500 font-sans leading-tight">
                      {metric.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantitative Asset Allocation Model */}
              <div className="p-5 rounded-lg border border-white/[0.08] bg-white/[0.015] space-y-4 font-mono text-xs">
                <div className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold flex items-center justify-between">
                  <span>QUANTITATIVE ALLOCATION // RISK PARITY</span>
                  <span className="text-yellow-400">₹12Cr+ AUM</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-300 pb-1">
                      <span>EQUITY ALPHA & BALANCED GROWTH</span>
                      <span className="text-white font-bold">42%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-300 pb-1">
                      <span>FIXED INCOME & SOVEREIGN DEBT</span>
                      <span className="text-white font-bold">38%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '38%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-300 pb-1">
                      <span>COMMERCIAL TRADE FINANCE & LIQUIDITY (LCs)</span>
                      <span className="text-white font-bold">20%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trade Credit Deliverables */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                  // RISK GOVERNANCE & TRADE UNDERWRITING
                </div>
                <div className="space-y-2.5">
                  {section.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className={`border-l-2 pl-4 py-1 text-sm text-neutral-300 leading-relaxed ${seasonBorderLClass}`}
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div className="pt-4 border-t border-white/[0.08] text-xs font-mono text-neutral-400 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">FRAMEWORK:</span>
                {section.technologies.map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-neutral-300">{tech}</span>
                    {idx < section.technologies.length - 1 && (
                      <span className="text-neutral-600">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 4: SECTION 06 (TEMPLECITY ATELIER) — DRAMATIC 3D SPLIT SHOWCASE    */}
        {/* ========================================================================= */}
        {isHeritageChapter && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left 40% (Text Anchor) */}
            <div className="w-full md:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold">
                <span className={`w-2 h-2 rounded-full ${seasonPulseDot}`} />
                <span className={seasonColorClass}>
                  {section.index} // {section.title}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {section.organization}
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  {section.period} · <span className="text-neutral-500">{section.location}</span>
                </div>
                <div className="text-xs font-mono text-neutral-300 pt-1">
                  ROLE: {section.role}
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-sans pt-2 border-t border-white/[0.08]">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="text-neutral-300/90 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Fabrication Specifications */}
              <div className="pt-2 space-y-2 font-mono text-xs">
                <div className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
                  // PHYSICAL FABRICATION SPECIFICATIONS
                </div>
                <div className="grid grid-cols-3 gap-3 pt-1 border-t border-white/[0.06]">
                  <div>
                    <div className="text-white font-bold text-lg">1.24M</div>
                    <div className="text-[10px] text-neutral-400 uppercase">CAD POLYS</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">±0.15mm</div>
                    <div className="text-[10px] text-neutral-400 uppercase">TOLERANCE</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">80%</div>
                    <div className="text-[10px] text-neutral-400 uppercase">BRONZE POWDER</div>
                  </div>
                </div>
              </div>

              {/* Stack */}
              <div className="pt-4 border-t border-white/[0.08] text-xs font-mono text-neutral-400 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">PIPELINE:</span>
                {section.technologies.map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-neutral-300">{tech}</span>
                    {idx < section.technologies.length - 1 && (
                      <span className="text-neutral-600">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right 60% (Uncluttered 3D Viewport with subtle HUD overlay) */}
            <div className="w-full md:col-span-7 flex flex-col justify-center items-end min-h-[380px] pointer-events-none">
              <div className="p-4 rounded border border-emerald-500/25 bg-neutral-950/40 backdrop-blur-sm font-mono text-[11px] text-neutral-300 space-y-1 text-right">
                <div className="text-emerald-400 font-semibold tracking-wider">
                  // MUKTESHVARA TORANA 3D CAD MODEL
                </div>
                <div className="text-neutral-400">10TH-CENTURY SACRED KALINGA ARCHITECTURE</div>
                <div className="text-white">MESH: 1,240,000 SCULPTED POLYGONS</div>
                <div className="text-neutral-400">PIPELINE: COREXY + MSLA 12K // ±0.15MM</div>
                <div className="text-emerald-400/90 text-[10px] pt-1">
                  INTERACTIVE 3D VIEWPORT // USE MOUSE TO ORBIT
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 5: SECTION 07 (NOMADCODER-NT STUDIO) — APEX SYSTEMS SPEC SHEET     */}
        {/* ========================================================================= */}
        {isStudioChapter && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Column: Organization & Studio Direction */}
            <div className="w-full md:col-span-5 md:sticky md:top-24 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold">
                <span className={`w-2 h-2 rounded-full ${seasonPulseDot}`} />
                <span className={seasonColorClass}>
                  {section.index} // {section.title}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {section.organization}
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  {section.period} · <span className="text-neutral-500">{section.location}</span>
                </div>
                <div className="text-xs font-mono text-neutral-300 pt-1">
                  ROLE: {section.role}
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-sans pt-2 border-t border-white/[0.08]">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="text-neutral-300/90 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Right Column: Systems Performance & Architectural Deliverables */}
            <div className="w-full md:col-span-7 space-y-6">
              {/* Performance Metrics Header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-white/[0.08]">
                {section.metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white tabular-nums">
                      {metric.value}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                      {metric.label}
                    </div>
                    <div className="text-xs text-neutral-500 font-sans leading-tight">
                      {metric.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Architectural Deliverables */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                  // FULL-STACK 3D WEBGL & VECTOR RAG DELIVERABLES
                </div>
                <div className="space-y-2.5">
                  {section.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className={`border-l-2 pl-4 py-1 text-sm text-neutral-300 leading-relaxed ${seasonBorderLClass}`}
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div className="pt-4 border-t border-white/[0.08] text-xs font-mono text-neutral-400 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">ENGINEERING STACK:</span>
                {section.technologies.map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-neutral-300">{tech}</span>
                    {idx < section.technologies.length - 1 && (
                      <span className="text-neutral-600">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subtle Vertical Lifecycle Conduit */}
        {!isLast && (
          <div className="relative flex flex-col items-center w-full mt-12 -mb-12 pointer-events-auto z-10">
            <div className="relative w-full flex flex-col items-center py-0.5">
              <div className="relative w-[1px] h-16 sm:h-24 bg-white/[0.08] overflow-hidden">
                <motion.div
                  style={{
                    scaleY: connectionLineScale,
                    transformOrigin: 'top',
                  }}
                  className={`absolute inset-0 w-full bg-gradient-to-b ${lifecycleGradient}`}
                />
                <motion.div
                  style={{
                    top: pulsePosition,
                    opacity: pulseGlowOpacity,
                  }}
                  className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-6 -mt-3 rounded-full blur-[1px] bg-gradient-to-b ${lifecycleGradient}`}
                />
              </div>

              <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                <span className={`w-1.5 h-1.5 rounded-full ${seasonPulseDot}`} />
                <span>Chapter {section.index}</span>
                <ChevronDown className="w-3 h-3 text-neutral-600" />
                {nextSection && <span>Chapter {nextSection.index}</span>}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
