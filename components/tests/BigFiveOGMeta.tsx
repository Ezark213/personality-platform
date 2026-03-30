import Head from 'next/head';

/**
 * BigFive OGメタタグのプロパティ型定義
 */
export interface BigFiveOGMetaProps {
  /** 診断結果ID（OG画像APIで使用） */
  resultId: string;
  /** 性格タイプ名（例: "挑戦者"） */
  typeName: string;
  /** タイプの特徴を表すキャッチフレーズ */
  catchphrase: string;
  /** 共有時のURL（og:urlに設定） */
  url: string;
}

/**
 * OGメタタグのデータ構造
 */
export interface OGMetaTagsData {
  /** og:title - "あなたは{typeName}タイプ" */
  title: string;
  /** og:description - キャッチフレーズ */
  description: string;
  /** og:image - OG画像APIのURL */
  imageUrl: string;
  /** og:url - ページURL */
  url: string;
  /** twitter:card - カードタイプ */
  twitterCard: 'summary_large_image';
  /** twitter:image - Twitter用画像URL */
  twitterImage: string;
}

/**
 * OGメタタグのデータを生成するヘルパー関数
 *
 * Next.js App RouterのMetadata APIで使用可能：
 * ```ts
 * import { generateOGMetaTags } from '@/components/tests/BigFiveOGMeta';
 *
 * export async function generateMetadata(): Promise<Metadata> {
 *   const ogData = generateOGMetaTags({ resultId, typeName, catchphrase, url });
 *   return {
 *     title: ogData.title,
 *     description: ogData.description,
 *     openGraph: {
 *       images: [ogData.imageUrl],
 *     },
 *   };
 * }
 * ```
 *
 * @param props - OGメタタグ生成に必要なプロパティ
 * @returns OGメタタグのデータオブジェクト
 */
export function generateOGMetaTags({
  resultId,
  typeName,
  catchphrase,
  url,
}: BigFiveOGMetaProps): OGMetaTagsData {
  // OG画像URL（Day 2.5で実装されたカード画像API）
  const imageUrl = `/api/og/bigfive/card/${resultId}`;

  return {
    title: `あなたは${typeName}タイプ`,
    description: catchphrase,
    imageUrl,
    url,
    twitterCard: 'summary_large_image',
    twitterImage: imageUrl,
  };
}

/**
 * OGメタタグコンポーネント（Pages Router用）
 * App Routerでは generateOGMetaTags() を使用してMetadata APIで実装してください
 */
export default function BigFiveOGMeta(props: BigFiveOGMetaProps) {
  const meta = generateOGMetaTags(props);

  return (
    <Head>
      {/* Open Graph meta tags */}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.imageUrl} />
      <meta property="og:url" content={meta.url} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content={meta.twitterCard} />
      <meta name="twitter:image" content={meta.twitterImage} />
    </Head>
  );
}
