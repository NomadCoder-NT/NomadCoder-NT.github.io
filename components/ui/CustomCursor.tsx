'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useCustomCursor } from './CustomCursorContext';
import { useIsMobile } from '@/hooks/use-mobile';

export function CustomCursor() {
  const { magneticTarget, cursorVariant } = useCustomCursor();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse coordinates
  const rawMouseX = useMotionValue(-100);
  const rawMouseY = useMotionValue(-100);

  // Effective coordinates incorporating magnetic pull
  const effectiveX = useMotionValue(-100);
  const effectiveY = useMotionValue(-100);

  // Smooth springs for high-fidelity physics
  const springConfig = { damping: 28, stiffness: 320, mass: 0.5 };
  const smoothX = useSpring(effectiveX, springConfig);
  const smoothY = useSpring(effectiveY, springConfig);

  // Dot spring (faster response)
  const dotSpringConfig = { damping: 35, stiffness: 500, mass: 0.2 };
  const smoothDotX = useSpring(rawMouseX, dotSpringConfig);
  const smoothDotY = useSpring(rawMouseY, dotSpringConfig);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawMouseX.set(e.clientX);
      rawMouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      if (magneticTarget) {
        // Apply magnetic attraction towards the center of the card
        const pullStrength = 0.28; // 28% magnetic pull towards center
        const targetCenterX = magneticTarget.centerX;
        const targetCenterY = magneticTarget.centerY;

        const pulledX = e.clientX + (targetCenterX - e.clientX) * pullStrength;
        const pulledY = e.clientY + (targetCenterY - e.clientY) * pullStrength;

        effectiveX.set(pulledX);
        effectiveY.set(pulledY);
      } else {
        effectiveX.set(e.clientX);
        effectiveY.set(e.clientY);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile, isVisible, magneticTarget, rawMouseX, rawMouseY, effectiveX, effectiveY]);

  if (isMobile || !isVisible) return null;

  const isMagnetic = cursorVariant === 'card-magnetic' && !!magneticTarget;
  const season = magneticTarget?.seasonId || 'summer';

  // Seasonal color styling
  const seasonRingStyles = {
    summer: 'border-amber-400/60 bg-amber-400/10 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    monsoon: 'border-sky-400/60 bg-sky-400/10 shadow-[0_0_20px_rgba(56,189,248,0.25)]',
    autumn: 'border-yellow-400/60 bg-yellow-400/10 shadow-[0_0_20px_rgba(234,179,8,0.25)]',
    spring: 'border-emerald-400/60 bg-emerald-400/10 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
  }[season];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Outer Magnetic Ring / Expanded Glow */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isMagnetic ? 64 : 26,
          height: isMagnetic ? 64 : 26,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 280,
        }}
        className={`rounded-full border backdrop-blur-[1px] transition-colors duration-300 ${
          isMagnetic
            ? seasonRingStyles
            : 'border-white/30 bg-white/5'
        }`}
      />

      {/* Center Tactile Dot */}
      <motion.div
        style={{
          x: smoothDotX,
          y: smoothDotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isMagnetic ? 1.4 : 1,
          backgroundColor: isMagnetic
            ? season === 'summer'
              ? '#f59e0b'
              : season === 'monsoon'
              ? '#38bdf8'
              : season === 'autumn'
              ? '#eab308'
              : '#10b981'
            : '#ffffff',
        }}
        transition={{ duration: 0.2 }}
        className="w-1.5 h-1.5 rounded-full shadow-sm"
      />
    </div>
  );
}
