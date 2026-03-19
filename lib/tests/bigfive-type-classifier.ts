/**
 * BigFive Type Classifier
 *
 * This module classifies BigFive test results into personality types.
 * Classification is based on the most prominent dimension (highest deviation from neutral).
 */

import type { BigFiveResult, BigFiveDimension } from '@/types/bigfive'
import type { BigFiveType } from '@/data/tests/bigfive-types'
import { bigFiveTypes } from '@/data/tests/bigfive-types'

/**
 * Priority order for tie-breaking when multiple dimensions have the same score
 * Based on psychological significance and reliability:
 * 1. Extraversion - Most observable and consistent trait
 * 2. Conscientiousness - Strong predictor of life outcomes
 * 3. Openness - Reflects cognitive style
 * 4. Agreeableness - Affects social interactions
 * 5. Neuroticism - Can be more variable
 */
const DIMENSION_PRIORITY: BigFiveDimension[] = [
  'extraversion',
  'conscientiousness',
  'openness',
  'agreeableness',
  'neuroticism'
]

/**
 * Calculate deviation from neutral (50) to determine prominence
 */
function calculateDeviation(normalizedScore: number): number {
  return Math.abs(normalizedScore - 50)
}

/**
 * Get the type ID based on dimension and level
 */
function getTypeId(dimension: BigFiveDimension, level: 'high' | 'neutral' | 'low'): string {
  return `${level}-${dimension}`
}

/**
 * Classify a BigFive test result into a personality type
 *
 * Algorithm:
 * 1. Calculate deviation from neutral (50) for each dimension
 * 2. Find the dimension with the highest deviation
 * 3. If tie, use priority order (extraversion > conscientiousness > openness > agreeableness > neuroticism)
 * 4. Return the corresponding type based on dimension and level
 *
 * @param result The BigFive test result
 * @returns The classified personality type
 */
export function classifyType(result: BigFiveResult): BigFiveType {
  const scores = result.scores

  // Calculate deviations for each dimension
  const deviations: Array<{
    dimension: BigFiveDimension
    deviation: number
    normalized: number
    level: 'high' | 'neutral' | 'low'
  }> = [
    {
      dimension: 'neuroticism',
      deviation: calculateDeviation(scores.neuroticism.normalized),
      normalized: scores.neuroticism.normalized,
      level: scores.neuroticism.level
    },
    {
      dimension: 'extraversion',
      deviation: calculateDeviation(scores.extraversion.normalized),
      normalized: scores.extraversion.normalized,
      level: scores.extraversion.level
    },
    {
      dimension: 'openness',
      deviation: calculateDeviation(scores.openness.normalized),
      normalized: scores.openness.normalized,
      level: scores.openness.level
    },
    {
      dimension: 'agreeableness',
      deviation: calculateDeviation(scores.agreeableness.normalized),
      normalized: scores.agreeableness.normalized,
      level: scores.agreeableness.level
    },
    {
      dimension: 'conscientiousness',
      deviation: calculateDeviation(scores.conscientiousness.normalized),
      normalized: scores.conscientiousness.normalized,
      level: scores.conscientiousness.level
    }
  ]

  // Sort by deviation (descending), then by priority
  deviations.sort((a, b) => {
    // First compare by deviation
    if (b.deviation !== a.deviation) {
      return b.deviation - a.deviation
    }
    // If tied, use priority order
    const priorityA = DIMENSION_PRIORITY.indexOf(a.dimension)
    const priorityB = DIMENSION_PRIORITY.indexOf(b.dimension)
    return priorityA - priorityB
  })

  // Get the primary dimension (highest deviation or highest priority if tied)
  const primaryDimension = deviations[0].dimension
  const level = deviations[0].level

  // Find the corresponding type
  const typeId = getTypeId(primaryDimension, level)
  const type = bigFiveTypes.find(t => t.id === typeId)

  if (!type) {
    throw new Error(`Type not found for ID: ${typeId}`)
  }

  return type
}

/**
 * Extract the three key strengths from a classified type
 *
 * @param result The BigFive test result
 * @returns Array of three strength descriptions
 */
export function extractStrengths(result: BigFiveResult): string[] {
  const type = classifyType(result)
  return type.strengths
}
