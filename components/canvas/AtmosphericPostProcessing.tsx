'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Noise, ChromaticAberration, wrapEffect } from '@react-three/postprocessing';
import { BlendFunction, ChromaticAberrationEffect, NoiseEffect, Effect } from 'postprocessing';
import * as THREE from 'three';

const MOTION_BLUR_FRAGMENT_SHADER = `
  uniform float uVelocity;
  uniform vec2 uDirection;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float vel = clamp(abs(uVelocity), 0.0, 0.045);
    if (vel < 0.0006) {
      outputColor = inputColor;
      return;
    }
    vec4 accum = vec4(0.0);
    float totalWeight = 0.0;
    // Step vector along the vertical scroll velocity direction
    vec2 step = normalize(uDirection) * vel * 0.45;
    for (int i = -4; i <= 4; i++) {
      float fi = float(i);
      float weight = exp(-0.5 * (fi * fi) / 3.0);
      vec2 offsetUv = clamp(uv + step * (fi / 4.0), vec2(0.001), vec2(0.999));
      accum += texture2D(inputBuffer, offsetUv) * weight;
      totalWeight += weight;
    }
    outputColor = accum / totalWeight;
  }
`;

export class VelocityMotionBlurEffect extends Effect {
  constructor() {
    super('VelocityMotionBlurEffect', MOTION_BLUR_FRAGMENT_SHADER, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, THREE.Uniform>([
        ['uVelocity', new THREE.Uniform(0.0)],
        ['uDirection', new THREE.Uniform(new THREE.Vector2(0.0, 1.0))],
      ]),
    });
  }
}

const VelocityMotionBlur = wrapEffect(VelocityMotionBlurEffect);

interface AtmosphericPostProcessingProps {
  activeSectionIdx: number;
  scrollProgress: number;
  isMobile: boolean;
}

export function AtmosphericPostProcessing({
  activeSectionIdx,
  scrollProgress,
  isMobile,
}: AtmosphericPostProcessingProps) {
  const chromaticRef = useRef<ChromaticAberrationEffect>(null);
  const noiseRef = useRef<NoiseEffect>(null);
  const motionBlurRef = useRef<VelocityMotionBlurEffect>(null);

  const transitionIntensity = useRef<number>(0);
  const lastSectionRef = useRef<number>(activeSectionIdx);
  const lastScrollRef = useRef<number>(scrollProgress);
  const smoothVelocityRef = useRef<number>(0);

  const initialOffset = useMemo(
    () => new THREE.Vector2(isMobile ? 0.0005 : 0.0008, isMobile ? 0.0005 : 0.0008),
    [isMobile]
  );

  // Intensify post-processing surge and motion impulse whenever active section transitions
  useEffect(() => {
    if (lastSectionRef.current !== activeSectionIdx) {
      const direction = activeSectionIdx > lastSectionRef.current ? 1 : -1;
      lastSectionRef.current = activeSectionIdx;
      transitionIntensity.current = 1.0; // Trigger full transition surge
      // Inject directional velocity kick on section transition for punchy dynamism
      smoothVelocityRef.current = direction * (isMobile ? 0.016 : 0.024);
    }
  }, [activeSectionIdx, isMobile]);

  useFrame((_, delta) => {
    // Calculate instantaneous scroll velocity from change in scrollProgress over time
    const scrollDelta = scrollProgress - lastScrollRef.current;
    lastScrollRef.current = scrollProgress;

    // Instant velocity normalized by delta time
    const rawVelocity = delta > 0 ? scrollDelta / delta : 0;
    // Velocity magnitude scaling factor for subtle, cinematic motion blur
    const targetVelocity = rawVelocity * (isMobile ? 0.0007 : 0.0011);

    // Smoothly damp velocity so rapid scroll feels fluid and organic
    smoothVelocityRef.current = THREE.MathUtils.damp(
      smoothVelocityRef.current,
      targetVelocity,
      8.5,
      delta
    );

    // Update Motion Blur uniforms based on scroll velocity
    if (motionBlurRef.current) {
      const velUniform = motionBlurRef.current.uniforms.get('uVelocity');
      if (velUniform) {
        velUniform.value = smoothVelocityRef.current;
      }
      const dirUniform = motionBlurRef.current.uniforms.get('uDirection');
      if (dirUniform) {
        const dirY = smoothVelocityRef.current >= 0 ? 1.0 : -1.0;
        dirUniform.value.set(0.0, dirY);
      }
    }

    // Add subtle responsiveness to rapid scroll velocity for chromatic aberration
    const absVelocity = Math.abs(smoothVelocityRef.current);
    if (absVelocity > 0.003) {
      transitionIntensity.current = Math.min(
        1.0,
        transitionIntensity.current + absVelocity * 12.0
      );
    }

    // Smooth exponential decay of transition surge over ~1.1 seconds
    if (transitionIntensity.current > 0.001) {
      transitionIntensity.current = THREE.MathUtils.damp(
        transitionIntensity.current,
        0,
        2.8,
        delta
      );
    }

    const intensity = transitionIntensity.current;

    // Chromatic Aberration: base subtle lens fringe -> intensifies on rapid scroll / transition
    const baseOffset = isMobile ? 0.0004 : 0.0007;
    const surgeOffset = isMobile ? 0.0016 : 0.0028;
    const currentOffset = baseOffset + intensity * surgeOffset + absVelocity * 0.05;

    if (chromaticRef.current?.offset) {
      chromaticRef.current.offset.set(currentOffset, currentOffset);
    }

    // Film Grain / Noise: base subtle analog grain -> intensifies on transition
    if (noiseRef.current?.blendMode?.opacity) {
      const baseOpacity = isMobile ? 0.08 : 0.12;
      const surgeOpacity = isMobile ? 0.12 : 0.22;
      noiseRef.current.blendMode.opacity.value =
        baseOpacity + intensity * surgeOpacity;
    }
  });

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      {/* Scroll-velocity-scaled directional motion blur pass */}
      <VelocityMotionBlur ref={motionBlurRef} />
      <ChromaticAberration
        ref={chromaticRef}
        offset={initialOffset}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise
        ref={noiseRef}
        opacity={isMobile ? 0.08 : 0.12}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  );
}
