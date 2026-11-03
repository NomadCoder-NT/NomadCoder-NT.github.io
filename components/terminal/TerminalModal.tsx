'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, CornerDownLeft, Sparkles } from 'lucide-react';
import { NARRATIVE_SECTIONS, SKILL_CATEGORIES } from '@/lib/portfolio-data';
import { soundEngine } from '@/components/sound/sound-synthesizer';

import { SeasonMode } from '@/components/canvas/StoryScene';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToSection: (sectionId: string) => void;
  onSetSeasonMode?: (mode: SeasonMode) => void;
}

interface CommandHistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
}

export function TerminalModal({
  isOpen,
  onClose,
  onJumpToSection,
  onSetSeasonMode,
}: TerminalModalProps) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      id: 'welcome',
      command: 'init',
      output: (
        <div className="space-y-1 text-xs font-mono text-neutral-300">
          <p className="text-amber-400 font-semibold">nomadcoder-nt [v2.5.0-spatial-prod]</p>
          <p className="text-neutral-400">
            Performance Marketing & Digital Strategy → AI Systems & 3D WebGL Engineering.
          </p>
          <p className="text-neutral-500">
            Type <span className="text-cyan-400">help</span> for commands, or <span className="text-cyan-400">jump 1-8</span> to navigate.
          </p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(' ');
    const primary = parts[0];

    let response: React.ReactNode = null;

    switch (primary) {
      case 'help':
        response = (
          <div className="grid grid-cols-2 gap-2 text-xs font-mono py-1">
            <div><span className="text-cyan-400">whoami</span> - Identity & trajectory</div>
            <div><span className="text-cyan-400">seasons</span> - 4 Seasons lifecycle</div>
            <div><span className="text-cyan-400">jump &lt;1-8&gt;</span> - Scroll to section</div>
            <div><span className="text-cyan-400">skills</span> - Full technical stack</div>
            <div><span className="text-cyan-400">audio</span> - Toggle ambient synth</div>
            <div><span className="text-cyan-400">github</span> - Visit GitHub profile</div>
            <div><span className="text-cyan-400">contact</span> - Reach out directly</div>
            <div><span className="text-cyan-400">clear</span> - Clear terminal buffer</div>
          </div>
        );
        break;

      case 'whoami':
        response = (
          <div className="space-y-1.5 text-xs font-mono text-neutral-300">
            <p className="text-emerald-400 font-semibold">nomadcoder-nt</p>
            <p>
              Background spanning 8+ years across Tier-1 tech giants (Amazon Development Centre, Dell International, Google Operations Center, Accenture, ICICI Bank) to founding Templecity Atelier and engineering modern AI Systems & 3D WebGL interfaces.
            </p>
            <p className="text-neutral-400">
              Core superpower: Synthesizing analytical marketing rigor with creative 3D spatial engineering and LLM pipelines.
            </p>
          </div>
        );
        break;

      case 'season':
      case 'seasons': {
        const sub = parts[1];
        if (sub && onSetSeasonMode) {
          if (['story', 'live', 'spring', 'summer', 'monsoon', 'autumn', 'winter'].includes(sub)) {
            onSetSeasonMode(sub as SeasonMode);
            response = (
              <p className="text-xs font-mono text-emerald-400">
                3D Canvas atmosphere set to: <span className="font-bold uppercase text-white">{sub}</span>.
              </p>
            );
            break;
          }
        }
        response = (
          <div className="space-y-1 text-xs font-mono">
            <div className="text-amber-400 font-semibold mb-1">Seasons Engine & 3D Atmosphere:</div>
            <div>• <span className="text-cyan-400">season story</span> - Scroll-driven 4-era lifecycle</div>
            <div>• <span className="text-cyan-400">season live</span> - Auto sync to real calendar (Oct = Autumn)</div>
            <div>• <span className="text-cyan-400">season winter</span> - Crystalline snow & ice polyhedra</div>
            <div>• <span className="text-cyan-400">season summer</span> - Shimmering heat dust & hardware</div>
            <div>• <span className="text-cyan-400">season monsoon</span> - Torrential rain & metric ripples</div>
            <div>• <span className="text-cyan-400">season autumn</span> - Golden embers & Fibonacci curves</div>
            <div>• <span className="text-cyan-400">season spring</span> - Neural synapses & Torana arch</div>
          </div>
        );
        break;
      }

      case 'jump': {
        const secIndex = parseInt(parts[1], 10);
        if (secIndex >= 1 && secIndex <= 8) {
          const target = NARRATIVE_SECTIONS[secIndex - 1];
          onJumpToSection(target.id);
          response = (
            <p className="text-xs font-mono text-emerald-400">
              Navigating to Section {secIndex}: {target.title} ({target.organization})...
            </p>
          );
        } else {
          response = (
            <p className="text-xs font-mono text-red-400">
              Invalid section. Specify a number from 1 to 8 (e.g., &quot;jump 3&quot;).
            </p>
          );
        }
        break;
      }

      case 'skills':
        response = (
          <div className="space-y-2 text-xs font-mono">
            {SKILL_CATEGORIES.map((cat, i) => (
              <div key={i} className="border-b border-neutral-800 pb-1.5">
                <span className="text-amber-300 font-semibold">{cat.category}</span>
                <span className="text-neutral-500"> ({cat.level}):</span>
                <p className="text-neutral-300 mt-0.5">{cat.items.join(', ')}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'audio': {
        const isNowPlaying = soundEngine.toggleMute();
        response = (
          <p className="text-xs font-mono text-cyan-300">
            Ambient soundscape {isNowPlaying ? 'ACTIVATED (Synthesizing procedural noise & low drone)' : 'MUTED'}.
          </p>
        );
        break;
      }

      case 'github':
        response = (
          <p className="text-xs font-mono text-sky-400">
            Visit repository:{' '}
            <a
              href="https://github.com/nomadcoder-nt"
              target="_blank"
              rel="noreferrer"
              className="underline text-cyan-300 font-semibold hover:text-white"
            >
              https://github.com/nomadcoder-nt ↗
            </a>
          </p>
        );
        break;

      case 'contact':
        response = (
          <div className="space-y-1 text-xs font-mono text-neutral-300">
            <p>Direct Email: <a href="mailto:nthamba11@gmail.com" className="text-amber-400 underline">nthamba11@gmail.com</a></p>
            <p>GitHub: <a href="https://github.com/nomadcoder-nt" target="_blank" rel="noreferrer" className="text-cyan-400 underline">github.com/nomadcoder-nt</a></p>
            <p className="text-neutral-500">Open for Creative WebGL Engineering, AI Systems & Growth Strategy roles.</p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        response = (
          <p className="text-xs font-mono text-red-400">
            command not found: {trimmed}. Type <span className="text-cyan-400">help</span> for reference.
          </p>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: cmd,
        output: response,
      },
    ]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleCommand(inputVal);
    setInputVal('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-neutral-950/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/90 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-neutral-400" />
              nomadcoder-nt@spatial:~$
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close terminal"
            className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Command Output Body */}
        <div className="flex-1 p-4 overflow-y-auto font-mono space-y-4 no-scrollbar">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="text-emerald-400">guest@nomadcoder:~$</span>
                <span className="text-neutral-200 font-semibold">{item.command}</span>
              </div>
              <div className="pl-4 border-l border-neutral-800">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick Command Suggestions */}
        <div className="px-4 py-2 bg-neutral-900/60 border-t border-neutral-800/80 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-neutral-400">
          <span className="text-neutral-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Presets:
          </span>
          {['whoami', 'skills', 'seasons', 'jump 3', 'jump 8', 'contact'].map((preset) => (
            <button
              key={preset}
              onClick={() => handleCommand(preset)}
              className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors shrink-0"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Command Input Prompt Form */}
        <form onSubmit={onSubmit} className="flex items-center gap-2 px-4 py-3 bg-neutral-900/95 border-t border-white/10">
          <span className="text-emerald-400 font-mono text-xs font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a command (try 'whoami', 'skills', 'seasons')..."
            className="flex-1 bg-transparent text-xs font-mono text-neutral-100 placeholder:text-neutral-600 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Execute command"
            className="p-1 text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
