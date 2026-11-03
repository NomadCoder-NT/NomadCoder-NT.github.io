'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ServerDieModelProps {
  opacity: number;
  isMobile: boolean;
}

export function ServerDieModel({ opacity, isMobile }: ServerDieModelProps) {
  const dieGroupRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const coreDieRef = useRef<THREE.Mesh>(null);

  // Generate gold edge-pin matrix coordinates around the package perimeter
  const edgePins = useMemo(() => {
    const pins: [number, number, number][] = [];
    const span = 1.45;
    const countPerEdge = 9;
    const step = (span * 2) / (countPerEdge - 1);

    for (let i = 0; i < countPerEdge; i++) {
      const coord = -span + i * step;
      // Top and bottom edges
      pins.push([coord, -0.06, span]);
      pins.push([coord, -0.06, -span]);
      // Left and right edges
      pins.push([span, -0.06, coord]);
      pins.push([-span, -0.06, coord]);
    }
    return pins;
  }, []);

  useFrame((state, delta) => {
    if (opacity <= 0.01) return;

    const time = state.clock.elapsedTime;

    // Smooth orbital rotation and gentle isometric tilt
    if (dieGroupRef.current) {
      dieGroupRef.current.rotation.y += delta * 0.28;
      dieGroupRef.current.rotation.x = Math.sin(time * 0.4) * 0.12 + 0.32;
      dieGroupRef.current.rotation.z = Math.cos(time * 0.3) * 0.06;
    }

    // Counter-orbital rotation for PCIe and memory channel nodes
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y -= delta * 0.38;
    }

    // Microprocessor core clock pulse (boosted emissive intensity)
    if (coreDieRef.current) {
      const mat = coreDieRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = (1.05 + 0.4 * Math.sin(time * 3.5)) * opacity;
      }
    }
  });

  // Early return culling
  if (opacity <= 0.01) return null;

  return (
    <group
      ref={dieGroupRef}
      position={[isMobile ? 0 : 2.5, 0, -1.2]}
      scale={isMobile ? [1.25, 1.25, 1.25] : [1.65, 1.65, 1.65]}
    >
      {/* 1. Dark Substrate Base Package */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3.2, 0.12, 3.2]} />
        <meshStandardMaterial
          color="#090d16"
          roughness={0.25}
          metalness={0.85}
          transparent
          opacity={opacity * 0.95}
        />
      </mesh>

      {/* Substrate Wireframe Outline */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3.22, 0.13, 3.22]} />
        <meshBasicMaterial
          color="#d97706"
          wireframe
          transparent
          opacity={opacity * 0.75}
        />
      </mesh>

      {/* 2. Gold Edge-Pin Matrix */}
      <group>
        {edgePins.map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]}>
            <cylinderGeometry args={[0.035, 0.035, 0.14, 8]} />
            <meshStandardMaterial
              color="#facc15"
              emissive="#a16207"
              emissiveIntensity={0.85 * opacity}
              roughness={0.15}
              metalness={0.95}
              transparent
              opacity={opacity * 0.95}
            />
          </mesh>
        ))}
      </group>

      {/* 3. Monolithic Silicon Die Wireframe Core */}
      <mesh ref={coreDieRef} position={[0, 0.14, 0]}>
        <boxGeometry args={[1.85, 0.24, 1.85]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={1.1 * opacity}
          wireframe
          transparent
          opacity={opacity * 0.95}
        />
      </mesh>

      {/* Internal Logic Partitioning Lines */}
      {[-0.45, 0.45].map((offset, idx) => (
        <group key={idx}>
          <mesh position={[offset, 0.22, 0]}>
            <boxGeometry args={[0.02, 0.06, 1.7]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={opacity * 0.75}
            />
          </mesh>
          <mesh position={[0, 0.22, offset]}>
            <boxGeometry args={[1.7, 0.06, 0.02]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={opacity * 0.75}
            />
          </mesh>
        </group>
      ))}

      {/* 4. Heat-Spreader Ring (Integrated Heat Spreader retention frame) */}
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.35, 1.55, 40]} />
        <meshBasicMaterial
          color="#ea580c"
          wireframe
          transparent
          opacity={opacity * 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.45, 0.045, 12, 48]} />
        <meshStandardMaterial
          color="#d97706"
          emissive="#d97706"
          emissiveIntensity={0.75 * opacity}
          wireframe
          transparent
          opacity={opacity * 0.85}
        />
      </mesh>

      {/* 5. Orbiting PCIe / Memory Channel Nodes */}
      <group ref={orbitGroupRef}>
        {[0, 1, 2, 3].map((idx) => {
          const angle = (idx * Math.PI) / 2;
          const dist = 3.6;
          const x = Math.cos(angle) * dist;
          const z = Math.sin(angle) * dist;
          return (
            <group key={idx} position={[x, Math.sin(angle) * 0.4, z]} rotation={[0.2 * idx, angle, 0]}>
              {/* Channel Blade Body */}
              <mesh>
                <boxGeometry args={[0.7, 1.3, 0.14]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#d97706"
                  emissiveIntensity={0.85 * opacity}
                  wireframe
                  transparent
                  opacity={opacity * 0.85}
                />
              </mesh>

              {/* Edge Connector Finger Gold Pins */}
              <mesh position={[0, -0.68, 0]}>
                <boxGeometry args={[0.5, 0.12, 0.06]} />
                <meshBasicMaterial
                  color="#facc15"
                  transparent
                  opacity={opacity * 0.85}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Structural Circuit Foundation Grid in Amber and Copper */}
      <gridHelper
        args={[8, 16, '#f59e0b', '#78350f']}
        position={[0, -2.5, 0]}
      />
    </group>
  );
}

