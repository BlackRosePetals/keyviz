import { clsx, type ClassValue } from "clsx"
import { BezierDefinition } from "motion/react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const easeOutQuint: BezierDefinition = [0.23,1.00,0.32,1.00];
export const easeInQuint: BezierDefinition = [0.76,0.05,0.86,0.06];
export const easeInOutExpo: BezierDefinition = [0.86,0.00,0.07,1.00];

export const expressiveFastSpatial: BezierDefinition =	[0.42, 1.67, 0.21, 0.90];
export const expressiveDefaultSpatial: BezierDefinition =	[0.38, 1.21, 0.22, 1.00];
export const expressiveSlowSpatial: BezierDefinition =	[0.39, 1.29, 0.35, 0.98];
export const expressiveFastEffects: BezierDefinition =	[0.31, 0.94, 0.34, 1.00];
export const expressiveDefaultEffects: BezierDefinition =	[0.34, 0.80, 0.34, 1.00];
export const expressiveSlowEffects: BezierDefinition =	[0.34, 0.88, 0.34, 1.00];