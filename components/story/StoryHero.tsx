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
        {/* Editorial Subtitle Kicker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm font-mono tracking-widest text-amber-400 font-semibold uppercase"
        >
          <span>NEERAJ THAMBA // FOUNDER & SYSTEMS STRATEGIST</span>
        </motion.div>

        {/* Primary Headline: High-Contrast Editorial Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.05] sm:leading-[1.0] text-balance"
        >
          Systems, Capital & Physical Form.
        </motion.h1>

        {/* Storytelling Subheading (Monospace, text-neutral-400) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base md:text-lg font-mono text-neutral-400 max-w-3xl mx-auto leading-relaxed"
        >
          Eight years spanning edge hardware diagnostics at Amazon, enterprise compute at Dell, $4.2M in Google ad auctions, private wealth allocation at ICICI Bank, and sub-millimeter 3D additive heritage manufacturing at Templecity Atelier.
        </motion.p>

        {/* Clean Monospace Index Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="py-4 border-y border-white/[0.08] max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono tracking-wider text-neutral-300"
        >
          <span className="hover:text-amber-400 transition-colors">01 HARDWARE</span>
          <span className="text-neutral-600 select-none">·</span>
          <span className="hover:text-cyan-400 transition-colors">02 ADTECH</span>
          <span className="text-neutral-600 select-none">·</span>
          <span className="hover:text-yellow-400 transition-colors">03 WEALTH</span>
          <span className="text-neutral-600 select-none">·</span>
          <span className="hover:text-emerald-400 transition-colors">04 ADDITIVE CRAFT</span>
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
