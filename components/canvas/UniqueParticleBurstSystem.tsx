'use client';

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from '@/lib/math';
import { SeasonMode } from './StoryScene';
import { getRealCurrentSeason } from '@/lib/real-seasons';

export type BurstSeasonType = 'summer' | 'monsoon' | 'autumn' | 'spring' | 'winter';

export interface BurstEventData {
  id: number;
  sectionIdx: number;
  seasonId: BurstSeasonType;
  timestamp: number;
  intensity?: number;
}

interface UniqueParticleBurstSystemProps {
  activeSectionIdx: number;
  scrollProgress: number;
  isMobile: boolean;
  seasonMode?: SeasonMode;
  burstEvent?: BurstEventData | null;
}

// Map section indices to seasons
const SECTION_SEASON_MAP: BurstSeasonType[] = [
  'summer',  // 01 IGNITION
  'summer',  // 02 HARDWARE FORGE
  'monsoon', // 03 DATA MONSOON
  'monsoon', // 04 CLOUD CANOPY
  'autumn',  // 05 ROOTS & STRUCTURE
  'autumn',  // 06 THE HARVEST
  'spring',  // 07 NEURAL SPRING
  'spring',  // 08 THE HORIZON
];

export function UniqueParticleBurstSystem({
  activeSectionIdx,
  scrollProgress,
  isMobile,
  seasonMode = 'story',
  burstEvent,
}: UniqueParticleBurstSystemProps) {
  // References for Three.js scene objects
  const pointsRef = useRef<THREE.Points>(null);
  const rippleRingsGroupRef = useRef<THREE.Group>(null);
  const rippleRing1Ref = useRef<THREE.Mesh>(null);
  const rippleRing2Ref = useRef<THREE.Mesh>(null);
  const rippleRing3Ref = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);

  const particleCount = isMobile ? 110 : 240;

  // Mutable particle physics buffers stored in refs to satisfy React compiler immutability
  const velocitiesRef = useRef<Float32Array>(new Float32Array(particleCount * 3));
  const particleAgesRef = useRef<Float32Array>(new Float32Array(particleCount));

  // Initialize particle ages once
  useEffect(() => {
    const ages = particleAgesRef.current;
    for (let i = 0; i < particleCount; i++) {
      ages[i] = seededRandom(i * 7 + 3);
    }
  }, [particleCount]);

  // Transition-aware ref to trigger bursts when user reaches new scroll thresholds or section boundaries
  const internalTransitionRef = useRef<{
    lastSectionIdx: number;
    lastThresholdCrossed: number;
    lastTriggerTimestamp: number;
    lastEventId: number;
  }>({
    lastSectionIdx: activeSectionIdx,
    lastThresholdCrossed: Math.min(7, Math.max(0, Math.floor(scrollProgress * 8))),
    lastTriggerTimestamp: 0,
    lastEventId: 0,
  });

  // Burst animation state ref
  const burstStateRef = useRef<{
    active: boolean;
    time: number;
    duration: number;
    season: BurstSeasonType;
    sectionIdx: number;
  }>({
    active: false,
    time: 0,
    duration: 1.4,
    season: 'summer',
    sectionIdx: 0,
  });

  // Static buffers for Three.js geometry attributes
  const [basePositions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      col[i * 3] = 1;
      col[i * 3 + 1] = 1;
      col[i * 3 + 2] = 1;
    }

    return [pos, col];
  }, [particleCount]);

  // Method to initialize the season-specific particle burst physics and colors
  const triggerBurst = useCallback((sectionIdx: number, forceSeason?: BurstSeasonType) => {
    let effectiveSeason: BurstSeasonType = forceSeason || SECTION_SEASON_MAP[sectionIdx] || 'summer';
    if (seasonMode !== 'story') {
      effectiveSeason = seasonMode === 'live' ? getRealCurrentSeason().id : seasonMode;
    }

    burstStateRef.current = {
      active: true,
      time: 0,
      duration: effectiveSeason === 'summer' ? 1.6 : effectiveSeason === 'autumn' ? 1.8 : 1.35,
      season: effectiveSeason,
      sectionIdx,
    };

    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < particleCount; i++) {
      // Reset position to burst center
      posArr[i * 3] = 0;
      posArr[i * 3 + 1] = 0;
      posArr[i * 3 + 2] = 0;

      const seed1 = seededRandom(i * 11 + 1);
      const seed2 = seededRandom(i * 11 + 2);
      const seed3 = seededRandom(i * 11 + 3);

      if (effectiveSeason === 'summer') {
        // --- SUMMER: High-heat floating embers & forge sparks ---
        // Burst outward then drift upward with thermal buoyancy
        const theta = seed1 * 2 * Math.PI;
        const phi = Math.acos(2 * seed2 - 1);
        const speed = 1.8 + seed3 * 4.2;

        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.abs(Math.sin(phi) * Math.sin(theta)) * speed + 1.2; // initial upward kick
        velocities[i * 3 + 2] = Math.cos(phi) * speed * 0.7;

        // Hot ember colors: fiery gold, warm amber, bright vermilion, and glowing white core
        if (i % 5 === 0) {
          colArr[i * 3] = 1.0;
          colArr[i * 3 + 1] = 0.95;
          colArr[i * 3 + 2] = 0.8;
        } else if (i % 2 === 0) {
          colArr[i * 3] = 0.98;
          colArr[i * 3 + 1] = 0.72;
          colArr[i * 3 + 2] = 0.12;
        } else {
          colArr[i * 3] = 0.94;
          colArr[i * 3 + 1] = 0.38;
          colArr[i * 3 + 2] = 0.05;
        }
      } else if (effectiveSeason === 'monsoon') {
        // --- MONSOON: Rain ripples & vertical impact droplet jets ---
        // Concentric ground ripples + upward splash spikes that arc downward
        const angle = seed1 * 2 * Math.PI;
        const radiusSpeed = 2.2 + seed2 * 3.8;
        const verticalSplash = 3.5 + seed3 * 4.5;

        velocities[i * 3] = Math.cos(angle) * radiusSpeed;
        velocities[i * 3 + 1] = verticalSplash; // vertical splash jet
        velocities[i * 3 + 2] = Math.sin(angle) * radiusSpeed * 0.8;

        if (i % 4 === 0) {
          colArr[i * 3] = 0.88;
          colArr[i * 3 + 1] = 0.96;
          colArr[i * 3 + 2] = 1.0;
        } else if (i % 2 === 0) {
          colArr[i * 3] = 0.22;
          colArr[i * 3 + 1] = 0.74;
          colArr[i * 3 + 2] = 0.98;
        } else {
          colArr[i * 3] = 0.06;
          colArr[i * 3 + 1] = 0.52;
          colArr[i * 3 + 2] = 0.88;
        }
      } else if (effectiveSeason === 'autumn') {
        // --- AUTUMN: Golden yield shards & fluttering harvest leaves ---
        const theta = seed1 * 2 * Math.PI;
        const speed = 1.5 + seed2 * 3.5;

        velocities[i * 3] = Math.cos(theta) * speed;
        velocities[i * 3 + 1] = (seed3 - 0.3) * 2.5;
        velocities[i * 3 + 2] = Math.sin(theta) * speed;

        if (i % 3 === 0) {
          colArr[i * 3] = 0.98;
          colArr[i * 3 + 1] = 0.82;
          colArr[i * 3 + 2] = 0.15;
        } else if (i % 2 === 0) {
          colArr[i * 3] = 0.92;
          colArr[i * 3 + 1] = 0.65;
          colArr[i * 3 + 2] = 0.08;
        } else {
          colArr[i * 3] = 0.85;
          colArr[i * 3 + 1] = 0.45;
          colArr[i * 3 + 2] = 0.05;
        }
      } else {
        // --- SPRING: Neural quantum spores & bioluminescent blossom ---
        const theta = seed1 * 2 * Math.PI;
        const phi = (seed2 - 0.5) * Math.PI;
        const speed = 2.0 + seed3 * 4.0;

        velocities[i * 3] = Math.cos(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * speed;
        velocities[i * 3 + 2] = Math.cos(phi) * Math.sin(theta) * speed;

        if (i % 3 === 0) {
          colArr[i * 3] = 0.06;
          colArr[i * 3 + 1] = 0.78;
          colArr[i * 3 + 2] = 0.88;
        } else if (i % 2 === 0) {
          colArr[i * 3] = 0.15;
          colArr[i * 3 + 1] = 0.85;
          colArr[i * 3 + 2] = 0.55;
        } else {
          colArr[i * 3] = 0.45;
          colArr[i * 3 + 1] = 0.95;
          colArr[i * 3 + 2] = 0.75;
        }
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    if (rippleRingsGroupRef.current) {
      rippleRingsGroupRef.current.visible = effectiveSeason === 'monsoon';
    }
  }, [particleCount, seasonMode]);

  // Transition-aware ref detection: triggers when user crosses new section boundaries or scroll thresholds
  useEffect(() => {
    const now = performance.now();
    const currentThreshold = Math.min(7, Math.max(0, Math.floor(scrollProgress * 8)));
    const sectionChanged = internalTransitionRef.current.lastSectionIdx !== activeSectionIdx;
    const thresholdChanged = internalTransitionRef.current.lastThresholdCrossed !== currentThreshold;

    const timeSinceLast = now - internalTransitionRef.current.lastTriggerTimestamp;
    const canTrigger = timeSinceLast > 350;

    if ((sectionChanged || thresholdChanged) && canTrigger) {
      internalTransitionRef.current.lastSectionIdx = activeSectionIdx;
      internalTransitionRef.current.lastThresholdCrossed = currentThreshold;
      internalTransitionRef.current.lastTriggerTimestamp = now;

      triggerBurst(activeSectionIdx);
    }
  }, [activeSectionIdx, scrollProgress, triggerBurst]);

  // Handle external burst events forwarded from CanvasWrapper
  useEffect(() => {
    if (burstEvent && burstEvent.id !== internalTransitionRef.current.lastEventId) {
      internalTransitionRef.current.lastEventId = burstEvent.id;
      triggerBurst(burstEvent.sectionIdx, burstEvent.seasonId);
    }
  }, [burstEvent, triggerBurst]);

  // Animation frame loop for season-specific burst dynamics
  useFrame((_, delta) => {
    if (!burstStateRef.current.active) return;

    burstStateRef.current.time += delta;
    const { time, duration, season } = burstStateRef.current;
    const t = Math.min(1, time / duration);

    // Fade out and terminate burst
    if (t >= 1) {
      burstStateRef.current.active = false;
      if (pointsRef.current) {
        (pointsRef.current.material as THREE.PointsMaterial).opacity = 0;
      }
      if (shockwaveRef.current) {
        shockwaveRef.current.scale.set(0, 0, 0);
      }
      if (rippleRing1Ref.current) rippleRing1Ref.current.scale.set(0, 0, 0);
      if (rippleRing2Ref.current) rippleRing2Ref.current.scale.set(0, 0, 0);
      if (rippleRing3Ref.current) rippleRing3Ref.current.scale.set(0, 0, 0);
      return;
    }

    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      const velocities = velocitiesRef.current;
      const ages = particleAgesRef.current;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const age = ages[i];

        if (season === 'summer') {
          // SUMMER EMBERS: Thermal buoyancy, upward air draft, and heat wobble
          const buoyancy = 2.2 * (1 - t * 0.4);
          velocities[i3 + 1] += buoyancy * delta;
          const wobble = Math.sin(time * 7 + i * 2) * 0.6;

          posArr[i3] += (velocities[i3] + wobble) * delta;
          posArr[i3 + 1] += velocities[i3 + 1] * delta;
          posArr[i3 + 2] += velocities[i3 + 2] * delta;
        } else if (season === 'monsoon') {
          // MONSOON RAIN RIPPLES: Vertical impact droplet splash arcs downward with gravity
          velocities[i3 + 1] -= 9.8 * delta * 0.65;
          const drag = Math.pow(1 - t, 0.4);

          posArr[i3] += velocities[i3] * delta * drag;
          posArr[i3 + 1] += velocities[i3 + 1] * delta;
          posArr[i3 + 2] += velocities[i3 + 2] * delta * drag;
        } else if (season === 'autumn') {
          // AUTUMN HARVEST: Fluttering aerodynamic glide & gentle swirl
          const flutter = Math.sin(time * 5 + i * 1.5) * 1.2;
          const drag = Math.pow(1 - t, 0.5);

          posArr[i3] += (velocities[i3] * drag + flutter * 0.5) * delta;
          posArr[i3 + 1] += (velocities[i3 + 1] - 0.8 * t) * delta;
          posArr[i3 + 2] += (velocities[i3 + 2] * drag) * delta;
        } else {
          // SPRING NEURAL SPORES: Logarithmic spiral curvature & synaptic branching
          const spiralAngle = time * 2.8 + age;
          const curveX = -velocities[i3 + 2] * 0.4;
          const curveZ = velocities[i3] * 0.4;

          posArr[i3] += (velocities[i3] + Math.cos(spiralAngle) * curveX) * delta;
          posArr[i3 + 1] += velocities[i3 + 1] * delta;
          posArr[i3 + 2] += (velocities[i3 + 2] + Math.sin(spiralAngle) * curveZ) * delta;
        }
      }

      posAttr.needsUpdate = true;

      // Opacity envelope: quick attack, smooth exponential decay
      const alpha = Math.sin(t * Math.PI) * (1 - Math.pow(t, 2.5));
      mat.opacity = Math.max(0, alpha * 0.95);
      mat.size = (isMobile ? 0.09 : 0.14) * (1 + (1 - t) * 0.4);
    }

    // MONSOON RAIN RIPPLES: Expand concentric water ripple rings
    if (season === 'monsoon' && rippleRingsGroupRef.current) {
      rippleRingsGroupRef.current.visible = true;

      // Ring 1 (Primary shock ripple)
      if (rippleRing1Ref.current) {
        const r1Scale = t * 5.2;
        rippleRing1Ref.current.scale.set(r1Scale, r1Scale, 1);
        const r1Mat = rippleRing1Ref.current.material as THREE.MeshBasicMaterial;
        r1Mat.opacity = Math.max(0, (1 - t) * 0.6);
      }

      // Ring 2 (Secondary delayed wave)
      if (rippleRing2Ref.current) {
        const tDelayed = Math.max(0, (t - 0.15) / 0.85);
        const r2Scale = tDelayed * 4.2;
        rippleRing2Ref.current.scale.set(r2Scale, r2Scale, 1);
        const r2Mat = rippleRing2Ref.current.material as THREE.MeshBasicMaterial;
        r2Mat.opacity = Math.max(0, (1 - tDelayed) * 0.4);
      }

      // Ring 3 (Outer ambient dissipation ring)
      if (rippleRing3Ref.current) {
        const tDelayed3 = Math.max(0, (t - 0.28) / 0.72);
        const r3Scale = tDelayed3 * 3.4;
        rippleRing3Ref.current.scale.set(r3Scale, r3Scale, 1);
        const r3Mat = rippleRing3Ref.current.material as THREE.MeshBasicMaterial;
        r3Mat.opacity = Math.max(0, (1 - tDelayed3) * 0.25);
      }
    } else if (rippleRingsGroupRef.current) {
      rippleRingsGroupRef.current.visible = false;
    }

    // SHOCKWAVE RING FOR SUMMER / AUTUMN / SPRING
    if (shockwaveRef.current) {
      const ringScale = t * (season === 'summer' ? 6.2 : season === 'spring' ? 5.8 : 4.8);
      shockwaveRef.current.scale.set(ringScale, ringScale, 1);
      const ringMat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = Math.max(0, (1 - t) * (season === 'summer' ? 0.45 : 0.35));

      if (season === 'summer') {
        ringMat.color.set('#f59e0b');
      } else if (season === 'autumn') {
        ringMat.color.set('#eab308');
      } else if (season === 'spring') {
        ringMat.color.set('#10b981');
      } else {
        ringMat.color.set('#38bdf8');
      }
    }
  });

  return (
    <group position={[isMobile ? 0 : 2.2, isMobile ? -0.2 : 0, -2.0]}>
      {/* 3D Dynamic Particle Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[basePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.09 : 0.14}
          vertexColors
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Monsoon Concentric Rain Ripple Rings (Horizontal plane simulation) */}
      <group
        ref={rippleRingsGroupRef}
        rotation={[-Math.PI / 2.3, 0, 0]}
        position={[0, -1.2, 0]}
        visible={false}
      >
        <mesh ref={rippleRing1Ref}>
          <ringGeometry args={[0.3, 0.38, 48]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={rippleRing2Ref}>
          <ringGeometry args={[0.2, 0.26, 48]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={rippleRing3Ref}>
          <ringGeometry args={[0.12, 0.17, 48]} />
          <meshBasicMaterial
            color="#7dd3fc"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Atmospheric Radial Shockwave Ring */}
      <mesh ref={shockwaveRef} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[0.9, 0.98, 48]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
