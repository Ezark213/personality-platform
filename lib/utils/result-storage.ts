/**
 * Result Storage Utilities
 *
 * This module provides URL parameter-based storage for BigFive test results.
 * Uses Base64 encoding for stateless, database-free result persistence.
 */

import type { BigFiveAnswer, BigFiveResult } from '@/types/bigfive'

/**
 * Result data structure for URL encoding
 */
export interface ResultData {
  id: string
  result: BigFiveResult
  answers: BigFiveAnswer[]
}

/**
 * Generate a unique result ID using UUID v4
 */
export function generateResultId(): string {
  return crypto.randomUUID()
}

/**
 * Encode result data to URL-safe Base64 string
 *
 * @param data The result data to encode
 * @returns URL-safe Base64 encoded string
 */
export function encodeResultData(data: ResultData): string {
  // Prepare data with serializable dates
  const serializable = {
    ...data,
    result: {
      ...data.result,
      completedAt: data.result.completedAt.toISOString()
    }
  }

  // Convert to JSON string
  const jsonString = JSON.stringify(serializable)

  // Base64 encode
  const base64 = btoa(jsonString)

  // Make URL-safe by replacing characters
  const urlSafe = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '') // Remove trailing equals

  return urlSafe
}

/**
 * Decode URL-safe Base64 string back to result data
 *
 * @param encoded The encoded string from URL parameter
 * @returns Decoded result data
 * @throws Error if decoding fails or data is invalid
 */
export function decodeResultData(encoded: string): ResultData {
  try {
    // Restore Base64 from URL-safe format
    let base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    // Add padding if needed
    while (base64.length % 4 !== 0) {
      base64 += '='
    }

    // Decode Base64
    const jsonString = atob(base64)

    // Parse JSON
    const parsed = JSON.parse(jsonString)

    // Validate structure
    if (!parsed.id || !parsed.result || !parsed.answers) {
      throw new Error('Invalid data structure')
    }

    // Restore Date object
    const resultData: ResultData = {
      ...parsed,
      result: {
        ...parsed.result,
        completedAt: new Date(parsed.result.completedAt)
      }
    }

    return resultData
  } catch (error) {
    throw new Error(`Failed to decode result data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validate if a string is a valid encoded result data
 *
 * @param encoded The string to validate
 * @returns true if valid, false otherwise
 */
export function isValidEncodedData(encoded: string): boolean {
  try {
    decodeResultData(encoded)
    return true
  } catch {
    return false
  }
}

/**
 * Create a result page URL with encoded data
 *
 * @param data The result data to include in URL
 * @param baseUrl Optional base URL (defaults to /tests/bigfive/result)
 * @returns Complete URL with query parameters
 */
export function createResultUrl(data: ResultData, baseUrl?: string): string {
  const base = baseUrl || '/tests/bigfive/result'
  const encoded = encodeResultData(data)

  return `${base}?id=${data.id}&data=${encoded}`
}
