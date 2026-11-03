'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from '@/lib/math';

interface SummerHeatProps {
  opacity: number;
  isMobile: boolean;
  densityFactor?: number;
}

const THERMAL_DUST_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uDensity;
  attribute float aSpeed;
  attribute float aWobbleSpeed;
  attribute float aPhase;
  attribute float aScale;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vec3 pos = position;
    float height = 18.0;
    
    // Vertical wrap in range [-9.0, 9.0]
    float riseSpeed = aSpeed * (0.8 + 0.4 * uDensity);
    float yOffset = mod(pos.y + uTime * riseSpeed + 9.0, height) - 9.0;
    pos.y = yOffset;

    // Sinusoidal thermal wobble in X and Z
    pos.x += sin(uTime * aWobbleSpeed + aPhase + yOffset * 0.4) * 0.45;
    pos.z += cos(uTime * (aWobbleSpeed * 0.8) + aPhase * 1.3) * 0.35;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = aScale * (125.0 / -mvPosition.z);

    // Smooth edge fade at top and bottom bounds
    float edgeFade = smoothstep(-9.0, -7.0, pos.y) * (1.0 - smoothstep(7.0, 9.0, pos.y));
    vAlpha = edgeFade * uOpacity;
    vPhase = aPhase;
  }
`;

const THERMAL_DUST_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorAmber;
  uniform vec3 uColorCopper;
  uniform vec3 uColorGlow;
  uniform float uTime;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Heat shimmer oscillation
    float shimmer = 0.85 + 0.15 * sin(uTime * 3.5 + vPhase * 4.0);
    float core = 1.0 - smoothstep(0.0, 0.2, dist);
    float aura = (1.0 - smoothstep(0.0, 0.5, dist)) * shimmer;

    vec3 col = mix(uColorCopper, uColorAmber, aura);
    col = mix(col, uColorGlow, core * 0.7);

    gl_FragColor = vec4(col, aura * vAlpha * 0.85);
  }
`;

export function SummerHeatScene({ opacity, isMobile, densityFactor = 1 }: SummerHeatProps) {
  const dustMatRef = useRef<THREE.ShaderMaterial>(null);
  const hardwareGroupRef = useRef<THREE.Group>(null);
  const chipRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);

  const particleCount = isMobile ? 400 : 950;

  const { positions, speeds, wobbleSpeeds, phases, scales } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);
    const wob = new Float32Array(particleCount);
    const phs = new Float32Array(particleCount);
    const scl = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 26;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 18;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 20;

      spd[i] = 0.6 + seededRandom(i * 7 + 4) * 0.9;
      wob[i] = 1.4 + seededRandom(i * 9 + 2) * 1.6;
      phs[i] = seededRandom(i * 13 + 5) * Math.PI * 2;
      scl[i] = isMobile ? (0.6 + seededRandom(i * 17 + 1) * 0.5) : (0.7 + seededRandom(i * 17 + 1) * 0.7);
    }

    return { positions: pos, speeds: spd, wobbleSpeeds: wob, phases: phs, scales: scl };
  }, [particleCount, isMobile]);

  const dustUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uDensity: { value: densityFactor },
      uColorAmber: { value: new THREE.Color('#f59e0b') },  // Warm amber
      uColorCopper: { value: new THREE.Color('#d97706') }, // Rich copper
      uColorGlow: { value: new THREE.Color('#fbbf24') },   // Glowing incandescent core
    }),
    []
  );

  useFrame((state, delta) => {
    if (opacity <= 0.01) return;

    const time = state.clock.elapsedTime;

    if (dustMatRef.current) {
      dustUniforms.uTime.value = time;
      dustUniforms.uOpacity.value = opacity;
      dustUniforms.uDensity.value = densityFactor;
    }

    // Hardware wireframes rotation
    if (hardwareGroupRef.current) {
      hardwareGroupRef.current.rotation.y += delta * 0.25;
      hardwareGroupRef.current.rotation.x = Math.sin(time * 0.4) * 0.15;
    }

    if (chipRef.current) {
      chipRef.current.rotation.z += delta * 0.18;
    }

    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y -= delta * 0.35;
    }
  });

  // Early return culling when opacity drops below or equal to 0.01
  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* GLSL Shimmering Thermal Dust Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
          <bufferAttribute attach="attributes-aWobbleSpeed" args={[wobbleSpeeds, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={dustMatRef}
          vertexShader={THERMAL_DUST_VERTEX_SHADER}
          fragmentShader={THERMAL_DUST_FRAGMENT_SHADER}
          uniforms={dustUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Floating Hardware Wireframes (Dell & Amazon Compute Era) */}
      <group ref={hardwareGroupRef} position={[isMobile ? 0 : 2.5, 0, -2]}>
        {/* Central Core Microprocessor Die */}
        <mesh ref={chipRef}>
          <boxGeometry args={[2.2, 0.2, 2.2]} />
          <meshStandardMaterial
            color="#d97706"
            emissive="#b45309"
            emissiveIntensity={0.6 * opacity}
            wireframe
            transparent
            opacity={opacity * 0.85}
          />
        </mesh>

        {/* Outer Heat Spreader Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.4, 32]} />
          <meshBasicMaterial
            color="#f59e0b"
            wireframe
            transparent
            opacity={opacity * 0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Orbiting Hardware Nodes (Server Blades / Memory Modules) */}
        <group ref={orbitGroupRef}>
          {[0, 1, 2, 3].map((idx) => {
            const angle = (idx * Math.PI) / 2;
            const dist = 3.6;
            return (
              <mesh
                key={idx}
                position={[Math.cos(angle) * dist, Math.sin(angle) * 0.6, Math.sin(angle) * dist]}
                rotation={[0.3 * idx, angle, 0]}
              >
                <boxGeometry args={[0.8, 1.4, 0.15]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  wireframe
                  transparent
                  opacity={opacity * 0.7}
                />
              </mesh>
            );
          })}
        </group>

        {/* Structural Circuit Foundation Grid in Amber and Copper */}
        <gridHelper
          args={[8, 16, '#f59e0b', '#78350f']}
          position={[0, -2.5, 0]}
        />
      </group>
    </group>
  );
}
