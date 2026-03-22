/**
 * OG Image Gradient Color Utilities
 *
 * This module provides utilities for generating gradient colors
 * for BigFive personality type cards.
 */

import type { BigFiveDimension } from '@/types/bigfive'

export interface GradientColors {
  from: string
  to: string
}

/**
 * Color scheme for each dimension and level
 */
const DIMENSION_COLORS: Record<
  BigFiveDimension,
  { high: string; neutral: string; low: string }
> = {
  neuroticism: {
    high: '#fbbf24', // Warm yellow (感受性)
    neutral: '#a3a3a3', // Neutral gray
    low: '#60a5fa', // Cool blue (楽観)
  },
  extraversion: {
    high: '#f97316', // Vibrant orange (社交的)
    neutral: '#a3a3a3',
    low: '#8b5cf6', // Purple (内省的)
  },
  openness: {
    high: '#ec4899', // Pink (創造的)
    neutral: '#a3a3a3',
    low: '#10b981', // Green (実践的)
  },
  agreeableness: {
    high: '#06b6d4', // Cyan (調和)
    neutral: '#a3a3a3',
    low: '#ef4444', // Red (率直)
  },
  conscientiousness: {
    high: '#3b82f6', // Blue (計画的)
    neutral: '#a3a3a3',
    low: '#f59e0b', // Amber (即興的)
  },
}

/**
 * Calculate darker version of a hex color
 *
 * @param hexColor - Hex color string (e.g. '#f97316')
 * @param amount - Amount to darken (default 40)
 * @returns Darker hex color
 */
export function darkenHexColor(hexColor: string, amount: number = 40): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')

  // Parse RGB components
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Darken each component
  const darkR = Math.max(0, Math.round(r - amount))
  const darkG = Math.max(0, Math.round(g - amount))
  const darkB = Math.max(0, Math.round(b - amount))

  // Convert back to hex (lowercase)
  const darkHex =
    '#' +
    darkR.toString(16).padStart(2, '0') +
    darkG.toString(16).padStart(2, '0') +
    darkB.toString(16).padStart(2, '0')

  return darkHex
}

/**
 * Get gradient colors for a specific dimension and level
 *
 * @param dimension - BigFive dimension
 * @param level - Level of the dimension (high/neutral/low)
 * @returns Gradient colors (from and to)
 */
export function getGradientColors(
  dimension: BigFiveDimension,
  level: 'high' | 'neutral' | 'low'
): GradientColors {
  const primaryColor = DIMENSION_COLORS[dimension][level]
  const darkerColor = darkenHexColor(primaryColor, 40)

  return {
    from: darkerColor,
    to: primaryColor,
  }
}

/**
 * Get CSS linear-gradient string
 *
 * @param dimension - BigFive dimension
 * @param level - Level of the dimension
 * @param angle - Gradient angle in degrees (default 135)
 * @returns CSS linear-gradient string
 */
export function getCSSGradient(
  dimension: BigFiveDimension,
  level: 'high' | 'neutral' | 'low',
  angle: number = 135
): string {
  const { from, to } = getGradientColors(dimension, level)
  return `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`
}

/**
 * Get all available colors for a dimension
 *
 * @param dimension - BigFive dimension
 * @returns Object containing high, neutral, and low colors
 */
export function getDimensionColors(dimension: BigFiveDimension) {
  return DIMENSION_COLORS[dimension]
}

/**
 * Validate if a hex color is valid
 *
 * @param hexColor - Hex color string
 * @returns true if valid, false otherwise
 */
export function isValidHexColor(hexColor: string): boolean {
  const hexRegex = /^#[0-9A-Fa-f]{6}$/
  return hexRegex.test(hexColor)
}
