import { clsx, type ClassValue } from "clsx"
import { BezierDefinition } from "motion/react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const easeOutQuint: BezierDefinition = [0.23,1.00,0.32,1.00];
export const easeInQuint: BezierDefinition = [0.76,0.05,0.86,0.06];
export const easeInOutExpo: BezierDefinition = [0.86,0.00,0.07,1.00];