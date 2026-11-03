'use client';

import React, { useSyncExternalStore, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { StoryScene, SeasonMode } from './StoryScene';
import { UniqueParticleBurstSystem, BurstEventData, BurstSeasonType } from './UniqueParticleBurstSystem';
import { useIsMobile } from '@/hooks/use-mobile';
import { getRealCurrentSeason } from '@/lib/real-seasons';

interface CanvasWrapperProps {
  scrollProgress: number;
  activeSectionIdx: number;
  seasonMode?: SeasonMode;
}

const emptySubscribe = () => () => {};

export function CanvasWrapper({
  scrollProgress,
  activeSectionIdx,
  seasonMode = 'story',
}: CanvasWrapperProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isMobile = useIsMobile();

  // Transition-aware ref to trigger unique particle bursts at section entry boundaries & scroll thresholds
  const transitionRef = useRef<{
    lastSectionIdx: number;
    lastThresholdCrossed: number;
    lastTriggerTimestamp: number;
    burstIdCounter: number;
  }>({
    lastSectionIdx: activeSectionIdx,
    lastThresholdCrossed: Math.min(7, Math.max(0, Math.floor(scrollProgress * 8))),
    lastTriggerTimestamp: 0,
    burstIdCounter: 0,
  });

  const [currentBurstEvent, setCurrentBurstEvent] = useState<BurstEventData | null>(null);

  // Monitor section entry boundaries and scroll thresholds using transition-aware ref
  useEffect(() => {
    const now = performance.now();
    const currentThreshold = Math.min(7, Math.max(0, Math.floor(scrollProgress * 8)));
    const sectionChanged = transitionRef.current.lastSectionIdx !== activeSectionIdx;
    const thresholdChanged = transitionRef.current.lastThresholdCrossed !== currentThreshold;

    const timeSinceLast = now - transitionRef.current.lastTriggerTimestamp;

    // Trigger burst specifically at section entry boundaries and scroll thresholds
    if ((sectionChanged || thresholdChanged) && timeSinceLast > 320) {
      transitionRef.current.lastSectionIdx = activeSectionIdx;
      transitionRef.current.lastThresholdCrossed = currentThreshold;
      transitionRef.current.lastTriggerTimestamp = now;
      transitionRef.current.burstIdCounter += 1;

      const seasonMap: BurstSeasonType[] = [
        'summer',  // 01 IGNITION
        'summer',  // 02 HARDWARE FORGE
        'monsoon', // 03 DATA MONSOON
        'monsoon', // 04 CLOUD CANOPY
        'autumn',  // 05 THE HARVEST
        'spring',  // 06 ROOTS & STRUCTURE
        'winter',  // 07 THE HORIZON
      ];

      const targetSeason: BurstSeasonType = seasonMode !== 'story'
        ? (seasonMode === 'live' ? getRealCurrentSeason().id : seasonMode)
        : seasonMap[activeSectionIdx] || 'summer';

      setCurrentBurstEvent({
        id: transitionRef.current.burstIdCounter,
        sectionIdx: activeSectionIdx,
        seasonId: targetSeason,
        timestamp: now,
      });
    }
  }, [activeSectionIdx, scrollProgress, seasonMode]);

  const webglSupported = useMemo(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }, []);

  // Ambient gradient color wash synchronizing with the Three.js ambient & spot light palette
  const ambientGlowClass = useMemo(() => {
    const p = scrollProgress;
    if (seasonMode !== 'story') {
      const mode = seasonMode === 'live' ? getRealCurrentSeason().id : seasonMode;
      switch (mode) {
        case 'winter':
          return 'from-sky-950/20 via-neutral-950/40 to-neutral-950';
        case 'summer':
          return 'from-amber-950/25 via-neutral-950/40 to-neutral-950';
        case 'monsoon':
          return 'from-cyan-950/25 via-neutral-950/40 to-neutral-950';
        case 'autumn':
          return 'from-yellow-950/25 via-neutral-950/40 to-neutral-950';
        case 'spring':
        default:
          return 'from-emerald-950/25 via-neutral-950/40 to-neutral-950';
      }
    }

    if (p <= 0.25) {
      return 'from-amber-950/25 via-neutral-950/40 to-neutral-950';
    } else if (p <= 0.5) {
      return 'from-sky-950/25 via-neutral-950/40 to-neutral-950';
    } else if (p <= 0.72) {
      return 'from-yellow-950/25 via-neutral-950/40 to-neutral-950';
    } else {
      return 'from-emerald-950/25 via-neutral-950/40 to-neutral-950';
    }
  }, [scrollProgress, seasonMode]);

  if (!isMounted) {
    return (
      <div className="fixed inset-0 pointer-events-none bg-neutral-950 -z-10" />
    );
  }

  if (!webglSupported) {
    return (
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-neutral-950 via-slate-900 to-neutral-950 -z-10 opacity-60" />
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: isMobile ? 65 : 50 }}
        gl={{
          antialias: !isMobile,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <StoryScene
          scrollProgress={scrollProgress}
          activeSectionIdx={activeSectionIdx}
          isMobile={isMobile}
          seasonMode={seasonMode}
        />

        {/* Unique Particle Burst System triggered at NarrativeSection entry boundaries */}
        <UniqueParticleBurstSystem
          activeSectionIdx={activeSectionIdx}
          scrollProgress={scrollProgress}
          isMobile={isMobile}
          seasonMode={seasonMode}
          burstEvent={currentBurstEvent}
        />
      </Canvas>

      {/* Atmospheric Vignette & Dynamic Seasonal Color Scrim Wash */}
      <div className={`absolute inset-0 bg-gradient-to-b ${ambientGlowClass} transition-colors duration-700 pointer-events-none`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-neutral-950/40 to-neutral-950/90 pointer-events-none" />
    </div>
  );
}
