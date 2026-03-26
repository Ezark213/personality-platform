import type { AptitudeQuestion } from '@/types/aptitude';

/**
 * Aptitude Test Questions (20 questions)
 *
 * 適性検査（仕事・役割診断） - 20問
 * 各次元5問ずつ
 */
export const aptitudeQuestions: AptitudeQuestion[] = [
  // Leadership (リーダーシップ) - 5 questions
  {
    id: 1,
    text: 'グループをまとめる役割が向いている',
    dimension: 'leadership',
    reversed: false,
  },
  {
    id: 2,
    text: '意思決定を素早く行うことができる',
    dimension: 'leadership',
    reversed: false,
  },
  {
    id: 3,
    text: '人前で話すことが得意だ',
    dimension: 'leadership',
    reversed: false,
  },
  {
    id: 4,
    text: '目標を設定してチームを導くことが好きだ',
    dimension: 'leadership',
    reversed: false,
  },
  {
    id: 5,
    text: '責任のある立場を任されることが多い',
    dimension: 'leadership',
    reversed: false,
  },

  // Analytical (分析的) - 5 questions
  {
    id: 6,
    text: 'データや数字を扱う仕事が得意だ',
    dimension: 'analytical',
    reversed: false,
  },
  {
    id: 7,
    text: '論理的に物事を考えることが好きだ',
    dimension: 'analytical',
    reversed: false,
  },
  {
    id: 8,
    text: '問題の原因を深く分析する',
    dimension: 'analytical',
    reversed: false,
  },
  {
    id: 9,
    text: '細かいところまで確認する性格だ',
    dimension: 'analytical',
    reversed: false,
  },
  {
    id: 10,
    text: '計画を立てて物事を進めるのが好きだ',
    dimension: 'analytical',
    reversed: false,
  },

  // Creative (創造的) - 5 questions
  {
    id: 11,
    text: '新しいアイデアを考えることが得意だ',
    dimension: 'creative',
    reversed: false,
  },
  {
    id: 12,
    text: '既存の枠にとらわれない発想ができる',
    dimension: 'creative',
    reversed: false,
  },
  {
    id: 13,
    text: 'デザインや表現を考えることが好きだ',
    dimension: 'creative',
    reversed: false,
  },
  {
    id: 14,
    text: '直感を大切にして行動する',
    dimension: 'creative',
    reversed: false,
  },
  {
    id: 15,
    text: '変化や新しい挑戦を楽しむ',
    dimension: 'creative',
    reversed: false,
  },

  // Collaborative (協調的) - 5 questions
  {
    id: 16,
    text: 'チームで協力して働くことが好きだ',
    dimension: 'collaborative',
    reversed: false,
  },
  {
    id: 17,
    text: '他人の意見を聞くことを大切にする',
    dimension: 'collaborative',
    reversed: false,
  },
  {
    id: 18,
    text: '人間関係を円滑に保つことが得意だ',
    dimension: 'collaborative',
    reversed: false,
  },
  {
    id: 19,
    text: 'サポート役として力を発揮する',
    dimension: 'collaborative',
    reversed: false,
  },
  {
    id: 20,
    text: '他人の成功を喜ぶことができる',
    dimension: 'collaborative',
    reversed: false,
  },
];

export const metadata = {
  totalCount: 20,
  version: '20-v1' as const,
  dimensionCounts: {
    leadership: 5,
    analytical: 5,
    creative: 5,
    collaborative: 5,
  },
};
