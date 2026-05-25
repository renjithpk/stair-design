import { createContext, useContext } from 'react';
import { type Transform } from '../utils/geometry';

export const TransformContext = createContext<Transform | null>(null);

export function useTransform(): Transform {
  const ctx = useContext(TransformContext);
  if (!ctx) throw new Error('useTransform must be used inside TransformContext.Provider');
  return ctx;
}
