'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { SeasonId } from '@/types/portfolio';

export interface MagneticTargetData {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  seasonId?: SeasonId;
}

interface CustomCursorContextType {
  magneticTarget: MagneticTargetData | null;
  setMagneticTarget: (target: MagneticTargetData | null) => void;
  cursorVariant: 'default' | 'card-magnetic' | 'button-magnetic';
  setCursorVariant: (variant: 'default' | 'card-magnetic' | 'button-magnetic') => void;
}

const CustomCursorContext = createContext<CustomCursorContextType>({
  magneticTarget: null,
  setMagneticTarget: () => {},
  cursorVariant: 'default',
  setCursorVariant: () => {},
});

export function CustomCursorProvider({ children }: { children: React.ReactNode }) {
  const [magneticTarget, setTarget] = useState<MagneticTargetData | null>(null);
  const [cursorVariant, setVariant] = useState<'default' | 'card-magnetic' | 'button-magnetic'>('default');

  const setMagneticTarget = useCallback((target: MagneticTargetData | null) => {
    setTarget(target);
    if (target) {
      setVariant('card-magnetic');
    } else {
      setVariant('default');
    }
  }, []);

  const setCursorVariant = useCallback((variant: 'default' | 'card-magnetic' | 'button-magnetic') => {
    setVariant(variant);
  }, []);

  const value = useMemo(
    () => ({
      magneticTarget,
      setMagneticTarget,
      cursorVariant,
      setCursorVariant,
    }),
    [magneticTarget, setMagneticTarget, cursorVariant, setCursorVariant]
  );

  return (
    <CustomCursorContext.Provider value={value}>
      {children}
    </CustomCursorContext.Provider>
  );
}

export function useCustomCursor() {
  return useContext(CustomCursorContext);
}
