/**
 * OG Image Generation Test Endpoint
 *
 * Purpose: Test @vercel/og functionality
 * URL: http://localhost:3002/api/og/bigfive/test
 */

import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET() {
  try {
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
            fontSize: 60,
            fontWeight: 'bold',
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
            }}
          >
            <h1 style={{ margin: 0, color: '#1f2937' }}>
              @vercel/og
            </h1>
            <p style={{ margin: '20px 0 0 0', fontSize: 30, color: '#6b7280' }}>
              動作確認テスト
            </p>
            <p style={{ margin: '20px 0 0 0', fontSize: 24, color: '#9ca3af' }}>
              ✅ インストール成功
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG image generation error:', error)
    return new Response('Failed to generate test image', { status: 500 })
  }
}
