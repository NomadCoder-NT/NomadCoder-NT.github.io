'use client';

import React from 'react';
import { Terminal as TerminalIcon, Layers } from 'lucide-react';
import { soundEngine } from '@/components/sound/sound-synthesizer';

interface HeaderProps {
  onOpenTerminal: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenNavigator?: () => void;
}

export function Header({ onOpenTerminal, onNavigateSection, onOpenNavigator }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-8 px-6 md:px-12 py-4 border-b border-white/5 bg-neutral-950/70 backdrop-blur-md transition-all">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onNavigateSection('ignition')}
        className="text-base md:text-lg font-bold tracking-tight text-neutral-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 font-mono"
      >
        nomadcoder-nt
      </button>

      {/* Zone 2: 4 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-neutral-400">
        <button
          onClick={() => onNavigateSection('ignition')}
          className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
        >
          01. Summer
        </button>
        <button
          onClick={() => onNavigateSection('data-monsoon')}
          className="hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
        >
          02. Monsoon
        </button>
        <button
          onClick={() => onNavigateSection('roots-structure')}
          className="hover:text-yellow-400 transition-colors whitespace-nowrap shrink-0"
        >
          03. Autumn
        </button>
        <button
          onClick={() => onNavigateSection('the-horizon')}
          className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
        >
          04. Spring
        </button>
      </nav>

      {/* Zone 3: Actions - 3D Arc Navigator & Terminal */}
      <div className="flex items-center gap-2.5 shrink-0">
        {onOpenNavigator && (
          <button
            onClick={() => {
              soundEngine.playHapticFeedback('card');
              onOpenNavigator();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-neutral-300 bg-neutral-900/90 border border-white/10 rounded-lg hover:border-sky-500/50 hover:text-sky-300 hover:bg-neutral-800 transition-all whitespace-nowrap shrink-0 shadow-sm group"
            title="Open 3D Story Arc Navigator (Press M)"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Arc Map <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] bg-neutral-800 border border-white/10 rounded ml-0.5 text-neutral-400 font-sans">M</kbd></span>
          </button>
        )}

        <button
          onClick={onOpenTerminal}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium text-neutral-200 bg-neutral-900 border border-white/10 rounded-lg hover:border-amber-500/40 hover:text-amber-300 transition-all whitespace-nowrap shrink-0 shadow-sm"
        >
          <TerminalIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>Terminal [&gt;_]</span>
        </button>
      </div>
    </header>
  );
}
