import type { LoveTypeQuestion } from '@/types/love-type';

/**
 * Love Type Test Questions (20 questions)
 *
 * 恋愛タイプ診断 - 20問
 * 各次元5問ずつ
 */
export const loveTypeQuestions: LoveTypeQuestion[] = [
  // Romantic (ロマンティック) - 5 questions
  {
    id: 1,
    text: 'サプライズやロマンチックな演出が好きだ',
    dimension: 'romantic',
    reversed: false,
  },
  {
    id: 2,
    text: '記念日やイベントを大切にする',
    dimension: 'romantic',
    reversed: false,
  },
  {
    id: 3,
    text: '愛情表現は言葉や行動で示したい',
    dimension: 'romantic',
    reversed: false,
  },
  {
    id: 4,
    text: '理想の恋愛像がある',
    dimension: 'romantic',
    reversed: false,
  },
  {
    id: 5,
    text: '感情的なつながりを重視する',
    dimension: 'romantic',
    reversed: false,
  },

  // Practical (実用的) - 5 questions
  {
    id: 6,
    text: '恋愛において現実的な条件を重視する',
    dimension: 'practical',
    reversed: false,
  },
  {
    id: 7,
    text: '将来のことを考えてパートナーを選ぶ',
    dimension: 'practical',
    reversed: false,
  },
  {
    id: 8,
    text: '価値観や生活スタイルの一致が重要だ',
    dimension: 'practical',
    reversed: false,
  },
  {
    id: 9,
    text: '経済的な安定も関係において大切だ',
    dimension: 'practical',
    reversed: false,
  },
  {
    id: 10,
    text: '恋愛においても冷静に判断する',
    dimension: 'practical',
    reversed: false,
  },

  // Passionate (情熱的) - 5 questions
  {
    id: 11,
    text: '恋愛では強い感情を感じたい',
    dimension: 'passionate',
    reversed: false,
  },
  {
    id: 12,
    text: '一目惚れをしやすい',
    dimension: 'passionate',
    reversed: false,
  },
  {
    id: 13,
    text: 'スキンシップやボディタッチが多い',
    dimension: 'passionate',
    reversed: false,
  },
  {
    id: 14,
    text: '恋愛において刺激や興奮を求める',
    dimension: 'passionate',
    reversed: false,
  },
  {
    id: 15,
    text: '好きな人のことで頭がいっぱいになる',
    dimension: 'passionate',
    reversed: false,
  },

  // Companionate (友情的) - 5 questions
  {
    id: 16,
    text: 'パートナーとは友達のような関係がいい',
    dimension: 'companionate',
    reversed: false,
  },
  {
    id: 17,
    text: '一緒にいて楽で居心地がいいことが大切',
    dimension: 'companionate',
    reversed: false,
  },
  {
    id: 18,
    text: '趣味や興味を共有できる相手がいい',
    dimension: 'companionate',
    reversed: false,
  },
  {
    id: 19,
    text: '信頼関係を何より大切にする',
    dimension: 'companionate',
    reversed: false,
  },
  {
    id: 20,
    text: 'ゆっくりと時間をかけて関係を深めたい',
    dimension: 'companionate',
    reversed: false,
  },
];

export const metadata = {
  totalCount: 20,
  version: '20-v1' as const,
  dimensionCounts: {
    romantic: 5,
    practical: 5,
    passionate: 5,
    companionate: 5,
  },
};
