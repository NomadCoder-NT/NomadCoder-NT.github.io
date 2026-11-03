'use client';

import React from 'react';
import { Github, Mail, ArrowUp } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenTerminal: () => void;
}

export function Footer({ onScrollToTop, onOpenTerminal }: FooterProps) {
  return (
    <footer className="border-t border-white/5 bg-neutral-950/90 py-12 px-6 md:px-12 relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Identity */}
        <div className="space-y-1 text-center md:text-left">
          <div className="text-sm font-bold font-mono text-neutral-200">
            nomadcoder-nt
          </div>
          <div className="text-xs text-neutral-400">
            Performance Marketing & Digital Strategy → AI Systems & 3D WebGL Engineering
          </div>
        </div>

        {/* Links & Navigation */}
        <div className="flex items-center gap-6 text-xs font-mono text-neutral-400">
          <a
            href="https://github.com/nomadcoder-nt"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="mailto:nthamba11@gmail.com"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>nthamba11@gmail.com</span>
          </a>
          <button
            onClick={onOpenTerminal}
            className="hover:text-amber-400 transition-colors"
          >
            Terminal
          </button>
        </div>

        {/* Back to top action */}
        <button
          onClick={onScrollToTop}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-neutral-400 hover:text-white bg-neutral-900 border border-white/5 hover:border-white/20 rounded-lg transition-all"
        >
          <span>Return to Origin</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 text-center md:text-left text-[11px] font-mono text-neutral-400">
        © {new Date().getFullYear()} nomadcoder-nt. Built with Next.js 15, React Three Fiber, Three.js & Tailwind CSS. All narrative rights reserved.
      </div>
    </footer>
  );
}
