import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely retrieves a localized string value.
 * Handles both new LocalizedString objects and legacy string values.
 */
export function getLocalizedValue(
  value: any,
  locale: string,
  fallback: string = ""
): string {
  if (!value) return fallback;

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    return value[locale] || value["en"] || fallback;
  }

  return fallback;
}

/**
 * Get a string key for today's date (YYYY-MM-DD format)
 */
export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}
