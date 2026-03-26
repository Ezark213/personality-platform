/**
 * OG Image Generation API for BigFive Test Results
 *
 * Size: 1200×630px (Twitter/Facebook OG standard)
 * URL: /api/og/bigfive/[resultId]
 *
 * This endpoint generates Open Graph images for BigFive personality test results.
 * Currently uses mock data; will integrate with database in Iteration-05.
 */

import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import type { BigFiveResult } from '@/types/bigfive'
import { classifyType } from '@/lib/tests/bigfive-type-classifier'
import { decodeResultData } from '@/lib/utils/result-storage'

export const runtime = 'edge'

/**
 * Generate OG image for a BigFive test result
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
            backgroundColor: '#f3f4f6',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '60px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              maxWidth: '1000px',
            }}
          >
            {/* Type Name */}
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                color: '#1f2937',
                textAlign: 'center',
              }}
            >
              {type.name}
            </h1>

            {/* Catchphrase */}
            <p
              style={{
                fontSize: '32px',
                color: '#6b7280',
                margin: '0 0 40px 0',
                textAlign: 'center',
              }}
            >
              「{type.catchphrase}」
            </p>

            {/* Strengths */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              {type.strengths.map((strength, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '28px',
                    color: '#374151',
                  }}
                >
                  <span style={{ marginRight: '12px', fontSize: '32px' }}>✅</span>
                  <span>{strength}</span>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p
              style={{
                marginTop: '40px',
                fontSize: '18px',
                color: '#9ca3af',
                textAlign: 'center',
              }}
            >
              ※これはあくまで傾向です。決めつけないでください。
            </p>
          </div>

          {/* Footer */}
          <p
            style={{
              marginTop: '30px',
              fontSize: '20px',
              color: '#9ca3af',
            }}
          >
            personality-platform.com
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG image generation error:', error)
    return new Response(
      `Failed to generate OG image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    )
  }
}
