import type {
  BigFiveOSSDomain,
  BigFiveOSSKeyed,
  BigFiveOSSQuestion,
  BigFiveQuestion,
  BigFiveDimension,
} from '../../types/bigfive';

export function mapDomainToDimension(domain: BigFiveOSSDomain): BigFiveDimension {
  const mapping: Record<BigFiveOSSDomain, BigFiveDimension> = {
    N: 'neuroticism',
    E: 'extraversion',
    O: 'openness',
    A: 'agreeableness',
    C: 'conscientiousness',
  };
  return mapping[domain];
}

export function mapKeyedToReversed(keyed: BigFiveOSSKeyed): boolean {
  return keyed === 'minus';
}

export function convertBigFiveOSSToOurFormat(
  ossQuestions: BigFiveOSSQuestion[]
): BigFiveQuestion[] {
  return ossQuestions.map((ossQ, index) => ({
    id: index + 1,
    text: ossQ.text,
    dimension: mapDomainToDimension(ossQ.domain),
    reversed: mapKeyedToReversed(ossQ.keyed),
    facet: ossQ.facet,
  }));
}

export function createShortVersion(
  questions: BigFiveQuestion[],
  count: number
): BigFiveQuestion[] {
  const result: BigFiveQuestion[] = [];
  const dimensions: BigFiveDimension[] = [
    'neuroticism',
    'extraversion',
    'openness',
    'agreeableness',
    'conscientiousness',
  ];
  
  const perDimension = Math.floor(count / 5);
  
  for (const dimension of dimensions) {
    const dimensionQuestions = questions
      .filter(q => q.dimension === dimension)
      .sort((a, b) => a.facet - b.facet);
    
    result.push(...dimensionQuestions.slice(0, perDimension));
  }
  
  return result;
}
