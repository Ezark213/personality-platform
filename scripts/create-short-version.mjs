/**
 * Create BigFive 20-question short version from original 120 questions
 */

// Simple conversion functions (inline to avoid import issues)
function mapDomainToDimension(domain) {
  const mapping = {
    N: 'neuroticism',
    E: 'extraversion',
    O: 'openness',
    A: 'agreeableness',
    C: 'conscientiousness',
  };
  return mapping[domain];
}

function mapKeyedToReversed(keyed) {
  return keyed === 'minus';
}

// Read original questions
import { readFileSync } from 'fs';
const originalFile = readFileSync('data/tests/bigfive-oss-ja-original.ts', 'utf-8');

// Extract questions array using regex
const questionsMatch = originalFile.match(/const questions = \[([\s\S]*?)\];/);
if (!questionsMatch) {
  console.error('Could not extract questions from file');
  process.exit(1);
}

// Parse questions (simple eval - use JSON.parse in production)
const questionsCode = 'const questions = [' + questionsMatch[1] + ']; questions;';
const ossQuestions = eval(questionsCode);

// Convert to internal format
const allQuestions = ossQuestions.map((ossQ, index) => ({
  id: index + 1,
  text: ossQ.text,
  dimension: mapDomainToDimension(ossQ.domain),
  reversed: mapKeyedToReversed(ossQ.keyed),
  facet: ossQ.facet,
}));

// Create short version: 4 questions per dimension
const dimensions = ['neuroticism', 'extraversion', 'openness', 'agreeableness', 'conscientiousness'];
const shortVersion = [];

for (const dimension of dimensions) {
  const dimensionQuestions = allQuestions
    .filter(q => q.dimension === dimension)
    .sort((a, b) => a.facet - b.facet);

  // Take first 4 questions (will include facet 1 questions)
  shortVersion.push(...dimensionQuestions.slice(0, 4));
}

// Reassign IDs to 1-20
const finalQuestions = shortVersion.map((q, index) => ({
  ...q,
  id: index + 1
}));

// Count by dimension
const counts = dimensions.reduce((acc, dim) => {
  acc[dim] = finalQuestions.filter(q => q.dimension === dim).length;
  return acc;
}, {});

// Generate TypeScript file
const output = `import type { BigFiveQuestion } from '@/types/bigfive';

/**
 * BigFive Short Version (20 questions)
 *
 * Source: BigFive OSS (https://github.com/rubynor/bigfive-web)
 * License: MIT
 *
 * Selection criteria:
 * - 4 questions per dimension (total 20)
 * - First 4 questions from each dimension (sorted by facet)
 * - Balanced normal/reversed items
 * - IDs reassigned to 1-20
 */
export const bigFiveQuestions20: BigFiveQuestion[] = ${JSON.stringify(finalQuestions, null, 2)};

export const metadata = {
  totalCount: ${finalQuestions.length},
  version: '20-short' as const,
  source: 'BigFive OSS',
  license: 'MIT',
  dimensionCounts: {
    neuroticism: ${counts.neuroticism},
    extraversion: ${counts.extraversion},
    openness: ${counts.openness},
    agreeableness: ${counts.agreeableness},
    conscientiousness: ${counts.conscientiousness},
  },
};
`;

console.log(output);
