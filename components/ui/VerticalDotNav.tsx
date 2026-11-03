'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { NARRATIVE_SECTIONS } from '@/lib/portfolio-data';
import { SeasonId } from '@/types/portfolio';
import { soundEngine } from '@/components/sound/sound-synthesizer';

interface VerticalDotNavProps {
  activeSectionIdx: number;
  onNavigateSection: (sectionId: string) => void;
  onOpenNavigator?: () => void;
}

export function VerticalDotNav({
  activeSectionIdx,
  onNavigateSection,
  onOpenNavigator,
}: VerticalDotNavProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Map season to active styling
  const getSeasonDotStyle = (seasonId: SeasonId, isActive: boolean) => {
    if (!isActive) return 'bg-neutral-700 hover:bg-neutral-400 w-2 h-2';

    switch (seasonId) {
      case 'summer':
        return 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)] w-2.5 h-6';
      case 'monsoon':
        return 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.6)] w-2.5 h-6';
      case 'autumn':
        return 'bg-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.6)] w-2.5 h-6';
      case 'spring':
        return 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)] w-2.5 h-6';
      default:
        return 'bg-amber-400 w-2.5 h-6';
    }
  };

  const getSeasonTextColor = (seasonId: SeasonId) => {
    switch (seasonId) {
      case 'summer':
        return 'text-amber-400';
      case 'monsoon':
        return 'text-sky-400';
      case 'autumn':
        return 'text-yellow-400';
      case 'spring':
        return 'text-emerald-400';
      default:
        return 'text-amber-400';
    }
  };

  return (
    <nav
      aria-label="Story chapter navigation"
      className="fixed right-5 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3 pointer-events-auto"
    >
      {NARRATIVE_SECTIONS.map((section, idx) => {
        const isActive = activeSectionIdx === idx;
        const isHovered = hoveredIdx === idx;
        const dotStyle = getSeasonDotStyle(section.seasonId, isActive);
        const textColor = getSeasonTextColor(section.seasonId);

        return (
          <div
            key={section.id}
            className="relative flex items-center justify-end group"
            onMouseEnter={() => {
              setHoveredIdx(idx);
              soundEngine.playHapticFeedback('dot');
            }}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Slide-out Tooltip on Hover or Active focus */}
            <div
              className={`absolute right-7 py-1 px-2.5 rounded-lg bg-neutral-950/90 backdrop-blur-md border border-white/10 shadow-xl whitespace-nowrap transition-all duration-200 pointer-events-none flex items-center gap-2 ${
                isHovered
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-2'
              }`}
            >
              <span className={`text-[11px] font-mono font-semibold ${textColor}`}>
                {section.index}
              </span>
              <span className="text-neutral-500 text-[10px]">·</span>
              <span className="text-xs font-mono text-neutral-200">
                {section.title}
              </span>
              <span className="text-neutral-600 text-[10px]">·</span>
              <span className="text-[11px] font-mono text-neutral-400">
                {section.organization.split(' ')[0]}
              </span>
            </div>

            {/* Clickable Dot Anchor */}
            <button
              onClick={() => onNavigateSection(section.id)}
              aria-label={`Scroll to Chapter ${section.index}: ${section.title}`}
              aria-current={isActive ? 'step' : undefined}
              className="p-1.5 focus:outline-none flex items-center justify-center transition-transform hover:scale-110"
            >
              <div
                className={`rounded-full transition-all duration-300 ${dotStyle}`}
              />
            </button>
          </div>
        );
      })}

      {/* 3D Arc Navigator Modal Trigger */}
      {onOpenNavigator && (
        <button
          onClick={() => {
            soundEngine.playHapticFeedback('card');
            onOpenNavigator();
          }}
          aria-label="Open 3D Story Arc Navigator (Press M)"
          title="Open 3D Story Arc Navigator (Press M)"
          className="mt-2 p-1.5 rounded-lg text-neutral-500 hover:text-sky-300 hover:bg-neutral-900 border border-transparent hover:border-white/10 transition-all group"
        >
          <Layers className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </nav>
  );
}
