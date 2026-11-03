'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Layers,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Compass,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { NARRATIVE_SECTIONS, SEASONS } from '@/lib/portfolio-data';
import { SeasonId } from '@/types/portfolio';
import { RealSeasonId } from '@/lib/real-seasons';
import { soundEngine } from '@/components/sound/sound-synthesizer';
import { useIsMobile } from '@/hooks/use-mobile';
import { IsometricStoryArcScene } from './IsometricStoryArcScene';

interface SectionNavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSectionIdx: number;
  onNavigateSection: (sectionId: string) => void;
}

export function SectionNavigatorModal({
  isOpen,
  onClose,
  activeSectionIdx,
  onNavigateSection,
}: SectionNavigatorModalProps) {
  const isMobile = useIsMobile();
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<string | null>(null);
  const [hoveredSectionIdx, setHoveredSectionIdx] = useState<number | null>(null);
  const [cameraResetTrigger, setCameraResetTrigger] = useState(0);

  // Focus section is either the hovered one or the currently active one
  const focusedSection = useMemo(() => {
    const idx = hoveredSectionIdx !== null ? hoveredSectionIdx : activeSectionIdx;
    return NARRATIVE_SECTIONS[idx] || NARRATIVE_SECTIONS[0];
  }, [hoveredSectionIdx, activeSectionIdx]);

  // Handle direct section jump
  const handleJumpToSection = useCallback(
    (sectionId: string, seasonId: SeasonId | RealSeasonId) => {
      soundEngine.playSectionTransitionCue(seasonId);
      onNavigateSection(sectionId);
      onClose();
    },
    [onNavigateSection, onClose]
  );

  // Keyboard shortcut listener for numeric 1-8 jumps and Escape/M within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'm' || e.key === 'M') {
        // Toggle close
        e.preventDefault();
        onClose();
      } else if (e.key >= '1' && e.key <= '8') {
        const targetIdx = parseInt(e.key, 10) - 1;
        const target = NARRATIVE_SECTIONS[targetIdx];
        if (target) {
          e.preventDefault();
          handleJumpToSection(target.id, target.seasonId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleJumpToSection]);

  const seasonFilterOptions = useMemo(
    () => [
      { id: null, label: 'All Arc (8)', color: 'border-white/20 text-neutral-200' },
      { id: 'summer', label: 'Summer (2)', color: 'border-amber-500/40 text-amber-300' },
      { id: 'monsoon', label: 'Monsoon (2)', color: 'border-sky-500/40 text-sky-300' },
      { id: 'autumn', label: 'Autumn (1)', color: 'border-yellow-500/40 text-yellow-300' },
      { id: 'spring', label: 'Spring (3)', color: 'border-emerald-500/40 text-emerald-300' },
    ],
    []
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Story Arc 3D Isometric Navigator"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      >
        {/* Modal Window Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col w-full max-w-7xl h-[94vh] max-h-[920px] rounded-2xl bg-neutral-950/90 border border-white/10 shadow-2xl overflow-hidden font-sans text-neutral-200"
        >
          {/* Top Header Bar */}
          <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-neutral-900/60 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm md:text-base font-bold tracking-tight text-neutral-100 font-mono">
                    STORY ARC NAVIGATOR
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    3D ISOMETRIC VANTAGE
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono hidden md:block">
                  Career trajectory topology • Click nodes or press [1-8] to jump
                </p>
              </div>
            </div>

            {/* Season Filter Pills */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono">
              <span className="text-[11px] text-neutral-500 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                Filter:
              </span>
              {seasonFilterOptions.map((opt) => {
                const isSelected = selectedSeasonFilter === opt.id;
                return (
                  <button
                    key={opt.label}
                    onClick={() => {
                      soundEngine.playHapticFeedback('subtle');
                      setSelectedSeasonFilter(isSelected ? null : opt.id);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all text-[11px] border ${
                      isSelected
                        ? `${opt.color} bg-white/10 font-semibold shadow-sm`
                        : 'border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/15'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Actions: Reset View & Close */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  soundEngine.playHapticFeedback('subtle');
                  setCameraResetTrigger((c) => c + 1);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-neutral-300 bg-neutral-800/80 hover:bg-neutral-800 hover:text-white border border-white/10 transition-colors"
                title="Reset isometric camera angle"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset View</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playHapticFeedback('subtle');
                  onClose();
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-transparent hover:border-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Main 3D Viewport Area with Floating Inspector */}
          <div className="relative flex-1 w-full min-h-0 bg-neutral-950 overflow-hidden">
            {/* 3D Isometric Canvas Scene */}
            <IsometricStoryArcScene
              activeSectionIdx={activeSectionIdx}
              onNavigateSection={(id) => {
                const target = NARRATIVE_SECTIONS.find((s) => s.id === id);
                handleJumpToSection(id, target?.seasonId || 'summer');
              }}
              selectedSeasonFilter={selectedSeasonFilter}
              hoveredSectionIdx={hoveredSectionIdx}
              onHoverSection={setHoveredSectionIdx}
              isMobile={isMobile}
              cameraResetTrigger={cameraResetTrigger}
            />

            {/* Left Top: Interactive Navigation Instructions Badge */}
            <div className="absolute top-3 left-4 pointer-events-none hidden sm:flex flex-col gap-1 z-10 text-[11px] font-mono text-neutral-400 bg-neutral-950/70 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
              <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                3D Arc Controls
              </span>
              <span>• Left Drag: Rotate Arc</span>
              <span>• Scroll: Zoom In / Out</span>
              <span>• Click Node: Jump to Milestone</span>
            </div>

            {/* Right Top / Floating Section Inspector Card */}
            {focusedSection && (
              <div className="absolute top-3 right-4 max-w-sm w-full z-10 pointer-events-auto">
                <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-white/15 shadow-2xl text-xs font-mono">
                  {/* Card Header with Season Badge */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {focusedSection.index}
                      </span>
                      <span className="text-neutral-100 font-bold text-sm tracking-tight truncate">
                        {focusedSection.title}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 border border-white/10 px-1.5 py-0.5 rounded">
                      {focusedSection.seasonName}
                    </span>
                  </div>

                  {/* Subtitle & Role */}
                  <div className="space-y-1 mb-2.5">
                    <p className="text-neutral-200 font-medium leading-tight">
                      {focusedSection.subtitle}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {focusedSection.organization} • {focusedSection.period}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Role: {focusedSection.role}
                    </p>
                  </div>

                  {/* Highlight Metric */}
                  <div className="p-2 rounded-lg bg-neutral-900/80 border border-white/5 mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500">
                        {focusedSection.metrics[0]?.label}
                      </div>
                      <div className="text-base font-bold text-amber-300 font-mono">
                        {focusedSection.metrics[0]?.value}
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-neutral-400 max-w-[130px]">
                      {focusedSection.metrics[0]?.detail}
                    </div>
                  </div>

                  {/* Quick Summary excerpt */}
                  <p className="text-[11px] text-neutral-300 italic mb-3 line-clamp-2 leading-relaxed">
                    &ldquo;{focusedSection.quickSummary}&rdquo;
                  </p>

                  {/* Direct Jump CTA */}
                  <button
                    onClick={() => handleJumpToSection(focusedSection.id, focusedSection.seasonId)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs font-mono transition-all shadow-md group"
                  >
                    <span>Jump to Section {focusedSection.index}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Timeline Strip (Cards 01 - 08) */}
          <footer className="px-4 py-3 border-t border-white/10 bg-neutral-900/80 backdrop-blur-md shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Story Arc Nodes (Click to Jump or Press 1–8):
              </span>
              <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                Current Position: Section {activeSectionIdx + 1} of 8
              </span>
            </div>

            {/* Horizontal Timeline Track */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2">
              {NARRATIVE_SECTIONS.map((section, idx) => {
                const isActive = activeSectionIdx === idx;
                const isHovered = hoveredSectionIdx === idx;
                const seasonColor =
                  section.seasonId === 'summer'
                    ? 'hover:border-amber-500/50 hover:bg-amber-500/5'
                    : section.seasonId === 'monsoon'
                    ? 'hover:border-sky-500/50 hover:bg-sky-500/5'
                    : section.seasonId === 'autumn'
                    ? 'hover:border-yellow-500/50 hover:bg-yellow-500/5'
                    : 'hover:border-emerald-500/50 hover:bg-emerald-500/5';

                return (
                  <button
                    key={section.id}
                    onClick={() => handleJumpToSection(section.id, section.seasonId)}
                    onMouseEnter={() => {
                      setHoveredSectionIdx(idx);
                      soundEngine.playHapticFeedback('subtle');
                    }}
                    onMouseLeave={() => setHoveredSectionIdx(null)}
                    className={`p-2 rounded-lg border text-left transition-all font-mono relative flex flex-col justify-between ${
                      isActive
                        ? 'border-amber-400/80 bg-neutral-800/90 ring-1 ring-amber-400/40 text-neutral-100'
                        : isHovered
                        ? 'border-white/40 bg-neutral-800/60 text-neutral-100'
                        : 'border-white/5 bg-neutral-950/60 text-neutral-400'
                    } ${seasonColor}`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[10px] font-bold text-neutral-400">
                        {section.index}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[11px] font-semibold truncate leading-tight">
                      {section.title}
                    </div>
                    <div className="text-[9px] text-neutral-500 truncate mt-0.5">
                      {section.organization.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
