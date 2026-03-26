import type { AptitudeType, WorkRoleDimension } from '@/types/aptitude';

/**
 * Aptitude Type Definitions
 *
 * 適性検査の結果タイプ定義（12タイプ）
 * 各次元3レベル（high/neutral/low）× 4次元
 */
export const aptitudeTypes: AptitudeType[] = [
  // ============================================================================
  // Leadership (リーダーシップ)
  // ============================================================================
  {
    id: 'high-leadership',
    name: '天性のリーダー',
    catchphrase: 'チームを導く力',
    strengths: [
      '強いリーダーシップ',
      '決断力と実行力',
      '人を動かす影響力'
    ],
    description: 'チームをまとめ、目標に向かって導く力に優れたタイプ。意思決定が早く、責任感が強い。人前で話すことも得意で、組織の中心的存在として活躍できる。',
    suitableRoles: [
      'プロジェクトマネージャー',
      '部門長・チームリーダー',
      '経営企画',
      '営業マネージャー'
    ],
    advice: [
      'メンバーの意見にも耳を傾けましょう',
      '完璧主義になりすぎないように',
      '部下の成長を支援することも大切'
    ],
    primaryDimension: 'leadership',
    level: 'high'
  },
  {
    id: 'neutral-leadership',
    name: 'バランス型のリーダー',
    catchphrase: '状況に応じたリーダーシップ',
    strengths: [
      '柔軟なリーダーシップ',
      '協調性とのバランス',
      '適応的な判断力'
    ],
    description: '必要な時にはリーダーシップを発揮できるが、状況に応じてメンバーの一人としても動けるタイプ。協調性も持ち合わせ、チームワークを大切にできる。',
    suitableRoles: [
      'サブリーダー',
      'プロジェクトリーダー',
      '中間管理職',
      'スクラムマスター'
    ],
    advice: [
      'リーダーシップを発揮する場面を見極めて',
      '自信を持って前に出ることも必要',
      'チームの調整役として強みを活かして'
    ],
    primaryDimension: 'leadership',
    level: 'neutral'
  },
  {
    id: 'low-leadership',
    name: '専門性を活かすプロフェッショナル',
    catchphrase: '個の力で貢献',
    strengths: [
      '専門性の追求',
      '独立した業務遂行',
      '集中力'
    ],
    description: 'リーダーよりも専門家として力を発揮するタイプ。自分の専門分野で深い知識を持ち、独立して高品質な仕事を遂行できる。',
    suitableRoles: [
      'スペシャリスト',
      'エンジニア',
      '研究職',
      'デザイナー'
    ],
    advice: [
      '時には意見を主張することも大切',
      'チーム内での役割を明確に',
      '専門性を磨き続けましょう'
    ],
    primaryDimension: 'leadership',
    level: 'low'
  },

  // ============================================================================
  // Analytical (分析的)
  // ============================================================================
  {
    id: 'high-analytical',
    name: '論理的な分析家',
    catchphrase: 'データで真実を見抜く',
    strengths: [
      '高い分析力',
      '論理的思考',
      '問題解決能力'
    ],
    description: 'データや数字を扱うことが得意で、論理的に物事を考えるタイプ。問題の本質を見抜き、体系的なアプローチで解決策を導き出せる。',
    suitableRoles: [
      'データアナリスト',
      'コンサルタント',
      '経営企画',
      '品質管理'
    ],
    advice: [
      '直感も時には重要です',
      '完璧を求めすぎないように',
      '人間的な側面も考慮しましょう'
    ],
    primaryDimension: 'analytical',
    level: 'high'
  },
  {
    id: 'neutral-analytical',
    name: '実践的な問題解決者',
    catchphrase: '分析と行動の両立',
    strengths: [
      'バランスの取れた判断',
      '実用的な分析',
      '柔軟な思考'
    ],
    description: '分析力も持ちながら、実践的に物事を進められるタイプ。完璧な分析にこだわりすぎず、適切なタイミングで行動に移せる。',
    suitableRoles: [
      'プロジェクトマネージャー',
      'プロダクトマネージャー',
      'ビジネスアナリスト',
      'システムエンジニア'
    ],
    advice: [
      '分析と実行のバランスを保ちましょう',
      '時には深い分析も必要',
      'データに基づいた判断を心がけて'
    ],
    primaryDimension: 'analytical',
    level: 'neutral'
  },
  {
    id: 'low-analytical',
    name: '直感的な行動家',
    catchphrase: '感覚で動く',
    strengths: [
      '素早い行動力',
      '柔軟な対応',
      '直感的な判断'
    ],
    description: '細かい分析よりも、直感や経験に基づいて素早く行動するタイプ。状況に応じて柔軟に対応でき、スピード感を持って仕事を進められる。',
    suitableRoles: [
      '営業',
      '接客・サービス',
      'イベントプランナー',
      '起業家'
    ],
    advice: [
      '時にはデータを確認することも大切',
      '計画性も意識しましょう',
      'リスク分析も忘れずに'
    ],
    primaryDimension: 'analytical',
    level: 'low'
  },

  // ============================================================================
  // Creative (創造的)
  // ============================================================================
  {
    id: 'high-creative',
    name: '革新的なクリエイター',
    catchphrase: '新しい価値を生み出す',
    strengths: [
      '高い創造性',
      '革新的な発想',
      '柔軟な思考'
    ],
    description: '新しいアイデアを生み出すことが得意で、既存の枠にとらわれない発想ができるタイプ。創造的な活動を楽しみ、革新的な解決策を見出せる。',
    suitableRoles: [
      'デザイナー',
      '企画職',
      'クリエイティブディレクター',
      '商品開発'
    ],
    advice: [
      '実現可能性も考慮しましょう',
      'アイデアを形にする力も大切',
      '他者の意見も取り入れて'
    ],
    primaryDimension: 'creative',
    level: 'high'
  },
  {
    id: 'neutral-creative',
    name: '実用的なイノベーター',
    catchphrase: '創造性を形にする',
    strengths: [
      '実用的な創造性',
      'バランスの取れた発想',
      '実現力'
    ],
    description: '創造性と実用性のバランスが取れたタイプ。新しいアイデアを生み出しながら、それを実現可能な形に落とし込める。',
    suitableRoles: [
      'プロダクトデザイナー',
      'UXデザイナー',
      '企画職',
      'マーケター'
    ],
    advice: [
      '時には大胆な発想も必要',
      '創造性を磨き続けましょう',
      '実現性とのバランスを保って'
    ],
    primaryDimension: 'creative',
    level: 'neutral'
  },
  {
    id: 'low-creative',
    name: '堅実な実行者',
    catchphrase: '確実に形にする',
    strengths: [
      '確実な実行力',
      '実用的なアプローチ',
      '安定した成果'
    ],
    description: '既存の方法を確実に実行することが得意なタイプ。新しいアイデアよりも、実証済みの方法で着実に成果を出すことを好む。',
    suitableRoles: [
      '事務職',
      '経理・財務',
      '品質管理',
      'オペレーション'
    ],
    advice: [
      '時には新しい方法も試してみて',
      '改善提案も価値があります',
      '柔軟性も少し意識しましょう'
    ],
    primaryDimension: 'creative',
    level: 'low'
  },

  // ============================================================================
  // Collaborative (協調的)
  // ============================================================================
  {
    id: 'high-collaborative',
    name: 'チームの調和者',
    catchphrase: '協力で成果を生む',
    strengths: [
      '高い協調性',
      'コミュニケーション力',
      'サポート力'
    ],
    description: 'チームワークを大切にし、メンバー間の協力を促進するタイプ。他者の意見を尊重し、円滑な人間関係を築くことが得意。',
    suitableRoles: [
      '人事',
      'チームコーディネーター',
      'カスタマーサポート',
      'プロジェクト管理'
    ],
    advice: [
      '自分の意見も大切にしましょう',
      '時には主張することも必要',
      'Noと言う勇気も持って'
    ],
    primaryDimension: 'collaborative',
    level: 'high'
  },
  {
    id: 'neutral-collaborative',
    name: 'バランス型の協力者',
    catchphrase: '協調と自立の両立',
    strengths: [
      '適度な協調性',
      '自立性とのバランス',
      '柔軟な対応'
    ],
    description: '協調性も持ちながら、必要な時には独立して動けるタイプ。チームワークも大切にしつつ、自分の意見もしっかり主張できる。',
    suitableRoles: [
      '多くの職種に適応可能',
      'プロジェクトメンバー',
      '営業',
      'エンジニア'
    ],
    advice: [
      '状況に応じて協調と自立を使い分けて',
      'チームの一員としての役割を意識',
      '自分の強みを活かしましょう'
    ],
    primaryDimension: 'collaborative',
    level: 'neutral'
  },
  {
    id: 'low-collaborative',
    name: '独立した専門家',
    catchphrase: '個の力を極める',
    strengths: [
      '高い独立性',
      '専門性の追求',
      '集中力'
    ],
    description: 'チームよりも個人で働くことを好むタイプ。自分のペースで仕事を進め、専門分野で深い知識と技術を身につけることができる。',
    suitableRoles: [
      'フリーランス',
      '研究職',
      'スペシャリスト',
      'クリエイター'
    ],
    advice: [
      '必要な時は協力を求めましょう',
      'コミュニケーションも大切に',
      '他者の視点も取り入れて'
    ],
    primaryDimension: 'collaborative',
    level: 'low'
  }
];

/**
 * Helper function to get a type by ID
 */
export function getTypeById(id: string): AptitudeType | undefined {
  return aptitudeTypes.find(type => type.id === id);
}

/**
 * Helper function to get all types for a specific dimension
 */
export function getTypesByDimension(dimension: WorkRoleDimension): AptitudeType[] {
  return aptitudeTypes.filter(type => type.primaryDimension === dimension);
}
