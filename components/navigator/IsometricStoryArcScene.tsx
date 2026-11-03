'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { NARRATIVE_SECTIONS, SEASONS } from '@/lib/portfolio-data';
import { soundEngine } from '@/components/sound/sound-synthesizer';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface IsometricStoryArcSceneProps {
  activeSectionIdx: number;
  onNavigateSection: (sectionId: string) => void;
  selectedSeasonFilter: string | null;
  hoveredSectionIdx: number | null;
  onHoverSection: (idx: number | null) => void;
  isMobile: boolean;
  cameraResetTrigger: number;
}

// Compute 8 isometric coordinates along an ascending circuit arc
const ARC_NODE_POSITIONS: [number, number, number][] = [
  [-4.2, -1.4, 4.2],  // 01. Ignition (Summer)
  [-2.4, -1.0, 3.6],  // 02. Hardware Forge (Summer)
  [-1.0, -0.6, 2.5],  // 03. Data Monsoon (Monsoon)
  [-0.2, -0.2, 0.9],  // 04. Cloud Canopy (Monsoon)
  [0.2, 0.2, -0.9],   // 05. Roots & Structure (Spring/Roots)
  [1.0, 0.6, -2.5],   // 06. The Harvest (Autumn)
  [2.4, 1.0, -3.6],   // 07. Neural Spring (Spring)
  [4.2, 1.4, -4.2],   // 08. The Horizon (Spring/Horizon)
];

// Color palette mapping per season
const SEASON_COLORS: Record<string, { primary: string; emissive: string; hex: number }> = {
  summer: { primary: '#f59e0b', emissive: '#d97706', hex: 0xf59e0b },
  monsoon: { primary: '#38bdf8', emissive: '#0284c7', hex: 0x38bdf8 },
  autumn: { primary: '#eab308', emissive: '#ca8a04', hex: 0xeab308 },
  spring: { primary: '#10b981', emissive: '#059669', hex: 0x10b981 },
};

// 3D Spline Connecting Arc Path with Animated Energy Pulses
function ArcConnectingSpline({
  positions,
  hoveredIdx,
}: {
  positions: [number, number, number][];
  hoveredIdx: number | null;
}) {
  const points = useMemo(() => {
    return positions.map((p) => new THREE.Vector3(...p));
  }, [positions]);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.25);
  }, [points]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 96, 0.045, 8, false);
  }, [curve]);

  // Energy pulses traveling along the spline
  const pulseGroupRef = useRef<THREE.Group>(null);
  const pulsePositionsRef = useRef<number[]>([0.1, 0.35, 0.6, 0.85]);

  useFrame((_, delta) => {
    if (!pulseGroupRef.current) return;
    const children = pulseGroupRef.current.children;
    const pulses = pulsePositionsRef.current;
    for (let i = 0; i < children.length; i++) {
      pulses[i] = (pulses[i] + delta * 0.18) % 1.0;
      const point = curve.getPointAt(pulses[i]);
      children[i].position.copy(point);
    }
  });

  return (
    <group>
      {/* Base Glowing Circuit Spline */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={hoveredIdx !== null ? 0.9 : 0.6}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Traveling Energy Pulse Beacons */}
      <group ref={pulseGroupRef}>
        {pulsePositionsRef.current.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#38bdf8' : '#fbbf24'} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Single Interactive 3D Arc Node
function ArcNode({
  section,
  position,
  idx,
  isActive,
  isHovered,
  isDimmed,
  onSelect,
  onHover,
}: {
  section: (typeof NARRATIVE_SECTIONS)[number];
  position: [number, number, number];
  idx: number;
  isActive: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  const colors = SEASON_COLORS[section.seasonId] || SEASON_COLORS.summer;

  // Gentle idle rotation and reactive hover scale
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetScale = isHovered ? 1.35 : isActive ? 1.15 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * (isHovered ? 2.5 : 0.8);
      ring1Ref.current.rotation.y += delta * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * (isHovered ? 2.2 : 0.7);
      ring2Ref.current.rotation.z += delta * 0.4;
    }
    if (beaconRef.current && isActive) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
      beaconRef.current.scale.set(pulse, 1, pulse);
    }
  });

  const groundY = -2.6;
  const dropLineHeight = Math.max(0.1, position[1] - groundY);

  return (
    <group position={position}>
      {/* Vertical Glowing Drop-Line down to isometric ground */}
      <mesh position={[0, -dropLineHeight / 2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, dropLineHeight, 8]} />
        <meshBasicMaterial
          color={colors.primary}
          transparent
          opacity={isDimmed ? 0.1 : isActive ? 0.7 : 0.35}
        />
      </mesh>

      {/* Ground Projection Disc */}
      <mesh position={[0, -dropLineHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.24, 24]} />
        <meshBasicMaterial
          color={colors.primary}
          transparent
          opacity={isDimmed ? 0.08 : isActive ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Interactive Node Group */}
      <group
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          soundEngine.playHapticFeedback('dot');
          onHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          onHover(false);
        }}
      >
        {/* Core Faceted Icosahedron */}
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.emissive}
            emissiveIntensity={isActive ? 1.6 : isHovered ? 1.3 : 0.7}
            roughness={0.2}
            metalness={0.85}
            wireframe={false}
            transparent
            opacity={isDimmed ? 0.25 : 0.95}
          />
        </mesh>

        {/* Inner Glowing Crystal Core */}
        <mesh>
          <octahedronGeometry args={[0.18, 0]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={isDimmed ? 0.2 : 0.9} />
        </mesh>

        {/* Equatorial Orbital Gyro Ring 1 */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.5, 0.018, 8, 32]} />
          <meshBasicMaterial
            color={colors.primary}
            transparent
            opacity={isDimmed ? 0.15 : isHovered ? 0.9 : 0.55}
          />
        </mesh>

        {/* Polar Orbital Gyro Ring 2 */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.62, 0.014, 8, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={isDimmed ? 0.1 : isHovered ? 0.8 : 0.35}
          />
        </mesh>

        {/* Active Section Luminous Beacon Cylinder */}
        {isActive && (
          <mesh ref={beaconRef} position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.22, 0.05, 0.9, 16, 1, true]} />
            <meshBasicMaterial
              color={colors.primary}
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Point Light for active and hovered nodes */}
        {(isActive || isHovered) && (
          <pointLight color={colors.primary} intensity={isActive ? 2.5 : 1.8} distance={3.5} />
        )}

        {/* 3D Floating HTML Label Pill */}
        <Html
          position={[0, 0.65, 0]}
          center
          distanceFactor={13}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: isDimmed ? 0.3 : 1,
            transform: `scale(${isHovered ? 1.12 : 1})`,
          }}
        >
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium backdrop-blur-md shadow-lg border whitespace-nowrap ${
                isActive
                  ? 'bg-neutral-900/95 text-amber-300 border-amber-400/60 ring-2 ring-amber-400/30'
                  : isHovered
                  ? 'bg-neutral-900/95 text-neutral-100 border-white/40 ring-1 ring-white/20'
                  : 'bg-neutral-950/80 text-neutral-300 border-white/10'
              }`}
            >
              <span className="font-bold text-neutral-400">{section.index}</span>
              <span className="font-semibold">{section.title}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>

            {/* Quick metric pill under label */}
            <div className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono text-neutral-400 bg-neutral-950/70 border border-white/5 whitespace-nowrap">
              {section.metrics[0]?.value} • {section.seasonName.split(' ')[0]}
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

// Ground Grid Floor with soft radial vignette
function IsometricGroundGrid() {
  return (
    <group position={[0, -2.62, 0]}>
      {/* Subtle planar grid */}
      <gridHelper args={[24, 24, '#38bdf8', '#1e293b']} position={[0, 0, 0]} />

      {/* Ground soft ambient disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial color="#030712" transparent opacity={0.88} />
      </mesh>

      {/* Decorative concentric orientation rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[3.8, 3.84, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[6.8, 6.84, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Scene Camera Orchestrator and Controller
function SceneContent({
  activeSectionIdx,
  onNavigateSection,
  selectedSeasonFilter,
  hoveredSectionIdx,
  onHoverSection,
  cameraResetTrigger,
}: Omit<IsometricStoryArcSceneProps, 'isMobile'>) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Reset camera to pristine isometric viewpoint when triggered
  React.useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [cameraResetTrigger]);

  return (
    <>
      {/* Isometric Lighting */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[12, 16, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-10, 8, -10]} intensity={0.4} color="#38bdf8" />
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#ffffff" distance={16} />

      {/* Orbit Controls with isometric angle bounds */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        minDistance={6}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2.15}
        dampingFactor={0.06}
        autoRotate={false}
      />

      {/* Ground isometric grid */}
      <IsometricGroundGrid />

      {/* Interconnecting 3D Arc Spline */}
      <ArcConnectingSpline positions={ARC_NODE_POSITIONS} hoveredIdx={hoveredSectionIdx} />

      {/* 8 Clickable Story Arc Nodes */}
      {NARRATIVE_SECTIONS.map((section, idx) => {
        const isDimmed =
          selectedSeasonFilter !== null &&
          section.seasonId.toLowerCase() !== selectedSeasonFilter.toLowerCase();

        return (
          <ArcNode
            key={section.id}
            section={section}
            position={ARC_NODE_POSITIONS[idx]}
            idx={idx}
            isActive={activeSectionIdx === idx}
            isHovered={hoveredSectionIdx === idx}
            isDimmed={isDimmed}
            onSelect={() => onNavigateSection(section.id)}
            onHover={(hovered) => onHoverSection(hovered ? idx : null)}
          />
        );
      })}
    </>
  );
}

export function IsometricStoryArcScene({
  activeSectionIdx,
  onNavigateSection,
  selectedSeasonFilter,
  hoveredSectionIdx,
  onHoverSection,
  isMobile,
  cameraResetTrigger,
}: IsometricStoryArcSceneProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        shadows
        camera={{
          position: isMobile ? [14, 13, 14] : [11, 10.5, 11],
          fov: isMobile ? 42 : 36,
          near: 0.1,
          far: 80,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <SceneContent
          activeSectionIdx={activeSectionIdx}
          onNavigateSection={onNavigateSection}
          selectedSeasonFilter={selectedSeasonFilter}
          hoveredSectionIdx={hoveredSectionIdx}
          onHoverSection={onHoverSection}
          cameraResetTrigger={cameraResetTrigger}
        />
      </Canvas>
    </div>
  );
}
