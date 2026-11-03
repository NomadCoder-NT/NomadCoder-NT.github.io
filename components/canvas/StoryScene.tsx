'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SummerHeatScene } from './SummerHeatScene';
import { MonsoonRainScene } from './MonsoonRainScene';
import { AutumnYieldScene } from './AutumnYieldScene';
import { DigitalSpringScene } from './DigitalSpringScene';
import { WinterFrostScene } from './WinterFrostScene';
import { AtmosphericPostProcessing } from './AtmosphericPostProcessing';
import { getRealCurrentSeason, RealSeasonId } from '@/lib/real-seasons';

export type SeasonMode = 'story' | 'live' | RealSeasonId;

export const SEASON_PALETTES = {
  summer: {
    ambient: '#92400e', // warm amber
    spot: '#f59e0b',    // glowing amber
    fog: '#020408',     // pure obsidian #020408
  },
  monsoon: {
    ambient: '#0369a1', // deep storm blue
    spot: '#00f0ff',    // electric cyan
    fog: '#020408',     // pure obsidian #020408
  },
  autumn: {
    ambient: '#854d0e', // harvest bronze
    spot: '#eab308',    // radiant gold
    fog: '#020408',     // pure obsidian #020408
  },
  spring: {
    ambient: '#065f46', // emerald forest
    spot: '#10b981',    // vibrant emerald
    fog: '#020408',     // pure obsidian #020408
  },
  winter: {
    ambient: '#075985', // deep frost blue
    spot: '#38bdf8',    // crisp ice blue
    fog: '#020408',     // pure obsidian #020408
  },
} as const;

interface StorySceneProps {
  scrollProgress: number; // 0 to 1
  activeSectionIdx: number;
  isMobile: boolean;
  seasonMode?: SeasonMode;
}

export function StoryScene({
  scrollProgress,
  activeSectionIdx,
  isMobile,
  seasonMode = 'story',
}: StorySceneProps) {
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const fogRef = useRef<THREE.Fog>(null);

  // Modulate 3D points density using current scroll progress
  const densityFactor = 0.65 + 0.35 * Math.sin(scrollProgress * Math.PI * 8);

  const realCurrentSeason = useMemo(() => getRealCurrentSeason().id, []);

  // Compute season opacities across all 5 seasons based on scrollProgress or explicit season mode
  const opacities = useMemo(() => {
    let effectiveSeason = seasonMode;
    if (seasonMode === 'live') {
      effectiveSeason = realCurrentSeason;
    }

    if (effectiveSeason === 'winter') {
      return { summer: 0, monsoon: 0, autumn: 0, spring: 0, winter: 1 };
    } else if (effectiveSeason === 'summer') {
      return { summer: 1, monsoon: 0, autumn: 0, spring: 0, winter: 0 };
    } else if (effectiveSeason === 'monsoon') {
      return { summer: 0, monsoon: 1, autumn: 0, spring: 0, winter: 0 };
    } else if (effectiveSeason === 'autumn') {
      return { summer: 0, monsoon: 0, autumn: 1, spring: 0, winter: 0 };
    } else if (effectiveSeason === 'spring') {
      return { summer: 0, monsoon: 0, autumn: 0, spring: 1, winter: 0 };
    }

    // Default 'story' mode: smooth scroll progression across all 5 seasons
    const p = scrollProgress;
    let summer = 0;
    let monsoon = 0;
    let autumn = 0;
    let spring = 0;
    let winter = 0;

    if (p <= 0.26) {
      summer = 1;
      if (p > 0.19) {
        const t = (p - 0.19) / 0.07;
        summer = 1 - t;
        monsoon = t;
      }
    } else if (p <= 0.50) {
      monsoon = 1;
      if (p > 0.43) {
        const t2 = (p - 0.43) / 0.07;
        monsoon = 1 - t2;
        autumn = t2;
      }
    } else if (p <= 0.68) {
      autumn = 1;
      if (p > 0.61) {
        const t3 = (p - 0.61) / 0.07;
        autumn = 1 - t3;
        spring = t3;
      }
    } else if (p <= 0.84) {
      spring = 1;
      if (p > 0.77) {
        const t4 = (p - 0.77) / 0.07;
        spring = 1 - t4;
        winter = t4;
      }
    } else {
      winter = 1;
    }

    return { summer, monsoon, autumn, spring, winter };
  }, [seasonMode, realCurrentSeason, scrollProgress]);

  // Interpolate ambient, spotlight, and fog colors smoothly using damp/lerp targets
  const { targetAmbient, targetSpot, targetFog } = useMemo(() => {
    // If an explicit or live real season is selected, use dedicated palette directly
    if (seasonMode !== 'story') {
      const mode = (seasonMode === 'live' ? realCurrentSeason : seasonMode) as keyof typeof SEASON_PALETTES;
      const palette = SEASON_PALETTES[mode] || SEASON_PALETTES.spring;
      return {
        targetAmbient: new THREE.Color(palette.ambient),
        targetSpot: new THREE.Color(palette.spot),
        targetFog: new THREE.Color(palette.fog),
      };
    }

    // Story scroll mode: dynamically lerp ambient, spot light, and fog colors across all 5 seasons along scrollProgress [0..1]
    const summerAmb = new THREE.Color(SEASON_PALETTES.summer.ambient);
    const summerSpt = new THREE.Color(SEASON_PALETTES.summer.spot);
    const summerFog = new THREE.Color(SEASON_PALETTES.summer.fog);

    const monsoonAmb = new THREE.Color(SEASON_PALETTES.monsoon.ambient);
    const monsoonSpt = new THREE.Color(SEASON_PALETTES.monsoon.spot);
    const monsoonFog = new THREE.Color(SEASON_PALETTES.monsoon.fog);

    const autumnAmb = new THREE.Color(SEASON_PALETTES.autumn.ambient);
    const autumnSpt = new THREE.Color(SEASON_PALETTES.autumn.spot);
    const autumnFog = new THREE.Color(SEASON_PALETTES.autumn.fog);

    const springAmb = new THREE.Color(SEASON_PALETTES.spring.ambient);
    const springSpt = new THREE.Color(SEASON_PALETTES.spring.spot);
    const springFog = new THREE.Color(SEASON_PALETTES.spring.fog);

    const winterAmb = new THREE.Color(SEASON_PALETTES.winter.ambient);
    const winterSpt = new THREE.Color(SEASON_PALETTES.winter.spot);
    const winterFog = new THREE.Color(SEASON_PALETTES.winter.fog);

    const p = scrollProgress;
    const interpolatedAmbient = new THREE.Color();
    const interpolatedSpot = new THREE.Color();
    const interpolatedFog = new THREE.Color();

    if (p <= 0.26) {
      if (p <= 0.19) {
        interpolatedAmbient.copy(summerAmb);
        interpolatedSpot.copy(summerSpt);
        interpolatedFog.copy(summerFog);
      } else {
        const t = (p - 0.19) / 0.07;
        interpolatedAmbient.lerpColors(summerAmb, monsoonAmb, t);
        interpolatedSpot.lerpColors(summerSpt, monsoonSpt, t);
        interpolatedFog.lerpColors(summerFog, monsoonFog, t);
      }
    } else if (p <= 0.50) {
      if (p <= 0.43) {
        interpolatedAmbient.copy(monsoonAmb);
        interpolatedSpot.copy(monsoonSpt);
        interpolatedFog.copy(monsoonFog);
      } else {
        const t = (p - 0.43) / 0.07;
        interpolatedAmbient.lerpColors(monsoonAmb, autumnAmb, t);
        interpolatedSpot.lerpColors(monsoonSpt, autumnSpt, t);
        interpolatedFog.lerpColors(monsoonFog, autumnFog, t);
      }
    } else if (p <= 0.68) {
      if (p <= 0.61) {
        interpolatedAmbient.copy(autumnAmb);
        interpolatedSpot.copy(autumnSpt);
        interpolatedFog.copy(autumnFog);
      } else {
        const t = (p - 0.61) / 0.07;
        interpolatedAmbient.lerpColors(autumnAmb, springAmb, t);
        interpolatedSpot.lerpColors(autumnSpt, springSpt, t);
        interpolatedFog.lerpColors(autumnFog, springFog, t);
      }
    } else if (p <= 0.84) {
      if (p <= 0.77) {
        interpolatedAmbient.copy(springAmb);
        interpolatedSpot.copy(springSpt);
        interpolatedFog.copy(springFog);
      } else {
        const t = (p - 0.77) / 0.07;
        interpolatedAmbient.lerpColors(springAmb, winterAmb, t);
        interpolatedSpot.lerpColors(springSpt, winterSpt, t);
        interpolatedFog.lerpColors(springFog, winterFog, t);
      }
    } else {
      interpolatedAmbient.copy(winterAmb);
      interpolatedSpot.copy(winterSpt);
      interpolatedFog.copy(winterFog);
    }

    return {
      targetAmbient: interpolatedAmbient,
      targetSpot: interpolatedSpot,
      targetFog: interpolatedFog,
    };
  }, [seasonMode, realCurrentSeason, scrollProgress]);

  useFrame((state) => {
    // Smooth camera choreography along Z and Y axes based on scroll
    const targetX =
      state.pointer.x * (isMobile ? 0.3 : 0.8) +
      (scrollProgress > 0.7 ? -0.4 : 0);
    const targetY =
      -state.pointer.y * (isMobile ? 0.2 : 0.5) - scrollProgress * 1.5;
    const targetZ = 6.5 - Math.sin(scrollProgress * Math.PI) * 1.5;

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY,
      0.05
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      0.05
    );
    state.camera.lookAt(0, -scrollProgress * 0.5, 0);

    // Smoothly interpolate ambient, spotlight, and scene fog colors towards the active season's background palette
    if (ambientLightRef.current) {
      ambientLightRef.current.color.lerp(targetAmbient, 0.06);
    }
    if (spotLightRef.current) {
      spotLightRef.current.target.position.set(isMobile ? 0 : 1.5, -0.5, -1);
      spotLightRef.current.target.updateMatrixWorld();
      spotLightRef.current.color.lerp(targetSpot, 0.06);
    }
    if (fogRef.current) {
      fogRef.current.color.lerp(targetFog, 0.06);
    }
    if (state.scene.fog && state.scene.fog instanceof THREE.Fog) {
      state.scene.fog.color.lerp(targetFog, 0.06);
    }
  });

  return (
    <>
      {/* Ambient Light smoothly modulated by SEASON_PALETTES */}
      <ambientLight ref={ambientLightRef} intensity={0.5} />

      {/* Spot Light smoothly modulated by SEASON_PALETTES */}
      <spotLight
        ref={spotLightRef}
        position={[4, 7, 5]}
        intensity={2.8}
        angle={0.65}
        penumbra={0.8}
        distance={24}
      />

      {/* Atmospheric Fog smoothly modulated by active season's background color */}
      <fog ref={fogRef} attach="fog" args={['#020408', 5, 24]} />

      {/* Strict conditional unmounting (opacities[season] > 0.01) to lock 60 FPS */}
      {opacities.summer > 0.01 && (
        <SummerHeatScene
          opacity={opacities.summer}
          isMobile={isMobile}
          densityFactor={densityFactor}
        />
      )}
      {opacities.monsoon > 0.01 && (
        <MonsoonRainScene
          opacity={opacities.monsoon}
          isMobile={isMobile}
          densityFactor={densityFactor}
        />
      )}
      {opacities.autumn > 0.01 && (
        <AutumnYieldScene
          opacity={opacities.autumn}
          isMobile={isMobile}
          densityFactor={densityFactor}
        />
      )}
      {opacities.spring > 0.01 && (
        <DigitalSpringScene
          opacity={opacities.spring}
          isMobile={isMobile}
          densityFactor={densityFactor}
        />
      )}
      {opacities.winter > 0.01 && (
        <WinterFrostScene
          opacity={opacities.winter}
          isMobile={isMobile}
          densityFactor={densityFactor}
        />
      )}

      {/* Post-Processing Pass: Film Grain & Chromatic Aberration */}
      <AtmosphericPostProcessing
        activeSectionIdx={activeSectionIdx}
        scrollProgress={scrollProgress}
        isMobile={isMobile}
      />
    </>
  );
}
