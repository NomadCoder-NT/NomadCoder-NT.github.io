'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CanvasWrapper } from '@/components/canvas/CanvasWrapper';
import { ScrollProgressHUD } from '@/components/ui/ScrollProgressHUD';
import { VerticalDotNav } from '@/components/ui/VerticalDotNav';
import { StoryHero } from '@/components/story/StoryHero';
import { NarrativeSection } from '@/components/story/NarrativeSection';
import { AdditiveBench } from '@/components/story/AdditiveBench';
import { BentoHorizon } from '@/components/story/BentoHorizon';
import { TerminalModal } from '@/components/terminal/TerminalModal';
import { SectionNavigatorModal } from '@/components/navigator/SectionNavigatorModal';
import { CustomCursorProvider } from '@/components/ui/CustomCursorContext';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { SeasonMode } from '@/components/canvas/StoryScene';
import { getRealCurrentSeason } from '@/lib/real-seasons';
import { NARRATIVE_SECTIONS } from '@/lib/portfolio-data';
import { SeasonId } from '@/types/portfolio';
import { soundEngine } from '@/components/sound/sound-synthesizer';

const getSeasonForSectionIdx = (idx: number): SeasonId => {
  if (idx <= 1) return 'summer';
  if (idx <= 3) return 'monsoon';
  if (idx === 4) return 'autumn';
  if (idx === 5) return 'spring';
  return 'winter';
};

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [seasonMode, setSeasonMode] = useState<SeasonMode>('story');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

  // Smooth scroll tracker with passive listener & RAF throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = totalHeight > 0 ? Math.min(1, Math.max(0, currentScroll / totalHeight)) : 0;
          setScrollProgress(progress);

          // Compute active section based on proximity to viewport mid
          const sectionElements = NARRATIVE_SECTIONS.map((s) => document.getElementById(s.id));
          const viewportMid = window.scrollY + window.innerHeight * 0.45;

          let currentIdx = 0;
          sectionElements.forEach((el, idx) => {
            if (el && el.offsetTop <= viewportMid) {
              currentIdx = idx;
            }
          });
          setActiveSectionIdx(currentIdx);

          // Update active season atmosphere in procedural audio engine when in story mode
          const currentSeason = getSeasonForSectionIdx(currentIdx);
          if (seasonMode === 'story') {
            soundEngine.setSeasonAtmosphere(currentSeason);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [seasonMode]);

  // Synchronize dynamic [data-season] attribute on <html> with active season
  useEffect(() => {
    const currentSeason =
      seasonMode !== 'story'
        ? seasonMode === 'live'
          ? getRealCurrentSeason().id
          : seasonMode
        : getSeasonForSectionIdx(activeSectionIdx);

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-season', currentSeason);
    }
  }, [activeSectionIdx, seasonMode]);

  // Synchronize audio atmosphere when seasonMode explicitly changes
  useEffect(() => {
    if (seasonMode === 'live') {
      soundEngine.setSeasonAtmosphere(getRealCurrentSeason().id);
    } else if (seasonMode !== 'story') {
      soundEngine.setSeasonAtmosphere(seasonMode);
    }
  }, [seasonMode]);

  // Update dynamic document title indexing ("01 // IGNITION · nomadcoder-nt")
  const lastSectionForAudioRef = useRef<number | null>(null);
  useEffect(() => {
    const activeSection = NARRATIVE_SECTIONS[activeSectionIdx];
    if (typeof document !== 'undefined') {
      if (activeSection) {
        document.title = `${activeSection.index} // ${activeSection.title} · nomadcoder-nt`;
      } else {
        document.title = 'nomadcoder-nt — 3D Portfolio & Digital Strategy';
      }
    }

    if (lastSectionForAudioRef.current !== null && lastSectionForAudioRef.current !== activeSectionIdx) {
      const targetSeason = activeSection?.seasonId || 'summer';
      soundEngine.playSectionTransitionCue(targetSeason);
    }
    lastSectionForAudioRef.current = activeSectionIdx;
  }, [activeSectionIdx]);

  // Keyboard shortcut listener for terminal (~ or Ctrl/Cmd+K) and Section Navigator (M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // 'M' or 'm' toggles the 3D Section Navigator modal
      if (!isInput && (e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsNavigatorOpen((prev) => !prev);
        return;
      }

      // Backtick or Ctrl/Cmd + K toggles the interactive terminal modal
      if (e.key === '`' || e.key === '~' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isTerminalOpen) setIsTerminalOpen(false);
        if (isNavigatorOpen) setIsNavigatorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalOpen, isNavigatorOpen]);

  // Jump to specific section
  const handleNavigateSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleBeginJourney = useCallback(() => {
    handleNavigateSection('ignition');
  }, [handleNavigateSection]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <CustomCursorProvider>
      <main className="relative min-h-screen text-neutral-100 overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-200">
        {/* Custom Magnetic Tactile Cursor */}
        <CustomCursor />

        {/* 3D WebGL Background Canvas with GPU Shaders & Scene Orchestration */}
        <CanvasWrapper
          scrollProgress={scrollProgress}
          activeSectionIdx={activeSectionIdx}
          seasonMode={seasonMode}
        />

        {/* Top Bar Navigation (3-Zone Contract) */}
        <Header
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onNavigateSection={handleNavigateSection}
          onOpenNavigator={() => setIsNavigatorOpen(true)}
        />

        {/* Hero Entrance */}
        <StoryHero
          onBeginJourney={handleBeginJourney}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />

        {/* Narrative Story Sections 01 through 07 */}
        <div className="relative z-10">
          {/* Glowing vertical lifecycle flow spine pulsing in sync with global scroll */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-32 bottom-32 w-[1px] bg-gradient-to-b from-amber-500/20 via-cyan-500/25 via-yellow-500/25 via-emerald-500/25 to-sky-500/25 pointer-events-none -z-10 hidden sm:block"
            aria-hidden="true"
          >
            <div
              style={{
                top: `${Math.min(96, Math.max(2, scrollProgress * 100))}%`,
              }}
              className="absolute left-1/2 -translate-x-1/2 w-3.5 h-24 -mt-12 bg-gradient-to-b from-amber-400/0 via-amber-300/40 to-emerald-400/0 blur-[2px] rounded-full transition-all duration-300 pointer-events-none"
            />
          </div>

          {NARRATIVE_SECTIONS.map((section, idx) => (
            <React.Fragment key={section.id}>
              <NarrativeSection
                section={section}
                isActive={activeSectionIdx === idx}
                nextSection={NARRATIVE_SECTIONS[idx + 1]}
                isFirst={idx === 0}
                isLast={idx === NARRATIVE_SECTIONS.length - 1}
              />
              {/* AdditiveBench sits smoothly between Chapter 05 (ICICI Bank) and Chapter 06 (Templecity Atelier) */}
              {idx === 4 && <AdditiveBench />}
            </React.Fragment>
          ))}

          {/* Section 08: The Horizon - Bento Grid Layout */}
          <BentoHorizon
            onOpenTerminal={() => setIsTerminalOpen(true)}
          />
        </div>

        {/* Floating Scroll Progress & Atmosphere HUD */}
        <ScrollProgressHUD
          scrollProgress={scrollProgress}
          currentSectionIndex={activeSectionIdx}
          seasonMode={seasonMode}
          onSetSeasonMode={setSeasonMode}
          onNavigateSection={handleNavigateSection}
          onOpenNavigator={() => setIsNavigatorOpen(true)}
        />

        {/* Fixed Vertical Dot Navigation on Right Side */}
        <VerticalDotNav
          activeSectionIdx={activeSectionIdx}
          onNavigateSection={handleNavigateSection}
          onOpenNavigator={() => setIsNavigatorOpen(true)}
        />

        {/* Clean Anti-Slop Footer */}
        <Footer
          onScrollToTop={handleScrollToTop}
          onOpenTerminal={() => setIsTerminalOpen(true)}
        />

        {/* Interactive Minimalist Terminal Modal */}
        <TerminalModal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          onJumpToSection={(id) => {
            setIsTerminalOpen(false);
            handleNavigateSection(id);
          }}
          onSetSeasonMode={setSeasonMode}
        />

        {/* 3D Isometric Story Arc Section Navigator Modal (Press 'M' or click trigger) */}
        <SectionNavigatorModal
          isOpen={isNavigatorOpen}
          onClose={() => setIsNavigatorOpen(false)}
          activeSectionIdx={activeSectionIdx}
          onNavigateSection={handleNavigateSection}
        />
      </main>
    </CustomCursorProvider>
  );
}
