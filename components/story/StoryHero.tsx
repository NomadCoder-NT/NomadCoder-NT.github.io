'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Terminal, Compass } from 'lucide-react';

interface StoryHeroProps {
  onBeginJourney: () => void;
  onOpenTerminal: () => void;
}

export function StoryHero({ onBeginJourney, onOpenTerminal }: StoryHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.75], [1, 0.2]);

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-12 relative pt-20 pb-16 overflow-hidden"
    >
      <motion.div
        style={{ y: parallaxY, opacity: opacityFade }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Editorial Subtitle Kicker (Zero pill, clean unboxed text) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm font-mono text-neutral-400"
        >
          <span className="text-amber-400 font-semibold">nomadcoder-nt</span>
          <span aria-hidden="true">·</span>
          <span>Performance Marketing & Digital Strategy</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400">AI Systems & 3D WebGL Engineering</span>
        </motion.div>

        {/* Primary Headline with balanced wrap */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-100 max-w-4xl leading-tight sm:leading-none text-balance"
        >
          The Seasons of Growth
        </motion.h1>

        {/* Storytelling Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed"
        >
          An atmospheric spatial journey across eight transformative chapters—from enterprise hardware and multi-million dollar ad networks to generative intelligence and 3D WebGL graphics.
        </motion.p>

        {/* Lifecycle Season Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 max-w-2xl mx-auto text-left"
        >
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-amber-400 block font-semibold">01 · Summer</span>
            <span className="text-xs text-neutral-300 font-medium block">Hardware Pressure</span>
            <span className="text-[11px] text-neutral-500 block">Amazon & Dell</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-sky-400 block font-semibold">02 · Monsoon</span>
            <span className="text-xs text-neutral-300 font-medium block">Performance Data</span>
            <span className="text-[11px] text-neutral-500 block">Google Ops & Accenture</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-yellow-400 block font-semibold">03 · Autumn</span>
            <span className="text-xs text-neutral-300 font-medium block">Compound Yield</span>
            <span className="text-[11px] text-neutral-500 block">ICICI Bank Private</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-white/5 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-emerald-400 block font-semibold">04 · Spring</span>
            <span className="text-xs text-neutral-300 font-medium block">Spatial & Neural</span>
            <span className="text-[11px] text-neutral-500 block">Templecity & AI</span>
          </div>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6"
        >
          <button
            onClick={onBeginJourney}
            className="flex items-center justify-center gap-2 px-6 py-3 text-xs md:text-sm font-mono font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap shrink-0"
          >
            <span>Begin Narrative Scroll</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          <button
            onClick={onOpenTerminal}
            className="flex items-center justify-center gap-2 px-6 py-3 text-xs md:text-sm font-mono font-medium text-neutral-200 bg-neutral-900 border border-white/10 hover:border-white/25 hover:bg-neutral-800 rounded-lg transition-all whitespace-nowrap shrink-0"
          >
            <Terminal className="w-4 h-4 text-neutral-400" />
            <span>Open Terminal [~]</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Guide at Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-mono text-neutral-400 pointer-events-none">
        <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Scroll to traverse seasons & 3D canvas</span>
      </div>
    </section>
  );
}
