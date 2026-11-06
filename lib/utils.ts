import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

export function numeroDecimal(value: string) {
  const text = value.trim().replace(",", ".");
  return /^\d+(?:\.\d+)?$/.test(text) ? Number(text) : NaN;
}
