/**
 * 1:1 Square Card Generation API for BigFive Test Results
 *
 * Size: 1080×1080px (Instagram optimized)
 * URL: /api/og/bigfive/card/[resultId]
 *
 * Features:
 * - Square format for Instagram posts
 * - Type-specific gradient backgrounds
 * - Visual hierarchy for sharing
 */

import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import type { BigFiveResult, BigFiveDimension } from '@/types/bigfive'
import { classifyType } from '@/lib/tests/bigfive-type-classifier'
import { decodeResultData } from '@/lib/utils/result-storage'

export const runtime = 'edge'

/**
 * Get gradient colors for each dimension
 */
function getGradientColors(dimension: BigFiveDimension, level: 'high' | 'neutral' | 'low'): {
  from: string
  to: string
} {
  // Color scheme based on dimension and level
  const colors: Record<BigFiveDimension, { high: string; neutral: string; low: string }> = {
    neuroticism: {
      high: '#fbbf24', // Warm yellow (感受性)
      neutral: '#a3a3a3', // Neutral gray
      low: '#60a5fa' // Cool blue (楽観)
    },
    extraversion: {
      high: '#f97316', // Vibrant orange (社交的)
      neutral: '#a3a3a3',
      low: '#8b5cf6' // Purple (内省的)
    },
    openness: {
      high: '#ec4899', // Pink (創造的)
      neutral: '#a3a3a3',
      low: '#10b981' // Green (実践的)
    },
    agreeableness: {
      high: '#06b6d4', // Cyan (調和)
      neutral: '#a3a3a3',
      low: '#ef4444' // Red (率直)
    },
    conscientiousness: {
      high: '#3b82f6', // Blue (計画的)
      neutral: '#a3a3a3',
      low: '#f59e0b' // Amber (即興的)
    }
  }

  const primaryColor = colors[dimension][level]
  // Create gradient: darker version → primary color
  const darkerPrimary = primaryColor.replace(/[0-9a-f]{2}$/, (match) =>
    Math.max(0, parseInt(match, 16) - 40)
      .toString(16)
      .padStart(2, '0')
  )

  return { from: darkerPrimary, to: primaryColor }
}

/**
 * Generate 1:1 square card image for a BigFive test result
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resultId: string }> }
) {
  try {
    const { resultId } = await params
    const { searchParams } = new URL(request.url)
    const encodedData = searchParams.get('data')

    // Validate data parameter
    if (!encodedData) {
      return new Response('Missing result data parameter', { status: 400 })
    }

    // Decode result data from URL parameter
    let result: BigFiveResult
    try {
      const decoded = decodeResultData(encodedData)
      result = decoded.result
    } catch (error) {
      return new Response(
        `Invalid result data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { status: 400 }
      )
    }

    // Classify the result into a personality type
    const type = classifyType(result)

    // Get gradient colors based on type
    const gradient = getGradientColors(type.primaryDimension, type.level)

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
            padding: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '30px',
              padding: '80px 60px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              width: '100%',
              maxWidth: '900px',
            }}
          >
            {/* Type Name */}
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                margin: '0 0 30px 0',
                color: '#1f2937',
                textAlign: 'center',
                lineHeight: '1.2',
              }}
            >
              {type.name}
            </h1>

            {/* Catchphrase */}
            <p
              style={{
                fontSize: '36px',
                color: '#6b7280',
                margin: '0 0 60px 0',
                textAlign: 'center',
              }}
            >
              「{type.catchphrase}」
            </p>

            {/* Strengths */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                width: '100%',
              }}
            >
              {type.strengths.map((strength, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '32px',
                    color: '#374151',
                    padding: '12px 0',
                  }}
                >
                  <span style={{ marginRight: '16px', fontSize: '40px' }}>✅</span>
                  <span>{strength}</span>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p
              style={{
                marginTop: '60px',
                fontSize: '20px',
                color: '#9ca3af',
                textAlign: 'center',
              }}
            >
              ※これはあくまで傾向です
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '40px',
              fontSize: '24px',
              color: 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ marginRight: '12px', fontSize: '28px' }}>🧠</span>
            <span>personality-platform.com</span>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
      }
    )
  } catch (error) {
    console.error('Card image generation error:', error)
    return new Response(
      `Failed to generate card image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    )
  }
}
