'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Terminal } from 'lucide-react';

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

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.75], [1, 0.2]);

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-8 md:px-12 relative pt-24 pb-16 overflow-hidden"
    >
      <motion.div
        style={{ y: parallaxY, opacity: opacityFade }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Monospace Kicker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm font-mono tracking-widest text-neutral-400 uppercase font-medium"
        >
          <span>NEERAJ THAMBA · FOUNDER & CREATIVE TECHNOLOGIST</span>
        </motion.div>

        {/* Clean, Confident Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.18] sm:leading-[1.15] text-balance max-w-4xl mx-auto font-sans"
        >
          Eight years across edge compute, algorithmic adtech auctions, wealth stewardship, and sub-millimeter 3D additive manufacturing.
        </motion.h1>

        {/* Clean Horizontal Status Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="py-3 px-4 border-y border-white/[0.08] max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono text-neutral-400 tracking-wider"
        >
          <span>LOCATION: BHUBANESWAR, INDIA</span>
          <span className="text-white/20 select-none">//</span>
          <span className="text-neutral-300">STACK: NEXT.JS 15 · THREE.JS · CAD</span>
          <span className="text-white/20 select-none">//</span>
          <span className="text-emerald-400 font-semibold">STATUS: AVAILABLE FOR CONSULTING</span>
        </motion.div>

        {/* Minimalist Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={onBeginJourney}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 rounded transition-all"
          >
            <span>Read Dossier</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>

          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono text-neutral-400 hover:text-white bg-transparent border border-white/[0.08] hover:border-white/20 rounded transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal [~]</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
