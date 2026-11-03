'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { NarrativeSectionData, SeasonId } from '@/types/portfolio';

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

  // Parallax and progress tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.8, 1, 1, 0.8]);

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
    if (currentSeason === 'summer' && target === 'summer') return 'from-[#e08a3c] via-orange-400 to-[#e08a3c]';
    if (currentSeason === 'summer' && target === 'monsoon') return 'from-[#e08a3c] via-teal-400 to-[#38bdf8]';
    if (currentSeason === 'monsoon' && target === 'monsoon') return 'from-[#38bdf8] via-sky-500 to-[#38bdf8]';
    if (currentSeason === 'monsoon' && target === 'autumn') return 'from-[#38bdf8] via-amber-300 to-[#d4af37]';
    if (currentSeason === 'autumn' && target === 'autumn') return 'from-[#d4af37] via-yellow-500 to-[#d4af37]';
    if (currentSeason === 'autumn' && target === 'spring') return 'from-[#d4af37] via-emerald-400 to-[#34d399]';
    if (currentSeason === 'spring' && target === 'winter') return 'from-[#34d399] via-teal-400 to-[#93c5fd]';
    if (currentSeason === 'winter' && target === 'winter') return 'from-[#93c5fd] via-cyan-400 to-[#93c5fd]';
    return 'from-[#34d399] via-teal-400 to-[#38bdf8]';
  };

  const lifecycleGradient = getLifecycleGradient(section.seasonId, nextSection?.seasonId);

  // Dynamic seasonal accent tokens matching bbsrguy.github.io palette
  const seasonColorClass = {
    summer: 'text-[#e08a3c]',
    monsoon: 'text-[#38bdf8]',
    autumn: 'text-[#d4af37]',
    spring: 'text-[#34d399]',
    winter: 'text-[#93c5fd]',
  }[section.seasonId];

  const seasonBorderLClass = {
    summer: 'border-l-[#e08a3c]/60',
    monsoon: 'border-l-[#38bdf8]/60',
    autumn: 'border-l-[#d4af37]/60',
    spring: 'border-l-[#34d399]/60',
    winter: 'border-l-[#93c5fd]/60',
  }[section.seasonId];

  const seasonProgressGradient = {
    summer: 'from-[#e08a3c] to-amber-300',
    monsoon: 'from-[#38bdf8] to-sky-300',
    autumn: 'from-[#d4af37] to-yellow-300',
    spring: 'from-[#34d399] to-emerald-300',
    winter: 'from-[#93c5fd] to-cyan-300',
  }[section.seasonId];

  const seasonPulseDot = {
    summer: 'bg-[#e08a3c]',
    monsoon: 'bg-[#38bdf8]',
    autumn: 'bg-[#d4af37]',
    spring: 'bg-[#34d399]',
    winter: 'bg-[#93c5fd]',
  }[section.seasonId];

  const paragraphs =
    section.narrativeParagraphs && section.narrativeParagraphs.length > 0
      ? section.narrativeParagraphs
      : [section.summary];

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-8 lg:px-16 relative overflow-x-clip border-t border-white/[0.08] pointer-events-none"
    >
      {/* Razor-thin Hairline Boundary Progress Indicator */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.08] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className={`h-full w-full bg-gradient-to-r ${seasonProgressGradient} opacity-60`}
        />
      </div>

      {/* Asymmetric Editorial Layout Container */}
      <motion.div
        style={{ y: parallaxY, opacity: opacityFade }}
        className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16 relative z-10 pointer-events-auto"
      >
        {/* ========================================================================= */}
        {/* LEFT COLUMN (w-full lg:w-[45%]): NARRATIVE, METRICS & TECHNICAL CONTRIBUTIONS */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[45%] space-y-8">
          {/* Monospace Kicker */}
          <div className="flex items-center gap-2.5 text-xs font-mono tracking-widest uppercase font-semibold">
            <span className={`w-2 h-2 rounded-full ${seasonPulseDot}`} />
            <span className={seasonColorClass}>
              {section.index} // {section.title}
            </span>
          </div>

          {/* Section Heading & Metadata */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              {section.organization}
            </h2>
            <div className="text-xs font-mono text-neutral-400 tracking-wide">
              {section.period} · <span className="text-neutral-500">{section.location}</span>
            </div>
            <div className="text-xs font-mono text-neutral-300 pt-0.5">
              ROLE: {section.role}
            </div>
          </div>

          {/* Candid First-Person Narrative directly on dark background */}
          <div className="space-y-4 text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-sans pt-1 border-t border-white/[0.08]">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx} className="text-neutral-300/90 leading-relaxed font-normal">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Clean Borderless Metrics: Large Monospace Numbers + Uppercase Labels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/[0.08]">
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

          {/* Key Technical Contributions */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
              // ARCHITECTURAL DELIVERABLES & TECHNICAL IMPACT
            </div>
            <div className="space-y-3">
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

          {/* Clean Horizontal Tech Stack Row with Monospace Dividers */}
          <div className="pt-6 border-t border-white/[0.08] text-xs font-mono text-neutral-400 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">
              STACK:
            </span>
            {section.technologies.map((tech, idx) => (
              <React.Fragment key={idx}>
                <span className="text-neutral-300">{tech}</span>
                {idx < section.technologies.length - 1 && (
                  <span className="text-neutral-600">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {section.keyArtifact && (
            <div className="pt-1 text-xs font-mono text-neutral-400 flex items-center gap-2">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                KEY ARTIFACT:
              </span>
              <span className={`${seasonColorClass} font-medium`}>
                {section.keyArtifact}
              </span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (w-full lg:w-[55%]): OPEN, UNOBSTRUCTED 3D VIEWPORT         */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[55%] hidden lg:flex flex-col justify-center items-end min-h-[460px] pointer-events-none">
          {/* Subtle Technical HUD Telemetry Overlay on the open right side */}
          {section.id === 'ignition' && (
            <div className="p-3.5 rounded border border-amber-500/20 bg-neutral-950/30 backdrop-blur-xs font-mono text-[11px] text-neutral-400 space-y-1 text-right">
              <div className="text-[#e08a3c] font-semibold tracking-wider">
                // SILICON MONOLITHIC DIE MODEL
              </div>
              <div>SUBSTRATE: POWEREDGE SERVER ARCHITECTURE</div>
              <div>CLOCK RATE: ACTIVE PULSE ORBITAL DYNAMICS</div>
              <div className="text-neutral-500 text-[10px] pt-1">
                INTERACTIVE 3D VIEWPORT // USE MOUSE TO INSPECT
              </div>
            </div>
          )}

          {section.id === 'roots-structure' && (
            <div className="p-3.5 rounded border border-emerald-500/20 bg-neutral-950/30 backdrop-blur-xs font-mono text-[11px] text-neutral-400 space-y-1 text-right">
              <div className="text-[#34d399] font-semibold tracking-wider">
                // MUKTESHVARA TORANA ARCH 3D CAD
              </div>
              <div>MESH DENSITY: 1,240,000 SCULPTED POLYGONS</div>
              <div>FABRICATION: ±0.15MM COREXY + MSLA 12K</div>
              <div>METALLURGY: 325-MESH ATOMIZED BRONZE</div>
              <div className="text-neutral-500 text-[10px] pt-1">
                INTERACTIVE 3D VIEWPORT // USE MOUSE TO INSPECT
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Subtle Vertical Lifecycle Conduit */}
      {!isLast && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-10">
          <div className="relative w-[1px] h-14 bg-white/[0.08] overflow-hidden">
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

          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
            <span className={`w-1.5 h-1.5 rounded-full ${seasonPulseDot}`} />
            <span>Ch. {section.index}</span>
            <ChevronDown className="w-3 h-3 text-neutral-600" />
            {nextSection && <span>Ch. {nextSection.index}</span>}
          </div>
        </div>
      )}
    </section>
  );
}
