'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from '@/lib/math';

interface MonsoonRainProps {
  opacity: number;
  isMobile: boolean;
  densityFactor?: number;
}

const RAIN_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uDensity;
  attribute float aSpeed;
  attribute float aLength;
  attribute float aPhase;
  varying float vAlpha;
  varying float vLength;

  void main() {
    vec3 pos = position;
    float span = 26.0;
    float fallSpeed = aSpeed * (0.8 + 0.4 * uDensity);
    
    // Fast downward fall with continuous vertical wrapping
    float yOffset = mod(pos.y - uTime * fallSpeed + 13.0, span) - 13.0;
    pos.y = yOffset;

    // Wind slant in X
    pos.x -= (13.0 - yOffset) * 0.12;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size streak scaling with depth
    gl_PointSize = aLength * (135.0 / -mvPosition.z);

    // Fade near upper and lower boundaries
    float boundaryFade = smoothstep(-13.0, -10.0, pos.y) * (1.0 - smoothstep(10.0, 13.0, pos.y));
    vAlpha = boundaryFade * uOpacity;
    vLength = aLength;
  }
`;

const RAIN_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColorSecondary;
  varying float vAlpha;
  varying float vLength;

  void main() {
    // Elongated rain streak: scale horizontal width
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(vec2(coord.x * 3.2, coord.y));
    if (dist > 0.5) discard;

    // High-contrast electric cyan streak intensity
    float intensity = 1.0 - smoothstep(0.0, 0.5, dist);
    // Vertical streak graduation
    intensity *= (0.3 + 0.7 * (coord.y + 0.5));

    vec3 col = mix(uColorSecondary, uColor, intensity);
    gl_FragColor = vec4(col, intensity * vAlpha * 0.95);
  }
`;

const RIPPLE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RIPPLE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uColorDark;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - vec2(0.5)) * 2.0;
    float dist = length(centered);
    if (dist > 1.0) discard;

    // Concentric expanding waves radiating outward on GPU
    float rippleTotal = 0.0;
    for (int i = 0; i < 4; i++) {
      float offset = float(i) * 0.25;
      float progress = fract(uTime * 0.4 + offset);
      float targetR = progress * 0.95;
      float ringWidth = 0.02 + progress * 0.035;
      float d = abs(dist - targetR);
      float wave = smoothstep(ringWidth, 0.0, d) * (1.0 - progress);
      rippleTotal += wave;
    }

    float alpha = clamp(rippleTotal, 0.0, 1.0) * uOpacity * 0.75;
    vec3 col = mix(uColorDark, uColor, clamp(rippleTotal, 0.0, 1.0));
    gl_FragColor = vec4(col, alpha);
  }
`;

export function MonsoonRainScene({ opacity, isMobile, densityFactor = 1 }: MonsoonRainProps) {
  const rainMatRef = useRef<THREE.ShaderMaterial>(null);
  const rippleMatRef = useRef<THREE.ShaderMaterial>(null);
  const metricsChartRef = useRef<THREE.Group>(null);

  const rainCount = isMobile ? 700 : 1800;

  // Rain GPU buffer attributes
  const { positions, speeds, lengths, phases } = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    const spd = new Float32Array(rainCount);
    const len = new Float32Array(rainCount);
    const phs = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 30;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 26;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 24;
      spd[i] = 16.0 + seededRandom(i * 7 + 4) * 14.0; // High speed
      len[i] = isMobile ? (0.6 + seededRandom(i * 5 + 2) * 0.6) : (0.8 + seededRandom(i * 5 + 2) * 0.8);
      phs[i] = seededRandom(i * 11 + 7) * Math.PI * 2;
    }
    return { positions: pos, speeds: spd, lengths: len, phases: phs };
  }, [rainCount, isMobile]);

  // GLSL Uniforms for Rain Streaks
  const rainUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColor: { value: new THREE.Color('#00f0ff') },         // Electric cyan
      uColorSecondary: { value: new THREE.Color('#38bdf8') },// Slate cyan
      uDensity: { value: densityFactor },
    }),
    []
  );

  // GLSL Uniforms for Ripples
  const rippleUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uColor: { value: new THREE.Color('#00f0ff') },
      uColorDark: { value: new THREE.Color('#0284c7') },
    }),
    []
  );

  useFrame((state) => {
    if (opacity <= 0.01) return;

    const time = state.clock.elapsedTime;

    if (rainMatRef.current) {
      rainUniforms.uTime.value = time;
      rainUniforms.uOpacity.value = opacity;
      rainUniforms.uDensity.value = densityFactor;
    }

    if (rippleMatRef.current) {
      rippleUniforms.uTime.value = time;
      rippleUniforms.uOpacity.value = opacity;
    }

    // Dynamic metrics wave (Google Ads / GA4 Telemetry)
    if (metricsChartRef.current) {
      metricsChartRef.current.children.forEach((bar, idx) => {
        const height = Math.sin(time * 2.5 + idx * 0.45) * 1.4 + 2.0;
        bar.scale.y = Math.max(0.2, height);
      });
      metricsChartRef.current.rotation.y = Math.sin(time * 0.2) * 0.2;
    }
  });

  // Early return culling when opacity drops below or equal to 0.01
  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* GLSL Rain Streaks Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
          <bufferAttribute attach="attributes-aLength" args={[lengths, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={rainMatRef}
          vertexShader={RAIN_VERTEX_SHADER}
          fragmentShader={RAIN_FRAGMENT_SHADER}
          uniforms={rainUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* GPU Ripple Surface (CTR & Auction Pulses) */}
      <mesh position={[isMobile ? 0 : 2.5, -3.2, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <shaderMaterial
          ref={rippleMatRef}
          vertexShader={RIPPLE_VERTEX_SHADER}
          fragmentShader={RIPPLE_FRAGMENT_SHADER}
          uniforms={rippleUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Telemetry Performance Bar Columns in Electric Cyan Wireframe */}
      <group ref={metricsChartRef} position={[isMobile ? 0 : 2.5, -2.5, -2]}>
        {[-2.0, -1.2, -0.4, 0.4, 1.2, 2.0].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, 0, 0]}>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#0284c7"
              emissiveIntensity={0.8 * opacity}
              wireframe
              transparent
              opacity={opacity * 0.75}
            />
          </mesh>
        ))}
      </group>

      {/* Water Horizon Grid in Slate Blue / Electric Cyan */}
      <gridHelper
        args={[16, 24, '#00f0ff', '#0f172a']}
        position={[0, -3.5, 0]}
      />
    </group>
  );
}
