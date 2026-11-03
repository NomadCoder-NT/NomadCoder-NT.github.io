'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Compass, Sparkles, ChevronUp, Check, Layers } from 'lucide-react';
import { soundEngine } from '@/components/sound/sound-synthesizer';
import { SeasonMode } from '@/components/canvas/StoryScene';
import { getRealCurrentSeason, REAL_SEASONS, RealSeasonId } from '@/lib/real-seasons';
import { NARRATIVE_SECTIONS } from '@/lib/portfolio-data';

interface ScrollProgressHUDProps {
  scrollProgress: number;
  currentSectionIndex: number;
  seasonMode: SeasonMode;
  onSetSeasonMode: (mode: SeasonMode) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenNavigator?: () => void;
}

export function ScrollProgressHUD({
  scrollProgress,
  currentSectionIndex,
  seasonMode,
  onSetSeasonMode,
  onNavigateSection,
  onOpenNavigator,
}: ScrollProgressHUDProps) {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isSeasonPickerOpen, setIsSeasonPickerOpen] = useState(false);

  const realSeason = getRealCurrentSeason();

  const toggleSound = () => {
    const active = soundEngine.toggleMute();
    setIsPlayingSound(active);
  };

  // Determine season meta based on mode
  let seasonLabel = 'Summer Heat';
  let seasonColor = 'text-amber-400 border-amber-500/30';
  let seasonEra = 'Amazon / Dell Era';

  if (seasonMode === 'live') {
    seasonLabel = `Live: ${realSeason.name}`;
    seasonColor = `${realSeason.accentColor} border-white/20`;
    seasonEra = `Calendar (${realSeason.months})`;
  } else if (seasonMode !== 'story') {
    const explicit = REAL_SEASONS[seasonMode as RealSeasonId];
    if (explicit) {
      seasonLabel = `${explicit.emoji} ${explicit.name}`;
      seasonColor = `${explicit.accentColor} border-white/20`;
      seasonEra = explicit.months;
    }
  } else {
    // Story scroll mode
    if (scrollProgress > 0.72) {
      seasonLabel = 'Digital Spring';
      seasonColor = 'text-emerald-400 border-emerald-500/30';
      seasonEra = 'AI Systems & WebGL';
    } else if (scrollProgress > 0.5) {
      seasonLabel = 'Autumn Yield';
      seasonColor = 'text-yellow-400 border-yellow-500/30';
      seasonEra = 'ICICI Bank Era';
    } else if (scrollProgress > 0.25) {
      seasonLabel = 'Monsoon Rains';
      seasonColor = 'text-sky-400 border-sky-500/30';
      seasonEra = 'Google Ops / Accenture';
    }
  }

  const percentage = Math.min(100, Math.max(0, Math.round(scrollProgress * 100)));

  return (
    <aside
      aria-label="Scroll progress and atmosphere"
      className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 z-30 pointer-events-auto"
    >
      {/* Real Seasons Switcher Dropdown Popover */}
      {isSeasonPickerOpen && (
        <div className="mb-2 p-2.5 rounded-xl bg-neutral-950/95 backdrop-blur-md border border-white/10 shadow-2xl text-xs font-mono max-w-xs ml-auto">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
            <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Real Seasons & 3D Atmosphere
            </span>
            <button
              onClick={() => setIsSeasonPickerOpen(false)}
              className="text-neutral-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1">
            {/* Story Scroll Mode */}
            <button
              onClick={() => {
                onSetSeasonMode('story');
                setIsSeasonPickerOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                seasonMode === 'story'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <span>📜 Story Scroll (Chapters 01–08)</span>
              {seasonMode === 'story' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            {/* Live Real-World Calendar Sync */}
            <button
              onClick={() => {
                onSetSeasonMode('live');
                setIsSeasonPickerOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                seasonMode === 'live'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <span>🌐 Live Calendar Sync ({realSeason.emoji} {realSeason.name.split(' ')[0]})</span>
              {seasonMode === 'live' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <div className="pt-1.5 border-t border-white/5 my-1 text-[10px] text-neutral-500 uppercase tracking-wider px-2.5">
              Specific Real Seasons:
            </div>

            {(['spring', 'summer', 'monsoon', 'autumn', 'winter'] as RealSeasonId[]).map((sId) => {
              const meta = REAL_SEASONS[sId];
              const isSelected = seasonMode === sId;
              return (
                <button
                  key={sId}
                  onClick={() => {
                    onSetSeasonMode(sId);
                    setIsSeasonPickerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 text-white font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <span>
                    {meta.emoji} {meta.name} <span className="text-neutral-500 text-[10px]">({meta.months})</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main HUD Bar */}
      <div className="flex items-center justify-between md:justify-end gap-3 p-2 px-3.5 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-white/10 shadow-2xl">
        {/* Clickable Season Mode Trigger */}
        <button
          onClick={() => setIsSeasonPickerOpen((prev) => !prev)}
          title="Change 3D canvas season atmosphere"
          className="flex items-center gap-2 text-xs font-mono text-left hover:opacity-80 transition-opacity"
        >
          <Compass className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className={`font-semibold ${seasonColor.split(' ')[0]}`}>
              {seasonLabel}
            </span>
            <span className="hidden sm:inline text-neutral-600">·</span>
            <span className="text-neutral-400 text-[11px] sm:text-xs">
              {seasonEra}
            </span>
          </div>
          <ChevronUp className={`w-3 h-3 text-neutral-500 transition-transform ${isSeasonPickerOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Section Scrubber Dots */}
        <div className="flex items-center gap-1.5">
          {NARRATIVE_SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => onNavigateSection(section.id)}
              onMouseEnter={() => soundEngine.playHapticFeedback('dot')}
              title={`Jump to chapter ${section.index} · ${section.title}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSectionIndex === idx
                  ? 'w-5 bg-amber-400 shadow-sm shadow-amber-400/50'
                  : 'w-2 bg-neutral-700 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>

        {/* Progress Percentage */}
        <span className="text-xs font-mono tabular-nums text-neutral-400 min-w-[34px] text-right">
          {percentage}%
        </span>

        {/* 3D Arc Navigator Modal Trigger */}
        {onOpenNavigator && (
          <button
            onClick={() => {
              soundEngine.playHapticFeedback('card');
              onOpenNavigator();
            }}
            title="Open 3D Story Arc Navigator (Press M)"
            className="p-1.5 rounded-lg border border-white/10 bg-neutral-900 text-sky-400 hover:text-sky-300 hover:border-sky-500/40 hover:bg-neutral-800 transition-all group"
          >
            <Layers className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Ambient Soundscape Toggle */}
        <button
          onClick={toggleSound}
          title={isPlayingSound ? 'Mute ambient soundscape' : 'Enable procedural atmospheric audio'}
          className={`p-1.5 rounded-lg border transition-all ${
            isPlayingSound
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-neutral-900 text-neutral-500 border-white/10 hover:text-neutral-300'
          }`}
        >
          {isPlayingSound ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
}
