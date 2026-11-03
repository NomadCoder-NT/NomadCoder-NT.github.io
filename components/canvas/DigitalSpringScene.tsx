'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from '@/lib/math';

interface DigitalSpringProps {
  opacity: number;
  isMobile: boolean;
  densityFactor?: number;
}

const NEURAL_SPORES_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uDensity;
  attribute float aPhase;
  attribute float aScale;
  attribute float aFloatSpeed;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vec3 pos = position;

    // Organic bioluminescent hovering and levitation
    pos.x += sin(uTime * aFloatSpeed + aPhase) * 0.25;
    pos.y += cos(uTime * (aFloatSpeed * 0.8) + aPhase * 1.2) * 0.2;
    pos.z += sin(uTime * (aFloatSpeed * 0.6) + aPhase * 0.7) * 0.2;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Breathing pulse
    float breath = 1.0 + 0.3 * sin(uTime * 2.4 + aPhase);
    gl_PointSize = aScale * breath * (130.0 / -mvPosition.z) * (0.8 + 0.4 * uDensity);

    vAlpha = uOpacity;
    vPhase = aPhase;
  }
`;

const NEURAL_SPORES_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorEmerald;
  uniform vec3 uColorCyan;
  uniform vec3 uColorHot;
  uniform float uTime;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Bioluminescent dual-hue radial falloff
    float pulse = 0.85 + 0.15 * sin(uTime * 3.0 + vPhase * 2.0);
    float core = 1.0 - smoothstep(0.0, 0.22, dist);
    float glow = (1.0 - smoothstep(0.0, 0.5, dist)) * pulse;

    vec3 col = mix(uColorEmerald, uColorCyan, dist * 2.0);
    col = mix(col, uColorHot, core * 0.8);

    gl_FragColor = vec4(col, glow * vAlpha * 0.95);
  }
`;

export function DigitalSpringScene({ opacity, isMobile, densityFactor = 1 }: DigitalSpringProps) {
  const sporesMatRef = useRef<THREE.ShaderMaterial>(null);
  const neuralGroupRef = useRef<THREE.Group>(null);

  const nodeCount = isMobile ? 45 : 90;

  // Neural network graph nodes & connection lines
  const { nodePositions, phases, scales, floatSpeeds, connectionGeometry } = useMemo(() => {
    const positions: [number, number, number][] = [];
    const posFlat = new Float32Array(nodeCount * 3);
    const phs = new Float32Array(nodeCount);
    const scl = new Float32Array(nodeCount);
    const flt = new Float32Array(nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      const x = (seededRandom(i * 3 + 1) - 0.5) * 14;
      const y = (seededRandom(i * 3 + 2) - 0.5) * 9;
      const z = (seededRandom(i * 3 + 3) - 0.5) * 11;
      positions.push([x, y, z]);
      posFlat[i * 3] = x;
      posFlat[i * 3 + 1] = y;
      posFlat[i * 3 + 2] = z;

      phs[i] = seededRandom(i * 11 + 3) * Math.PI * 2;
      scl[i] = isMobile ? (0.7 + seededRandom(i * 7 + 1) * 0.6) : (0.9 + seededRandom(i * 7 + 1) * 0.8);
      flt[i] = 0.8 + seededRandom(i * 13 + 5) * 0.9;
    }

    // Connect nodes within a proximity threshold
    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = positions[i][0] - positions[j][0];
        const dy = positions[i][1] - positions[j][1];
        const dz = positions[i][2] - positions[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 3.4) {
          linePoints.push(new THREE.Vector3(...positions[i]));
          linePoints.push(new THREE.Vector3(...positions[j]));
        }
      }
    }

    const connGeom = new THREE.BufferGeometry().setFromPoints(linePoints);

    return {
      nodePositions: posFlat,
      phases: phs,
      scales: scl,
      floatSpeeds: flt,
      connectionGeometry: connGeom,
    };
  }, [nodeCount, isMobile]);

  const sporesUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uDensity: { value: densityFactor },
      uColorEmerald: { value: new THREE.Color('#10b981') }, // Vibrant emerald
      uColorCyan: { value: new THREE.Color('#06b6d4') },    // Electric cyan
      uColorHot: { value: new THREE.Color('#67e8f9') },     // Glowing core
    }),
    []
  );

  useFrame((state, delta) => {
    if (opacity <= 0.01) return;

    const time = state.clock.elapsedTime;

    if (sporesMatRef.current) {
      sporesUniforms.uTime.value = time;
      sporesUniforms.uOpacity.value = opacity;
      sporesUniforms.uDensity.value = densityFactor;
    }

    if (neuralGroupRef.current) {
      neuralGroupRef.current.rotation.y += delta * 0.12;
      neuralGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  // Early return culling when opacity drops below or equal to 0.01
  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* GLSL Bioluminescent Neural Spores & Synapses */}
      <group ref={neuralGroupRef} position={[isMobile ? 0 : -2.5, 0.5, -4]}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
            <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
            <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
            <bufferAttribute attach="attributes-aFloatSpeed" args={[floatSpeeds, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={sporesMatRef}
            vertexShader={NEURAL_SPORES_VERTEX_SHADER}
            fragmentShader={NEURAL_SPORES_FRAGMENT_SHADER}
            uniforms={sporesUniforms}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Synaptic Interconnection Lines */}
        <primitive
          object={
            new THREE.LineSegments(
              connectionGeometry,
              new THREE.LineBasicMaterial({
                color: 0x10b981,
                transparent: true,
                opacity: opacity * 0.38,
              })
            )
          }
        />
      </group>
    </group>
  );
}
