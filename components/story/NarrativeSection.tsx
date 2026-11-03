'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { NarrativeSectionData, SeasonId } from '@/types/portfolio';
import { useCustomCursor } from '@/components/ui/CustomCursorContext';
import { soundEngine } from '@/components/sound/sound-synthesizer';

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
  isFirst = false,
  isLast = false,
}: NarrativeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [, setIsHovered] = useState(false);
  const { setMagneticTarget } = useCustomCursor();

  // Scroll-based parallax tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.65, 1, 1, 0.65]);

  // Section progress for thin lifecycle top indicator
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

  // Lifecycle vertical connection line animations
  const connectionLineScale = useTransform(smoothProgress, [0.28, 0.96], [0.12, 1]);
  const pulsePosition = useTransform(smoothProgress, [0.22, 0.96], ['0%', '94%']);
  const pulseGlowOpacity = useTransform(smoothProgress, [0.15, 0.45, 0.85, 1], [0.2, 1, 1, 0.35]);
  const connectorAmbientGlow = useTransform(smoothProgress, [0.25, 0.7, 1], [0.12, 0.55, 0.25]);

  const getLifecycleGradient = (currentSeason: SeasonId, nextSeason?: SeasonId) => {
    const target = nextSeason || currentSeason;
    if (currentSeason === 'summer' && target === 'summer') {
      return 'from-amber-400 via-orange-400 to-amber-500';
    }
    if (currentSeason === 'summer' && target === 'monsoon') {
      return 'from-amber-400 via-teal-400 to-cyan-400';
    }
    if (currentSeason === 'monsoon' && target === 'monsoon') {
      return 'from-cyan-400 via-sky-500 to-blue-400';
    }
    if (currentSeason === 'monsoon' && target === 'autumn') {
      return 'from-cyan-400 via-amber-300 to-yellow-400';
    }
    if (currentSeason === 'autumn' && target === 'autumn') {
      return 'from-yellow-400 via-amber-500 to-yellow-500';
    }
    if (currentSeason === 'autumn' && target === 'spring') {
      return 'from-yellow-400 via-emerald-400 to-teal-400';
    }
    if (currentSeason === 'spring' && target === 'winter') {
      return 'from-emerald-400 via-teal-400 to-sky-400';
    }
    if (currentSeason === 'winter' && target === 'winter') {
      return 'from-sky-400 via-cyan-400 to-blue-500';
    }
    return 'from-emerald-400 via-teal-400 to-cyan-400';
  };

  const lifecycleGradient = getLifecycleGradient(section.seasonId, nextSection?.seasonId);

  const updateMagneticTarget = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMagneticTarget({
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        seasonId: section.seasonId,
      });
    }
  };

  const handleCardMouseLeave = () => {
    setMagneticTarget(null);
  };

  // Editorial Season Accent Tokens
  const seasonColorClass = {
    summer: 'text-amber-400',
    monsoon: 'text-cyan-400',
    autumn: 'text-yellow-400',
    spring: 'text-emerald-400',
    winter: 'text-sky-300',
  }[section.seasonId];

  const seasonBorderLClass = {
    summer: 'border-l-amber-500/60 hover:border-l-amber-400',
    monsoon: 'border-l-cyan-400/60 hover:border-l-cyan-300',
    autumn: 'border-l-yellow-500/60 hover:border-l-yellow-400',
    spring: 'border-l-emerald-500/60 hover:border-l-emerald-400',
    winter: 'border-l-sky-400/60 hover:border-l-sky-300',
  }[section.seasonId];

  const seasonProgressGradient = {
    summer: 'from-amber-500 via-orange-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.7)]',
    monsoon: 'from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_12px_rgba(0,240,255,0.7)]',
    autumn: 'from-yellow-500 via-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.7)]',
    spring: 'from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]',
    winter: 'from-sky-400 via-cyan-300 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.7)]',
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

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-8 md:px-12 relative overflow-x-clip pointer-events-none"
    >
      {/* Full-Width Section Boundary Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.05] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className={`h-full w-full bg-gradient-to-r ${seasonProgressGradient} opacity-60`}
        />
      </div>

      {/* Asymmetric Editorial Magazine Container */}
      <motion.div
        style={{ y: parallaxY, opacity: opacityFade }}
        className="w-full max-w-7xl mx-auto relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Clean Sticky Header with Candid First-Person Narrative (w-full md:w-5/12) */}
          <div className="w-full md:col-span-5 md:sticky md:top-28 space-y-6 pointer-events-auto">
            {/* Monospace Kicker */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold"
            >
              <span className={`w-2 h-2 rounded-full ${seasonPulseDot}`} />
              <span className={seasonColorClass}>
                {section.index} // {section.seasonName.toUpperCase()}
              </span>
            </motion.div>

            {/* Section Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {section.title}
              </h2>
              <p className="text-sm sm:text-base font-mono text-neutral-300 font-medium leading-snug">
                {section.subtitle}
              </p>
            </motion.div>

            {/* Company Metadata Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs font-mono"
            >
              <div className="text-neutral-100 font-semibold text-sm">
                {section.organization}
              </div>
              <div className="text-neutral-400">
                {section.period} · <span className="text-neutral-500">{section.location}</span>
              </div>
              <div className="text-neutral-300 text-[11px] pt-0.5">
                Role: {section.role}
              </div>
            </motion.div>

            {/* Candid 2-Paragraph Narrative written in First Person */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-sans pt-1"
            >
              {paragraphs.map((p, idx) => (
                <p key={idx} className="text-neutral-300/95 leading-relaxed font-normal">
                  {p}
                </p>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Asymmetric Data Breakdown & Technical Highlights (w-full md:w-7/12) */}
          <div className="w-full md:col-span-7">
            <motion.div
              ref={cardRef}
              onMouseEnter={() => {
                setIsHovered(true);
                updateMagneticTarget();
                soundEngine.playHapticFeedback('card');
              }}
              onMouseMove={updateMagneticTarget}
              onMouseLeave={() => {
                setIsHovered(false);
                handleCardMouseLeave();
              }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-8 rounded-2xl bg-[#090d16]/55 backdrop-blur-md border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.55)] space-y-8 relative hover:border-white/15 transition-all duration-300 pointer-events-auto"
            >
              {/* Large Typography Metrics (No TEL-01 labels) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pb-8 border-b border-white/[0.08]">
                {section.metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white tabular-nums">
                      {metric.value}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                      {metric.label}
                    </div>
                    <p className="text-xs text-neutral-400 leading-normal font-sans pt-0.5">
                      {metric.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Technical Contributions (Clean border-l-2 quote blocks) */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                  Technical Contributions & Deliverables
                </div>
                <div className="space-y-3.5">
                  {section.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className={`border-l-2 pl-4 py-1 text-sm sm:text-[14px] text-neutral-300 leading-relaxed transition-colors ${seasonBorderLClass}`}
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Clean Horizontal Tech Stack Row with Monospace Dividers */}
              <div className="pt-6 border-t border-white/[0.08] space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                  Systems, Tooling & Infrastructure
                </div>
                <div className="text-xs sm:text-sm font-mono text-neutral-300 flex flex-wrap items-center gap-y-1.5 leading-relaxed">
                  {section.technologies.map((tech, idx) => (
                    <React.Fragment key={idx}>
                      <span className="hover:text-white transition-colors">{tech}</span>
                      {idx < section.technologies.length - 1 && (
                        <span className="text-neutral-600 px-2.5 select-none font-sans">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {section.keyArtifact && (
                  <div className="pt-2 text-xs font-mono text-neutral-400 flex flex-wrap items-center gap-2">
                    <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                      Key Artifact:
                    </span>
                    <span className={`${seasonColorClass} font-medium`}>
                      {section.keyArtifact}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Subtle Vertical Lifecycle Conduit */}
        {!isLast && (
          <div className="relative flex flex-col items-center w-full mt-10 -mb-12 pointer-events-auto z-10">
            <div className="relative w-full flex flex-col items-center py-0.5">
              <div className="relative w-[2px] h-20 sm:h-28 bg-white/[0.08] overflow-hidden rounded-full">
                <motion.div
                  style={{
                    scaleY: connectionLineScale,
                    transformOrigin: 'top',
                  }}
                  className={`absolute inset-0 w-full bg-gradient-to-b ${lifecycleGradient} shadow-[0_0_12px_rgba(255,255,255,0.45)]`}
                />
                <motion.div
                  style={{
                    top: pulsePosition,
                    opacity: pulseGlowOpacity,
                  }}
                  className={`absolute left-1/2 -translate-x-1/2 w-2 h-8 -mt-4 rounded-full blur-[2px] bg-gradient-to-b ${lifecycleGradient}`}
                />
              </div>

              <motion.div
                style={{
                  opacity: connectorAmbientGlow,
                }}
                className={`absolute w-8 h-20 sm:h-28 blur-xl pointer-events-none -z-10 bg-gradient-to-b ${lifecycleGradient}`}
              />

              <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-[#060913]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-400">
                <span className={`w-1.5 h-1.5 rounded-full ${seasonPulseDot}`} />
                <span className="text-neutral-300 font-medium">Chapter {section.index}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400 animate-bounce" />
                {nextSection && (
                  <span className="text-neutral-400">Chapter {nextSection.index}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
