import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mouseEventToRange(e: MouseEvent, el: HTMLElement, min: number, max: number): number {
  const rect = el.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  return min + (x / rect.width) * (max - min);
}

export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

const REGEX_PATTERN = /^\/(.+)\/(.*)$/;

export function parseRegex(str: string): RegExp | null {
  const match = str.match(REGEX_PATTERN);
  if (!match) return null;

  return new RegExp(match[1], match[2]);
}
