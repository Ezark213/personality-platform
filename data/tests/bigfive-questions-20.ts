import type { BigFiveQuestion } from '@/types/bigfive';

/**
 * BigFive Short Version (20 questions)
 *
 * Source: BigFive OSS (https://github.com/rubynor/bigfive-web)
 * License: MIT
 *
 * Selection criteria:
 * - 4 questions per dimension (total 20)
 * - First 4 questions from each dimension
 * - Balanced facets (1-4)
 * - Includes both normal and reversed items
 * - IDs reassigned to 1-20
 */
export const bigFiveQuestions20: BigFiveQuestion[] = [
  // Neuroticism (N) - 4 questions
  {
    id: 1,
    text: '心配性だ',
    dimension: 'neuroticism',
    reversed: false,
    facet: 1,
  },
  {
    id: 2,
    text: '短気だ',
    dimension: 'neuroticism',
    reversed: false,
    facet: 2,
  },
  {
    id: 3,
    text: '憂鬱な気分になることが多い',
    dimension: 'neuroticism',
    reversed: false,
    facet: 3,
  },
  {
    id: 4,
    text: '他人に近づくことが苦手だ',
    dimension: 'neuroticism',
    reversed: false,
    facet: 4,
  },

  // Extraversion (E) - 4 questions
  {
    id: 5,
    text: '友達を作るのは簡単だ',
    dimension: 'extraversion',
    reversed: false,
    facet: 1,
  },
  {
    id: 6,
    text: '大きなパーティが好きだ',
    dimension: 'extraversion',
    reversed: false,
    facet: 2,
  },
  {
    id: 7,
    text: '世話を焼きがちだ',
    dimension: 'extraversion',
    reversed: false,
    facet: 3,
  },
  {
    id: 8,
    text: 'いつも忙しいほうだ',
    dimension: 'extraversion',
    reversed: false,
    facet: 4,
  },

  // Openness (O) - 4 questions
  {
    id: 9,
    text: '想像力が豊かだ',
    dimension: 'openness',
    reversed: false,
    facet: 1,
  },
  {
    id: 10,
    text: '芸術は重要だと思う',
    dimension: 'openness',
    reversed: false,
    facet: 2,
  },
  {
    id: 11,
    text: '感情的なほうだ',
    dimension: 'openness',
    reversed: false,
    facet: 3,
  },
  {
    id: 12,
    text: '新しいことを試すのが好きだ',
    dimension: 'openness',
    reversed: false,
    facet: 4,
  },

  // Agreeableness (A) - 4 questions
  {
    id: 13,
    text: '他人を信頼するほうだ',
    dimension: 'agreeableness',
    reversed: false,
    facet: 1,
  },
  {
    id: 14,
    text: '自分のために他人を利用するほうだ',
    dimension: 'agreeableness',
    reversed: true,
    facet: 2,
  },
  {
    id: 15,
    text: '人助けが好きだ',
    dimension: 'agreeableness',
    reversed: false,
    facet: 3,
  },
  {
    id: 16,
    text: '他人の感情を理解するのは難しい',
    dimension: 'agreeableness',
    reversed: true,
    facet: 4,
  },

  // Conscientiousness (C) - 4 questions
  {
    id: 17,
    text: '仕事は完璧にこなすほうだ',
    dimension: 'conscientiousness',
    reversed: false,
    facet: 1,
  },
  {
    id: 18,
    text: 'きれい好きだ',
    dimension: 'conscientiousness',
    reversed: false,
    facet: 2,
  },
  {
    id: 19,
    text: '約束は守るほうだ',
    dimension: 'conscientiousness',
    reversed: false,
    facet: 3,
  },
  {
    id: 20,
    text: '計画を立てずに行動する',
    dimension: 'conscientiousness',
    reversed: true,
    facet: 4,
  },
];

export const metadata = {
  totalCount: 20,
  version: '20-short' as const,
  source: 'BigFive OSS',
  license: 'MIT',
  dimensionCounts: {
    neuroticism: 4,
    extraversion: 4,
    openness: 4,
    agreeableness: 4,
    conscientiousness: 4,
  },
};
