'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Sparkles, ChevronDown } from 'lucide-react';
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
  isActive,
  nextSection,
  isFirst = false,
  isLast = false,
}: NarrativeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { setMagneticTarget } = useCustomCursor();

  // Scroll-based parallax tracking for the text container
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [65, -65]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  // Section-specific scroll tracking for the thin progress bar across this narrative chapter
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

  // Lifecycle vertical connection line animations synced with scroll progress
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

  // Reactive mouse proximity tracking for expanding atmospheric glow rings
  const mouseProximity = useSpring(0, { stiffness: 180, damping: 25 });

  const ring1Scale = useTransform(mouseProximity, [0, 1], [0.985, 1.025]);
  const ring1Opacity = useTransform(mouseProximity, [0, 1], [0.12, 0.7]);

  const ring2Scale = useTransform(mouseProximity, [0, 1], [0.965, 1.055]);
  const ring2Opacity = useTransform(mouseProximity, [0, 1], [0.06, 0.45]);

  const ring3Scale = useTransform(mouseProximity, [0, 1], [0.94, 1.09]);
  const ring3Opacity = useTransform(mouseProximity, [0, 1], [0.02, 0.28]);

  const bloomOpacity = useTransform(mouseProximity, [0, 1], [0.06, 0.42]);

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      const cardRadius = Math.min(rect.width, rect.height) * 0.45;
      const maxDistance = cardRadius + 320;

      if (distance <= cardRadius) {
        mouseProximity.set(1);
      } else if (distance >= maxDistance) {
        mouseProximity.set(0);
      } else {
        const proximity = 1 - (distance - cardRadius) / (maxDistance - cardRadius);
        mouseProximity.set(Math.max(0, Math.min(1, proximity)));
      }
    }
  };

  const handleSectionMouseLeave = () => {
    mouseProximity.set(0);
    setIsHovered(false);
  };

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

  // bbsrguy.github.io styling & season accent maps
  const seasonColorClass = {
    summer: 'text-amber-400 group-hover:text-amber-300',
    monsoon: 'text-cyan-400 group-hover:text-cyan-300',
    autumn: 'text-yellow-400 group-hover:text-yellow-300',
    spring: 'text-emerald-400 group-hover:text-emerald-300',
    winter: 'text-sky-300 group-hover:text-sky-200',
  }[section.seasonId];

  const seasonBorderClass = {
    summer: 'hover:border-amber-500/40',
    monsoon: 'hover:border-cyan-400/40',
    autumn: 'hover:border-yellow-500/40',
    spring: 'hover:border-emerald-500/40',
    winter: 'hover:border-sky-400/40',
  }[section.seasonId];

  const seasonBadgeBorder = {
    summer: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    monsoon: 'border-cyan-400/30 text-cyan-400 bg-cyan-400/10',
    autumn: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
    spring: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    winter: 'border-sky-400/30 text-sky-300 bg-sky-400/10',
  }[section.seasonId];

  const seasonProgressGradient = {
    summer: 'from-amber-500 via-orange-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.7)]',
    monsoon: 'from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_12px_rgba(0,240,255,0.7)]',
    autumn: 'from-yellow-500 via-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.7)]',
    spring: 'from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]',
    winter: 'from-sky-400 via-cyan-300 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.7)]',
  }[section.seasonId];

  const seasonGlowRingStyles = {
    summer: {
      ring1: 'border-amber-400/50 shadow-[0_0_28px_rgba(245,158,11,0.32)]',
      ring2: 'border-amber-500/30 shadow-[0_0_45px_rgba(245,158,11,0.18)]',
      ring3: 'border-amber-500/15',
      ambientGlow: 'bg-amber-500/20',
      toolBorder: 'border-amber-500/30 shadow-[0_8px_32px_rgba(245,158,11,0.2)]',
      pulseDot: 'bg-amber-400',
      badge: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    },
    monsoon: {
      ring1: 'border-cyan-400/50 shadow-[0_0_28px_rgba(0,240,255,0.35)]',
      ring2: 'border-cyan-400/30 shadow-[0_0_45px_rgba(0,240,255,0.2)]',
      ring3: 'border-cyan-400/15',
      ambientGlow: 'bg-cyan-500/20',
      toolBorder: 'border-cyan-400/30 shadow-[0_8px_32px_rgba(0,240,255,0.2)]',
      pulseDot: 'bg-cyan-400',
      badge: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/30',
    },
    autumn: {
      ring1: 'border-yellow-400/50 shadow-[0_0_28px_rgba(234,179,8,0.32)]',
      ring2: 'border-yellow-400/30 shadow-[0_0_45px_rgba(234,179,8,0.18)]',
      ring3: 'border-yellow-400/15',
      ambientGlow: 'bg-yellow-500/20',
      toolBorder: 'border-yellow-500/30 shadow-[0_8px_32px_rgba(234,179,8,0.2)]',
      pulseDot: 'bg-yellow-400',
      badge: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
    },
    spring: {
      ring1: 'border-emerald-400/50 shadow-[0_0_28px_rgba(16,185,129,0.32)]',
      ring2: 'border-emerald-400/30 shadow-[0_0_45px_rgba(16,185,129,0.18)]',
      ring3: 'border-emerald-400/15',
      ambientGlow: 'bg-emerald-500/20',
      toolBorder: 'border-emerald-500/30 shadow-[0_8px_32px_rgba(16,185,129,0.2)]',
      pulseDot: 'bg-emerald-400',
      badge: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    },
    winter: {
      ring1: 'border-sky-400/50 shadow-[0_0_28px_rgba(56,189,248,0.32)]',
      ring2: 'border-sky-400/30 shadow-[0_0_45px_rgba(56,189,248,0.18)]',
      ring3: 'border-sky-400/15',
      ambientGlow: 'bg-sky-500/20',
      toolBorder: 'border-sky-500/30 shadow-[0_8px_32px_rgba(56,189,248,0.2)]',
      pulseDot: 'bg-sky-400',
      badge: 'text-sky-300 bg-sky-500/15 border-sky-400/30',
    },
  }[section.seasonId];

  return (
    <section
      ref={sectionRef}
      id={section.id}
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="min-h-screen flex items-center justify-center py-24 px-4 md:px-12 relative overflow-x-clip"
    >
      {/* Full-Width Section Boundary Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.04] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className={`h-full w-full bg-gradient-to-r ${seasonProgressGradient} opacity-50`}
        />
      </div>

      {/* Parallax Container */}
      <motion.div
        style={{ y: parallaxY, opacity: opacityFade }}
        className="w-full max-w-4xl relative"
      >
        {/* Seasonal Glow Rings */}
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <motion.div
            style={{ scale: ring1Scale, opacity: ring1Opacity }}
            className={`absolute -inset-2 sm:-inset-3 rounded-2xl sm:rounded-3xl border transition-colors duration-300 ${seasonGlowRingStyles.ring1}`}
          />
          <motion.div
            style={{ scale: ring2Scale, opacity: ring2Opacity }}
            className={`absolute -inset-4 sm:-inset-6 rounded-3xl border border-dashed transition-colors duration-300 ${seasonGlowRingStyles.ring2}`}
          />
          <motion.div
            style={{ scale: ring3Scale, opacity: ring3Opacity }}
            className={`absolute -inset-7 sm:-inset-10 rounded-[2rem] border transition-colors duration-300 ${seasonGlowRingStyles.ring3}`}
          />
          <motion.div
            style={{ opacity: bloomOpacity }}
            className={`absolute -inset-4 sm:-inset-6 rounded-3xl blur-2xl transition-colors duration-300 ${seasonGlowRingStyles.ambientGlow}`}
          />
        </div>

        {/* bbsrguy.github.io Aesthetic: Obsidian Dark Glass Card (#090d16/90) */}
        <motion.div
          ref={cardRef}
          onMouseEnter={() => {
            setIsHovered(true);
            mouseProximity.set(1);
            updateMagneticTarget();
            soundEngine.playHapticFeedback('card');
          }}
          onMouseMove={updateMagneticTarget}
          onMouseLeave={() => {
            setIsHovered(false);
            handleCardMouseLeave();
          }}
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ margin: '-20% 0px -20% 0px' }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`p-6 sm:p-10 rounded-2xl bg-[#090d16]/90 backdrop-blur-xl border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.7)] transition-all duration-300 relative overflow-hidden ${seasonBorderClass}`}
        >
          {/* Incoming lifecycle connection node */}
          {!isFirst && (
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-30 w-3 h-3 rounded-full border border-white/20 bg-[#090d16] flex items-center justify-center shadow-sm pointer-events-none"
              aria-hidden="true"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${seasonGlowRingStyles.pulseDot}`} />
            </div>
          )}

          {/* Thin Animated Section Scroll Progress Bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] bg-white/[0.06] overflow-hidden z-20 pointer-events-none"
            aria-hidden="true"
          >
            <motion.div
              style={{ scaleX, transformOrigin: '0%' }}
              className={`h-full w-full bg-gradient-to-r ${seasonProgressGradient}`}
            />
          </div>

          {/* Quick Summary Floating Tool */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                onMouseEnter={() => soundEngine.playHapticFeedback('subtle')}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-4 right-4 sm:top-5 sm:right-6 z-30 max-w-[85%] sm:max-w-md pointer-events-auto"
              >
                <div
                  className={`p-3.5 sm:p-4 rounded-xl bg-[#060913]/95 backdrop-blur-xl border shadow-2xl transition-all duration-300 ${seasonGlowRingStyles.toolBorder}`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${seasonGlowRingStyles.pulseDot}`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${seasonGlowRingStyles.pulseDot}`}
                        />
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-neutral-300 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-neutral-400" />
                        Quick Summary
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-medium ${seasonGlowRingStyles.badge}`}
                    >
                      {section.metrics[0].value}
                    </span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-neutral-200 leading-relaxed font-sans font-normal">
                    {section.quickSummary ||
                      `${section.metrics[0].label}: ${section.metrics[0].value} — ${section.metrics[0].detail}.`}
                  </p>

                  <div className="mt-2 pt-1.5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>Key Metric: {section.metrics[0].label}</span>
                    <span className="text-neutral-500">{section.seasonName}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* bbsrguy.github.io JetBrains Mono Kicker Badges */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2.5 text-xs font-mono mb-5 pb-3.5 border-b border-white/[0.08]"
          >
            {/* Primary JetBrains Mono Kicker Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono font-semibold tracking-wider uppercase ${seasonBadgeBorder}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${seasonGlowRingStyles.pulseDot}`} />
              <span>{section.index} // {section.seasonName}</span>
            </div>

            <span className="text-white/20 select-none">/</span>

            {/* Organization Tag */}
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[11px] text-neutral-300 font-mono">
              {section.organization}
            </span>

            <span className="text-white/20 select-none">/</span>

            {/* Period */}
            <span className="text-[11px] text-neutral-400 font-mono">
              {section.period}
            </span>

            <span className="text-white/20 select-none">/</span>

            {/* Location */}
            <span className="text-[11px] text-neutral-500 font-mono">
              {section.location}
            </span>
          </motion.div>

          {/* Section Heading & Subtitle */}
          <div className="mb-6">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-100 mb-2"
            >
              {section.title}
            </motion.h2>
            <p className="text-sm sm:text-base font-medium text-neutral-300">
              {section.subtitle}
            </p>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              Role: {section.role}
            </p>
          </div>

          {/* Executive Summary */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8 max-w-3xl"
          >
            {section.summary}
          </motion.p>

          {/* bbsrguy.github.io High-Contrast Telemetry Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 p-4 sm:p-5 rounded-xl bg-[#040711]/90 border border-white/[0.08] shadow-inner"
          >
            {section.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1.5 transition-colors hover:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-medium">
                    {metric.label}
                  </span>
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded border ${seasonGlowRingStyles.badge}`}>
                    TEL-0{idx + 1}
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-mono font-bold tabular-nums text-white tracking-tight block">
                  {metric.value}
                </span>
                <span className="text-xs text-neutral-300 leading-relaxed font-sans block">
                  {metric.detail}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Core Technical Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-2.5 mb-8"
          >
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
              Core Technical Contributions
            </span>
            <ul className="space-y-2">
              {section.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                  <span className="font-mono text-xs text-neutral-500 mt-1 shrink-0">
                    0{idx + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Technologies & Key Artifact Footer */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="text-neutral-500">Stack:</span>
              {section.technologies.map((tech, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-neutral-300">{tech}</span>
                  {idx < section.technologies.length - 1 && (
                    <span className="text-neutral-600">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {section.keyArtifact && (
              <div
                onMouseEnter={() => soundEngine.playHapticFeedback('subtle')}
                className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 group cursor-default"
              >
                <span className="text-neutral-500">Artifact:</span>
                <span className={`${seasonColorClass} transition-colors`}>
                  {section.keyArtifact}
                </span>
              </div>
            )}
          </div>

          {/* Narrative Bridge to next era */}
          {section.bridgeText && (
            <div className="mt-4 pt-3 border-t border-white/[0.08] text-xs text-neutral-400 italic">
              ↳ {section.bridgeText}
            </div>
          )}
        </motion.div>

        {/* Vertical Lifecycle Conduit Flow */}
        {!isLast && (
          <div className="relative flex flex-col items-center w-full mt-4 -mb-16 sm:-mb-20 pointer-events-auto z-10">
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.35, 0, 0.35],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`absolute w-6 h-6 rounded-full ${seasonGlowRingStyles.pulseDot}`}
              />
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 bg-[#090d16] flex items-center justify-center ${seasonGlowRingStyles.ring1}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${seasonGlowRingStyles.pulseDot}`} />
              </div>
            </div>

            <div className="relative w-full flex flex-col items-center py-0.5">
              <div className="relative w-[2px] h-28 sm:h-36 md:h-44 bg-white/[0.08] overflow-hidden rounded-full">
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
                  className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-10 -mt-5 rounded-full blur-[2px] bg-gradient-to-b ${lifecycleGradient}`}
                />
                <motion.div
                  style={{
                    top: pulsePosition,
                    opacity: pulseGlowOpacity,
                  }}
                  className="absolute left-1/2 -translate-x-1/2 w-1 h-6 -mt-3 rounded-full bg-white shadow-[0_0_8px_#fff]"
                />
              </div>

              <motion.div
                style={{
                  opacity: connectorAmbientGlow,
                }}
                className={`absolute w-10 h-28 sm:h-36 md:h-44 blur-xl pointer-events-none -z-10 bg-gradient-to-b ${lifecycleGradient}`}
              />

              <motion.div
                onMouseEnter={() => soundEngine.playHapticFeedback('subtle')}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-[#060913]/90 backdrop-blur-md border border-white/10 shadow-xl text-[10px] font-mono text-neutral-400 group cursor-default hover:border-white/20 transition-all z-20"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${seasonGlowRingStyles.pulseDot}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-1.5 w-1.5 ${seasonGlowRingStyles.pulseDot}`}
                  />
                </span>
                <span className="font-semibold text-neutral-300">
                  Lifecycle Flow
                </span>
                <span className="text-neutral-600">·</span>
                <span className={seasonColorClass}>
                  {section.index}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-neutral-400 animate-bounce" />
                {nextSection && (
                  <span className="text-neutral-400">
                    {nextSection.index}
                  </span>
                )}
              </motion.div>
            </div>

            <div className="relative flex items-center justify-center">
              <div
                className={`w-2.5 h-2.5 rounded-full border border-white/20 bg-[#090d16] transition-colors ${seasonGlowRingStyles.pulseDot}`}
              />
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
