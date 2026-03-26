import type { Metadata } from 'next'
import { decodeResultData } from '@/lib/utils/result-storage'
import { classifyType } from '@/lib/tests/bigfive-type-classifier'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; data?: string }> | { id?: string; data?: string }
}): Promise<Metadata> {
  // Handle both Promise and non-Promise searchParams
  const params = searchParams instanceof Promise ? await searchParams : searchParams

  // Default metadata if no data provided
  if (!params || !params.data || !params.id) {
    return {
      title: 'BigFive性格診断 結果',
      description: 'あなたの性格特性を詳しく分析します',
      openGraph: {
        title: 'BigFive性格診断',
        description: 'あなたの性格特性を詳しく分析します',
        images: [
          {
            url: '/api/og/bigfive/default',
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'BigFive性格診断',
        description: 'あなたの性格特性を詳しく分析します',
      },
    }
  }

  try {
    // Decode result data
    const resultData = decodeResultData(params.data)
    const type = classifyType(resultData.result)

    // Generate OG image URL with data parameter
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const ogImageUrl = `${baseUrl}/api/og/bigfive/${params.id}?data=${params.data}`

    return {
      title: `私は「${type.name}」タイプでした！ | BigFive性格診断`,
      description: `${type.catchphrase} - ${type.strengths.join('、')}`,
      openGraph: {
        title: `私は「${type.name}」タイプでした！`,
        description: `${type.catchphrase}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `私は「${type.name}」タイプでした！`,
        description: `${type.catchphrase}`,
        images: [ogImageUrl],
      },
    }
  } catch (error) {
    // Fallback to default metadata on error
    console.error('Failed to generate metadata:', error)
    return {
      title: 'BigFive性格診断 結果',
      description: 'あなたの性格特性を詳しく分析します',
    }
  }
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
