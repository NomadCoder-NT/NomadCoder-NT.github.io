'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from '@/lib/math';

interface WinterFrostProps {
  opacity: number;
  isMobile: boolean;
  densityFactor?: number;
}

const SNOWFLAKE_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uDensity;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aScale;
  attribute float aSpin;
  varying float vAlpha;
  varying float vRotation;
  varying float vPhase;

  void main() {
    vec3 pos = position;
    float height = 18.0;

    // Fall downwards with continuous vertical wrap in [-9.0, 9.0]
    float fallSpeed = aSpeed * 1.6 * (0.8 + 0.4 * uDensity);
    float yOffset = mod(pos.y - uTime * fallSpeed + 9.0, height) - 9.0;
    pos.y = yOffset;

    // Sinusoidal wind sway
    pos.x += sin(uTime * 1.1 + aPhase) * 0.55;
    pos.z += cos(uTime * 0.8 + aPhase * 1.3) * 0.35;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = aScale * (135.0 / -mvPosition.z);

    // Boundary edge fade
    float edgeFade = smoothstep(-9.0, -7.0, pos.y) * (1.0 - smoothstep(7.0, 9.0, pos.y));
    vAlpha = edgeFade * uOpacity;
    vRotation = aPhase + uTime * aSpin;
    vPhase = aPhase;
  }
`;

const SNOWFLAKE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorFrost;
  uniform vec3 uColorIce;
  uniform float uTime;
  varying float vAlpha;
  varying float vRotation;
  varying float vPhase;

  #define M_PI 3.14159265358979323846

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float r = length(uv);
    if (r > 0.48) discard;

    // Rotate coordinate system
    float c = cos(vRotation);
    float s = sin(vRotation);
    vec2 rotUv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);

    float angle = atan(rotUv.y, rotUv.x);

    // 6-pointed star mask via 6-fold radial symmetry (PI / 3 = 60 degrees)
    float sector = M_PI / 3.0;
    float foldedAngle = abs(mod(angle + sector * 0.5, sector) - sector * 0.5);

    // Main needle spine along each arm
    float spineDist = r * sin(foldedAngle);
    float spineWidth = 0.022 + 0.025 * (0.5 - r);
    float spine = smoothstep(spineWidth, 0.0, spineDist);

    // Hexagonal branching dendrite arms along the needles
    float branch = 0.0;
    if (r > 0.16 && r < 0.40) {
      float branchOffset = abs(spineDist - (r - 0.20) * 0.52);
      branch = smoothstep(0.022, 0.0, branchOffset) * smoothstep(0.40, 0.28, r);
    }

    // Central core crystal
    float core = 1.0 - smoothstep(0.0, 0.14, r);

    // Combine 6-pointed star features
    float mask = clamp(core + spine * 0.88 + branch * 0.65, 0.0, 1.0);
    if (mask < 0.05) discard;

    // Crystalline shimmer
    float shimmer = 0.9 + 0.1 * sin(uTime * 3.2 + vPhase * 4.0);
    vec3 col = mix(uColorFrost, uColorIce, mask * shimmer);

    gl_FragColor = vec4(col, mask * vAlpha * 0.95);
  }
`;

export function WinterFrostScene({ opacity, isMobile, densityFactor = 1 }: WinterFrostProps) {
  const snowMatRef = useRef<THREE.ShaderMaterial>(null);
  const iceCrystalRef = useRef<THREE.Group>(null);

  const snowCount = isMobile ? 500 : 1200;

  const { positions, speeds, phases, scales, spins } = useMemo(() => {
    const pos = new Float32Array(snowCount * 3);
    const spd = new Float32Array(snowCount);
    const phs = new Float32Array(snowCount);
    const scl = new Float32Array(snowCount);
    const spn = new Float32Array(snowCount);

    for (let i = 0; i < snowCount; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 28;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 18;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 22;

      spd[i] = 0.8 + seededRandom(i * 7 + 2) * 1.2;
      phs[i] = seededRandom(i * 11 + 5) * Math.PI * 2;
      scl[i] = isMobile ? (0.65 + seededRandom(i * 13 + 1) * 0.5) : (0.8 + seededRandom(i * 13 + 1) * 0.7);
      spn[i] = (seededRandom(i * 17 + 3) - 0.5) * 1.8;
    }

    return { positions: pos, speeds: spd, phases: phs, scales: scl, spins: spn };
  }, [snowCount, isMobile]);

  const snowflakeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uDensity: { value: densityFactor },
      uColorFrost: { value: new THREE.Color('#38bdf8') }, // Frost blue
      uColorIce: { value: new THREE.Color('#e0f2fe') },   // Crisp ice white
    }),
    []
  );

  useFrame((state, delta) => {
    if (opacity <= 0.01) return;

    const time = state.clock.elapsedTime;

    if (snowMatRef.current) {
      snowflakeUniforms.uTime.value = time;
      snowflakeUniforms.uOpacity.value = opacity;
      snowflakeUniforms.uDensity.value = densityFactor;
    }

    if (iceCrystalRef.current) {
      iceCrystalRef.current.rotation.y += delta * 0.25;
      iceCrystalRef.current.rotation.x = Math.sin(time * 0.4) * 0.15;
    }
  });

  // Early return culling when opacity drops below or equal to 0.01
  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* GLSL Crystalline Snowflake Particles with 6-Pointed Star Masks */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aSpin" args={[spins, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={snowMatRef}
          vertexShader={SNOWFLAKE_VERTEX_SHADER}
          fragmentShader={SNOWFLAKE_FRAGMENT_SHADER}
          uniforms={snowflakeUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Floating Geometric Ice Crystals (Winter Era) */}
      <group ref={iceCrystalRef} position={[isMobile ? 0 : 2.5, 0, -2]}>
        {/* Core Octahedral Ice Crystal */}
        <mesh>
          <octahedronGeometry args={[1.6, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.6 * opacity}
            wireframe
            transparent
            opacity={opacity * 0.8}
          />
        </mesh>

        {/* Orbiting Frost Polyhedra */}
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const angle = (idx * Math.PI) / 3;
          const dist = 2.8;
          return (
            <mesh
              key={idx}
              position={[
                Math.cos(angle) * dist,
                Math.sin(angle * 2) * 0.4,
                Math.sin(angle) * dist,
              ]}
              rotation={[idx * 0.4, angle, idx * 0.2]}
            >
              <tetrahedronGeometry args={[0.5, 0]} />
              <meshBasicMaterial
                color="#e0f2fe"
                wireframe
                transparent
                opacity={opacity * 0.65}
              />
            </mesh>
          );
        })}
      </group>

      {/* Frosty Ground Grid in Crisp Ice Blue */}
      <gridHelper
        args={[16, 24, '#38bdf8', '#082f49']}
        position={[0, -3.2, 0]}
      />
    </group>
  );
}
