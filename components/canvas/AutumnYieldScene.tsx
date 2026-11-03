'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from '@/lib/math';

interface AutumnYieldProps {
  opacity: number;
  isMobile: boolean;
  densityFactor?: number;
}

const HARVEST_EMBERS_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uDensity;
  attribute float aSpeed;
  attribute float aFlutterFreq;
  attribute float aPhase;
  attribute float aScale;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vec3 pos = position;
    float height = 16.0;

    // Downward gentle drift with vertical wrap in [-8.0, 8.0]
    float fallSpeed = aSpeed * 0.8 * (0.8 + 0.4 * uDensity);
    float yOffset = mod(pos.y - uTime * fallSpeed + 8.0, height) - 8.0;
    pos.y = yOffset;

    // Fluttering leaf/ember trajectory
    float flutter = sin(uTime * aFlutterFreq + aPhase);
    pos.x += flutter * 0.5 + sin(uTime * 0.6 + yOffset * 0.3) * 0.25;
    pos.z += cos(uTime * (aFlutterFreq * 0.85) + aPhase * 1.5) * 0.4;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = aScale * (120.0 / -mvPosition.z);

    float edgeFade = smoothstep(-8.0, -6.5, pos.y) * (1.0 - smoothstep(6.5, 8.0, pos.y));
    vAlpha = edgeFade * uOpacity;
    vPhase = aPhase;
  }
`;

const HARVEST_EMBERS_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorGold;
  uniform vec3 uColorBronze;
  uniform vec3 uColorCore;
  uniform float uTime;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Flickering ember pulse
    float flicker = 0.8 + 0.2 * sin(uTime * 4.2 + vPhase * 3.0);
    float core = 1.0 - smoothstep(0.0, 0.18, dist);
    float glow = (1.0 - smoothstep(0.0, 0.5, dist)) * flicker;

    vec3 col = mix(uColorBronze, uColorGold, glow);
    col = mix(col, uColorCore, core * 0.65);

    gl_FragColor = vec4(col, glow * vAlpha * 0.85);
  }
`;

export function AutumnYieldScene({ opacity, isMobile, densityFactor = 1 }: AutumnYieldProps) {
  const embersMatRef = useRef<THREE.ShaderMaterial>(null);
  const spiralGroupRef = useRef<THREE.Group>(null);
  const curvesGroupRef = useRef<THREE.Group>(null);

  const emberCount = isMobile ? 350 : 800;

  const { positions, speeds, flutterFreqs, phases, scales } = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const spd = new Float32Array(emberCount);
    const flt = new Float32Array(emberCount);
    const phs = new Float32Array(emberCount);
    const scl = new Float32Array(emberCount);

    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 24;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 16;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 20;

      spd[i] = 0.5 + seededRandom(i * 7 + 3) * 0.7;
      flt[i] = 1.2 + seededRandom(i * 9 + 5) * 1.5;
      phs[i] = seededRandom(i * 13 + 7) * Math.PI * 2;
      scl[i] = isMobile ? (0.6 + seededRandom(i * 17 + 2) * 0.5) : (0.7 + seededRandom(i * 17 + 2) * 0.7);
    }

    return { positions: pos, speeds: spd, flutterFreqs: flt, phases: phs, scales: scl };
  }, [emberCount, isMobile]);

  // Financial branching curve lines (ROI compound curve / efficient frontier)
  const curveLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    const numBranches = 5;
    for (let b = 0; b < numBranches; b++) {
      const points: THREE.Vector3[] = [];
      const branchAngle = (b / numBranches) * Math.PI * 2;
      for (let step = 0; step <= 25; step++) {
        const t = step / 25;
        const r = 0.4 + Math.pow(t, 1.8) * 2.8;
        const x = Math.cos(branchAngle + t * 1.5) * r;
        const y = (t - 0.5) * 4.2;
        const z = Math.sin(branchAngle + t * 1.5) * r;
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(points);
    }
    return lines;
  }, []);

  const embersUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uDensity: { value: densityFactor },
      uColorGold: { value: new THREE.Color('#eab308') },   // Harvest gold
      uColorBronze: { value: new THREE.Color('#ca8a04') }, // Rich bronze
      uColorCore: { value: new THREE.Color('#fef08a') },   // Luminous core
    }),
    []
  );

  useFrame((state, delta) => {
    if (opacity <= 0.01) return;

    const time = state.clock.elapsedTime;

    if (embersMatRef.current) {
      embersUniforms.uTime.value = time;
      embersUniforms.uOpacity.value = opacity;
      embersUniforms.uDensity.value = densityFactor;
    }

    if (curvesGroupRef.current) {
      curvesGroupRef.current.rotation.y += delta * 0.3;
    }

    if (spiralGroupRef.current) {
      spiralGroupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
      spiralGroupRef.current.rotation.z += delta * 0.15;
    }
  });

  // Early return culling when opacity drops below or equal to 0.01
  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* GLSL Fluttering Harvest Embers */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
          <bufferAttribute attach="attributes-aFlutterFreq" args={[flutterFreqs, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={embersMatRef}
          vertexShader={HARVEST_EMBERS_VERTEX_SHADER}
          fragmentShader={HARVEST_EMBERS_FRAGMENT_SHADER}
          uniforms={embersUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Financial Growth Branching Curves & Portfolio Yield Sculptures */}
      <group position={[isMobile ? 0 : 2.6, 0, -2]}>
        <group ref={curvesGroupRef}>
          {curveLines.map((pts, idx) => {
            const geometry = new THREE.BufferGeometry().setFromPoints(pts);
            const mat = new THREE.LineBasicMaterial({
              color: 0xca8a04,
              transparent: true,
              opacity: opacity * 0.7,
            });
            const lineObj = new THREE.Line(geometry, mat);
            return <primitive key={idx} object={lineObj} />;
          })}
        </group>

        {/* Wealth Stewardship Orbiting Astrolabe Rings */}
        <group ref={spiralGroupRef}>
          {[1.6, 2.3, 3.0].map((radius, i) => (
            <mesh key={i} rotation={[i * 0.6, i * 0.4, 0]}>
              <ringGeometry args={[radius, radius + 0.04, 64]} />
              <meshBasicMaterial
                color="#eab308"
                transparent
                opacity={opacity * 0.65}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* Central Core Yield Polyhedron in Harvest Gold & Bronze */}
        <mesh>
          <octahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#a16207"
            emissiveIntensity={0.6 * opacity}
            wireframe
            transparent
            opacity={opacity * 0.8}
          />
        </mesh>
      </group>

      {/* Gold & Bronze Floor Horizon Grid */}
      <gridHelper
        args={[14, 20, '#eab308', '#292524']}
        position={[0, -3.2, 0]}
      />
    </group>
  );
}
