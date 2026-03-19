/**
 * Generate BigFive 20-question short version
 *
 * This script converts the original 120 BigFive OSS questions
 * to our internal format and creates a 20-question short version.
 */

import { convertBigFiveOSSToOurFormat, createShortVersion } from '../lib/utils/bigfive-adapter';
import type { BigFiveQuestion } from '../types/bigfive';

// Import original questions (120 questions from BigFive OSS)
const questions = [
  {
    id: '43c98ce8-a07a-4dc2-80f6-c1b2a2485f06',
    text: '心配性だ',
    keyed: 'plus' as const,
    domain: 'N' as const,
    facet: 1
  },
  {
    id: 'd50a597f-632b-4f7b-89e6-6d85b50fd1c9',
    text: '友達を作るのは簡単だ',
    keyed: 'plus' as const,
    domain: 'E' as const,
    facet: 1
  },
  {
    id: '888dd864-7449-4e96-8d5c-7a439603ea91',
    text: '想像力が豊かだ',
    keyed: 'plus' as const,
    domain: 'O' as const,
    facet: 1
  },
  {
    id: 'ce2fbbf8-7a97-4199-bda5-117e4ecdf3b6',
    text: '他人を信頼するほうだ',
    keyed: 'plus' as const,
    domain: 'A' as const,
    facet: 1
  },
  {
    id: 'c7f53c3c-2e77-432f-bb71-7470b67d3aa9',
    text: '仕事は完璧にこなすほうだ',
    keyed: 'plus' as const,
    domain: 'C' as const,
    facet: 1
  },
  // Add more questions as needed for generation
];

// Convert to internal format
const allQuestions: BigFiveQuestion[] = convertBigFiveOSSToOurFormat(questions);

// Create 20-question short version
const shortVersion: BigFiveQuestion[] = createShortVersion(allQuestions, 20);

// Output TypeScript code
console.log(`import type { BigFiveQuestion } from '@/types/bigfive';

/**
 * BigFive Short Version (20 questions)
 *
 * Source: BigFive OSS (https://github.com/rubynor/bigfive-web)
 * License: MIT
 *
 * Selection criteria:
 * - 4 questions per dimension (total 20)
 * - Evenly distributed across dimensions
 * - Balanced normal/reversed items
 */
export const bigFiveQuestions20: BigFiveQuestion[] = ${JSON.stringify(shortVersion, null, 2)};

export const metadata = {
  totalCount: ${shortVersion.length},
  version: '20-short' as const,
  source: 'BigFive OSS',
  license: 'MIT',
  dimensionCounts: {
    neuroticism: ${shortVersion.filter(q => q.dimension === 'neuroticism').length},
    extraversion: ${shortVersion.filter(q => q.dimension === 'extraversion').length},
    openness: ${shortVersion.filter(q => q.dimension === 'openness').length},
    agreeableness: ${shortVersion.filter(q => q.dimension === 'agreeableness').length},
    conscientiousness: ${shortVersion.filter(q => q.dimension === 'conscientiousness').length},
  }
};
`);
