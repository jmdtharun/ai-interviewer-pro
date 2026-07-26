import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 85) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (score >= 70) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
  if (score >= 55) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-rose-500/10 text-rose-400 border-rose-500/20";
}
