'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ToranaArchModelProps {
  opacity: number;
  isMobile: boolean;
}

export function ToranaArchModel({ opacity, isMobile }: ToranaArchModelProps) {
  const archGroupRef = useRef<THREE.Group>(null);
  const kalasaRef = useRef<THREE.Mesh>(null);

  // Parametric Mukteshvara Torana Arch mathematical curve points
  const { archCurveGeometry, innerCurveGeometry } = useMemo(() => {
    const outerPoints: THREE.Vector3[] = [];
    const innerPoints: THREE.Vector3[] = [];

    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI;
      // Outer monumental semicircular arch
      const rOuter = 1.8;
      outerPoints.push(new THREE.Vector3(Math.cos(angle) * rOuter, Math.sin(angle) * rOuter + 1.2, 0));

      // Inner decorative cusp arch
      const rInner = 1.48;
      innerPoints.push(new THREE.Vector3(Math.cos(angle) * rInner, Math.sin(angle) * rInner + 1.2, 0));
    }

    return {
      archCurveGeometry: new THREE.BufferGeometry().setFromPoints(outerPoints),
      innerCurveGeometry: new THREE.BufferGeometry().setFromPoints(innerPoints),
    };
  }, []);

  useFrame((state) => {
    if (opacity <= 0.01) return;

    const time = state.clock.elapsedTime;

    // Subtle levitation and gentle yaw rotation
    if (archGroupRef.current) {
      archGroupRef.current.position.y = Math.sin(time * 0.8) * 0.12 - 0.2;
      archGroupRef.current.rotation.y = Math.sin(time * 0.4) * 0.22;
    }

    // Sacred Kalasa finial pulse
    if (kalasaRef.current) {
      const mat = kalasaRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = (0.75 + 0.25 * Math.sin(time * 2.8)) * opacity;
      }
    }
  });

  // Early return culling
  if (opacity <= 0.01) return null;

  return (
    <group ref={archGroupRef} position={[isMobile ? 0 : 2.6, 0, -2]}>
      {/* 1. Dual Cylinder Pillars with Capital Brackets */}
      {/* Left Pillar */}
      <group position={[-1.8, 0, 0]}>
        {/* Pillar Shaft */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 3.6, 24]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#065f46"
            emissiveIntensity={0.65 * opacity}
            wireframe
            transparent
            opacity={opacity * 0.8}
          />
        </mesh>

        {/* Pillar Capital Bracket */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.55, 0.16, 0.55]} />
          <meshStandardMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={opacity * 0.75}
          />
        </mesh>

        {/* Multi-Tiered Pedestal Base */}
        <mesh position={[0, -2.4, 0]}>
          <boxGeometry args={[0.7, 0.4, 0.7]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={opacity * 0.65}
          />
        </mesh>
        <mesh position={[0, -2.65, 0]}>
          <boxGeometry args={[0.9, 0.16, 0.9]} />
          <meshBasicMaterial
            color="#10b981"
            wireframe
            transparent
            opacity={opacity * 0.55}
          />
        </mesh>
      </group>

      {/* Right Pillar */}
      <group position={[1.8, 0, 0]}>
        {/* Pillar Shaft */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 3.6, 24]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#065f46"
            emissiveIntensity={0.65 * opacity}
            wireframe
            transparent
            opacity={opacity * 0.8}
          />
        </mesh>

        {/* Pillar Capital Bracket */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.55, 0.16, 0.55]} />
          <meshStandardMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={opacity * 0.75}
          />
        </mesh>

        {/* Multi-Tiered Pedestal Base */}
        <mesh position={[0, -2.4, 0]}>
          <boxGeometry args={[0.7, 0.4, 0.7]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={opacity * 0.65}
          />
        </mesh>
        <mesh position={[0, -2.65, 0]}>
          <boxGeometry args={[0.9, 0.16, 0.9]} />
          <meshBasicMaterial
            color="#10b981"
            wireframe
            transparent
            opacity={opacity * 0.55}
          />
        </mesh>
      </group>

      {/* 2. Horizontal Lintel Transom Connector */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[3.8, 0.14, 0.3]} />
        <meshStandardMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={opacity * 0.75}
        />
      </mesh>

      {/* 3. Smooth Parametric Semicircular Arch Outlines */}
      <primitive
        object={
          new THREE.Line(
            archCurveGeometry,
            new THREE.LineBasicMaterial({
              color: 0x06b6d4,
              transparent: true,
              opacity: opacity * 0.9,
            })
          )
        }
      />

      <primitive
        object={
          new THREE.Line(
            innerCurveGeometry,
            new THREE.LineBasicMaterial({
              color: 0x10b981,
              transparent: true,
              opacity: opacity * 0.65,
            })
          )
        }
      />

      {/* 4. Concentric Torus Decoration (Signature Mukteshvara Makara Arch Torus) */}
      <mesh position={[0, 1.2, 0]}>
        <torusGeometry args={[1.8, 0.08, 14, 48, Math.PI]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.8 * opacity}
          wireframe
          transparent
          opacity={opacity * 0.8}
        />
      </mesh>

      <mesh position={[0, 1.2, 0]}>
        <torusGeometry args={[1.52, 0.045, 12, 40, Math.PI]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={opacity * 0.65}
        />
      </mesh>

      {/* 5. Sacred Kalasa Crest Finial crowning the apex */}
      <group position={[0, 3.15, 0]}>
        {/* Urn Base Ring */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.26, 0.32, 0.12, 16]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={opacity * 0.75}
          />
        </mesh>

        {/* Central Kalasa Octahedron */}
        <mesh ref={kalasaRef}>
          <octahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.85 * opacity}
            wireframe
            transparent
            opacity={opacity * 0.9}
          />
        </mesh>

        {/* Spire Needle Apex */}
        <mesh position={[0, 0.42, 0]}>
          <coneGeometry args={[0.12, 0.45, 12]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.7 * opacity}
            wireframe
            transparent
            opacity={opacity * 0.85}
          />
        </mesh>
      </group>

      {/* 6. Emerald Projection Ground Grid */}
      <gridHelper
        args={[16, 24, '#10b981', '#022c22']}
        position={[0, -3.2, 0]}
      />
    </group>
  );
}

