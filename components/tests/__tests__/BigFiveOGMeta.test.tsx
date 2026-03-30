import { describe, it, expect } from 'vitest';
import { generateOGMetaTags } from '../BigFiveOGMeta';

describe('BigFiveOGMeta', () => {
  const mockProps = {
    resultId: 'test123',
    typeName: '挑戦者',
    catchphrase: '果敢に挑戦し、新しい道を切り拓く冒険家',
    url: 'https://example.com/tests/bigfive/result?id=test123',
  };

  it('should generate og:title with correct content', () => {
    const meta = generateOGMetaTags(mockProps);
    expect(meta.title).toBe('あなたは挑戦者タイプ');
  });

  it('should generate og:description with catchphrase', () => {
    const meta = generateOGMetaTags(mockProps);
    expect(meta.description).toBe('果敢に挑戦し、新しい道を切り拓く冒険家');
  });

  it('should generate og:image with correct API URL', () => {
    const meta = generateOGMetaTags(mockProps);
    expect(meta.imageUrl).toBe('/api/og/bigfive/card/test123');
  });

  it('should generate og:url with provided URL', () => {
    const meta = generateOGMetaTags(mockProps);
    expect(meta.url).toBe('https://example.com/tests/bigfive/result?id=test123');
  });

  it('should include twitter card type', () => {
    const meta = generateOGMetaTags(mockProps);
    expect(meta.twitterCard).toBe('summary_large_image');
  });

  it('should generate twitter:image with correct API URL', () => {
    const meta = generateOGMetaTags(mockProps);
    expect(meta.twitterImage).toBe('/api/og/bigfive/card/test123');
  });

  it('should handle special characters in typeName and catchphrase', () => {
    const specialProps = {
      ...mockProps,
      typeName: 'テスト&タイプ',
      catchphrase: 'これは"特殊"な<文字>を含むテスト',
    };
    const meta = generateOGMetaTags(specialProps);
    expect(meta.title).toBe('あなたはテスト&タイプタイプ');
    expect(meta.description).toBe('これは"特殊"な<文字>を含むテスト');
  });

  it('should generate all required meta tag data', () => {
    const meta = generateOGMetaTags(mockProps);

    // Check that all required properties are present
    expect(meta).toHaveProperty('title');
    expect(meta).toHaveProperty('description');
    expect(meta).toHaveProperty('imageUrl');
    expect(meta).toHaveProperty('url');
    expect(meta).toHaveProperty('twitterCard');
    expect(meta).toHaveProperty('twitterImage');
  });
});
