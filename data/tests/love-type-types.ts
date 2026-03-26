import type { LoveType, LoveStyleDimension } from '@/types/love-type';

/**
 * Love Type Definitions
 *
 * 恋愛タイプの定義（12タイプ）
 * 各次元3レベル（high/neutral/low）× 4次元
 */
export const loveTypes: LoveType[] = [
  // ============================================================================
  // Romantic (ロマンティック)
  // ============================================================================
  {
    id: 'high-romantic',
    name: '夢見るロマンチスト',
    catchphrase: '愛を形にする',
    strengths: [
      'ロマンチックな演出力',
      '豊かな愛情表現',
      '記念日を大切にする'
    ],
    description: '理想の恋愛を追い求め、パートナーに愛情を惜しみなく表現するタイプ。サプライズや記念日を大切にし、二人の関係を特別なものにしようとする。',
    advice: [
      '相手の愛情表現スタイルも尊重しましょう',
      '現実とのバランスも大切にしましょう',
      '小さな日常の幸せも見逃さないように'
    ],
    primaryDimension: 'romantic',
    level: 'high'
  },
  {
    id: 'neutral-romantic',
    name: '程よいロマンチスト',
    catchphrase: '特別な日を大切に',
    strengths: [
      '状況に応じた愛情表現',
      'バランスの取れた関係性',
      '柔軟な対応力'
    ],
    description: '必要な時にはロマンチックな演出もできるが、日常は自然体で過ごせるタイプ。記念日などの特別な日は大切にしつつ、普段は肩肘張らない関係を築ける。',
    advice: [
      '時には思い切った演出も楽しんで',
      '日常の小さな幸せを共有しましょう',
      '相手のペースも大切にしましょう'
    ],
    primaryDimension: 'romantic',
    level: 'neutral'
  },
  {
    id: 'low-romantic',
    name: '現実派の愛情家',
    catchphrase: '形より心',
    strengths: [
      '飾らない愛情表現',
      '安定した関係性',
      '現実的な視点'
    ],
    description: '派手な演出よりも、日々の積み重ねを大切にするタイプ。形式的なことにこだわらず、本質的な信頼関係を築くことを重視する。',
    advice: [
      '時には特別な演出も喜ばれます',
      '言葉での愛情表現も大切に',
      '記念日は相手にとっても意味があるかも'
    ],
    primaryDimension: 'romantic',
    level: 'low'
  },

  // ============================================================================
  // Practical (実用的)
  // ============================================================================
  {
    id: 'high-practical',
    name: '現実的なパートナー',
    catchphrase: '将来を見据えて',
    strengths: [
      '現実的な判断力',
      '長期的な視点',
      '堅実な関係構築'
    ],
    description: '恋愛においても現実的な視点を持ち、将来のことを考えて行動するタイプ。価値観の一致や生活の相性を重視し、安定した関係を築こうとする。',
    advice: [
      '感情的な部分も大切にしましょう',
      '今この瞬間を楽しむことも忘れずに',
      '完璧を求めすぎないように注意'
    ],
    primaryDimension: 'practical',
    level: 'high'
  },
  {
    id: 'neutral-practical',
    name: 'バランス型の恋愛家',
    catchphrase: '感情と理性の両立',
    strengths: [
      '柔軟な判断力',
      'バランス感覚',
      '適応的な関係性'
    ],
    description: '感情と理性のバランスを取りながら恋愛を楽しめるタイプ。現実的な視点も持ちつつ、感情的なつながりも大切にできる。',
    advice: [
      '直感を信じることも大切',
      '計画通りにいかないことも楽しんで',
      '相手の価値観を尊重しましょう'
    ],
    primaryDimension: 'practical',
    level: 'neutral'
  },
  {
    id: 'low-practical',
    name: '感情優先の自由人',
    catchphrase: '心のままに',
    strengths: [
      '感情に素直',
      '自由な恋愛観',
      '柔軟な関係性'
    ],
    description: '条件や計算よりも、心の動きを大切にするタイプ。現実的な制約にとらわれず、感情の赴くままに恋愛を楽しめる。',
    advice: [
      '将来のことも少し考えてみましょう',
      '現実的な課題から目を背けないように',
      '相手の不安にも寄り添いましょう'
    ],
    primaryDimension: 'practical',
    level: 'low'
  },

  // ============================================================================
  // Passionate (情熱的)
  // ============================================================================
  {
    id: 'high-passionate',
    name: '燃えるような情熱家',
    catchphrase: '愛に全力で',
    strengths: [
      '強い感情表現',
      '積極的なアプローチ',
      '関係への献身'
    ],
    description: '恋愛において強い情熱を持ち、感情を素直に表現するタイプ。スキンシップや愛情表現を大切にし、関係に全力で向き合う。',
    advice: [
      '相手のペースも尊重しましょう',
      '冷静な判断も時には必要',
      '感情の波をコントロールすることも大切'
    ],
    primaryDimension: 'passionate',
    level: 'high'
  },
  {
    id: 'neutral-passionate',
    name: '程よい情熱家',
    catchphrase: '心地よい熱量で',
    strengths: [
      'バランスの取れた愛情表現',
      '状況に応じた対応',
      '安定した感情'
    ],
    description: '情熱的な面も持ちながら、適度な距離感も保てるタイプ。状況に応じて熱量を調整でき、相手を圧倒することなく愛情を表現できる。',
    advice: [
      '時には思い切った行動も',
      '感情を抑えすぎないように',
      '相手の温度感に合わせましょう'
    ],
    primaryDimension: 'passionate',
    level: 'neutral'
  },
  {
    id: 'low-passionate',
    name: '穏やかな愛情家',
    catchphrase: '静かに深く',
    strengths: [
      '落ち着いた関係性',
      '安定した感情',
      '長期的な視点'
    ],
    description: '激しい感情よりも、穏やかで安定した関係を好むタイプ。ゆっくりと時間をかけて関係を深め、持続的な愛情を育むことができる。',
    advice: [
      '時には感情を表に出すことも大切',
      '相手は愛情表現を求めているかも',
      'スキンシップも関係を深めます'
    ],
    primaryDimension: 'passionate',
    level: 'low'
  },

  // ============================================================================
  // Companionate (友情的)
  // ============================================================================
  {
    id: 'high-companionate',
    name: '親友のような恋人',
    catchphrase: '一番の理解者',
    strengths: [
      '深い信頼関係',
      '居心地の良さ',
      '共通の趣味・興味'
    ],
    description: 'パートナーを人生の親友のように考え、信頼と理解に基づいた関係を築くタイプ。一緒にいて楽で、お互いを深く理解し合える関係を大切にする。',
    advice: [
      'ロマンスの要素も取り入れて',
      '友達以上の特別さも意識しましょう',
      '時には新鮮な刺激も必要'
    ],
    primaryDimension: 'companionate',
    level: 'high'
  },
  {
    id: 'neutral-companionate',
    name: 'バランス型のパートナー',
    catchphrase: '友情と恋愛の調和',
    strengths: [
      '多面的な関係性',
      '柔軟なコミュニケーション',
      '安定と刺激の両立'
    ],
    description: '友達のような気楽さと、恋人としての特別さを両立できるタイプ。状況に応じて関係性の色を変えられ、長く続く関係を築ける。',
    advice: [
      '両方の良さを活かしましょう',
      'マンネリには注意',
      '相手のニーズに敏感に'
    ],
    primaryDimension: 'companionate',
    level: 'neutral'
  },
  {
    id: 'low-companionate',
    name: '恋人らしい恋人',
    catchphrase: '特別な存在として',
    strengths: [
      '明確な恋愛関係',
      'ロマンチックな関係性',
      '特別視する姿勢'
    ],
    description: '友達とは明確に区別された、特別な恋人関係を求めるタイプ。パートナーを唯一無二の存在として扱い、ロマンチックな関係を築くことを好む。',
    advice: [
      '友達のような気楽さも大切',
      '肩肘張りすぎないように',
      '日常を共有することも関係を深めます'
    ],
    primaryDimension: 'companionate',
    level: 'low'
  }
];

/**
 * Helper function to get a type by ID
 */
export function getTypeById(id: string): LoveType | undefined {
  return loveTypes.find(type => type.id === id);
}

/**
 * Helper function to get all types for a specific dimension
 */
export function getTypesByDimension(dimension: LoveStyleDimension): LoveType[] {
  return loveTypes.filter(type => type.primaryDimension === dimension);
}
