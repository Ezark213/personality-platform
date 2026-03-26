import { describe, it, expect } from 'vitest';
import {
  buildSystemPrompt,
  detectCrisisKeywords,
  type ConsultationTheme,
} from '../prompt-builder';
import type { BigFiveResult } from '@/types/bigfive';

/**
 * Prompt Builder ユニットテスト
 *
 * テスト対象:
 * - buildSystemPrompt(): 5層プロンプト構造生成
 * - detectCrisisKeywords(): クライシスキーワード検出
 * - BigFiveスコア動的注入
 */

describe('Prompt Builder', () => {
  describe('buildSystemPrompt()', () => {
    it('should build system prompt with all 5 layers', () => {
      const theme: ConsultationTheme = 'career';
      const prompt = buildSystemPrompt(theme);

      // 5層すべてが含まれることを確認
      expect(prompt).toContain('ココロ');
      expect(prompt).toContain('役割');
      expect(prompt).toContain('コミュニケーションスタイル');
      expect(prompt).toContain('キャリア');
      expect(prompt).toContain('安全ガイドライン');
    });

    it('should inject BigFive scores into context layer', () => {
      const theme: ConsultationTheme = 'career';
      const bigFiveScores: BigFiveResult = {
        scores: {
          neuroticism: { average: 3.5, normalized: 70, level: 'high' },
          extraversion: { average: 2.5, normalized: 50, level: 'neutral' },
          openness: { average: 4.0, normalized: 80, level: 'high' },
          agreeableness: { average: 3.0, normalized: 60, level: 'neutral' },
          conscientiousness: { average: 4.5, normalized: 90, level: 'high' },
        },
      };

      const prompt = buildSystemPrompt(theme, bigFiveScores);

      // BigFiveスコアが注入されていることを確認
      expect(prompt).toContain('神経症傾向');
      expect(prompt).toContain('70/100');
      expect(prompt).toContain('高い');
      expect(prompt).toContain('外向性');
      expect(prompt).toContain('50/100');
      expect(prompt).toContain('開放性');
      expect(prompt).toContain('80/100');
    });

    it('should handle missing BigFive scores', () => {
      const theme: ConsultationTheme = 'career';
      const prompt = buildSystemPrompt(theme);

      // スコアなしの場合のメッセージを確認
      expect(prompt).toContain('性格診断未実施');
      expect(prompt).toContain('一般的なアドバイスのみ');
    });

    it('should support career theme', () => {
      const theme: ConsultationTheme = 'career';
      const prompt = buildSystemPrompt(theme);

      expect(prompt).toContain('キャリア');
      expect(prompt).toContain('転職');
      expect(prompt).toContain('職場の人間関係');
    });

    it('should support relationships theme', () => {
      const theme: ConsultationTheme = 'relationships';
      const prompt = buildSystemPrompt(theme);

      expect(prompt).toContain('人間関係');
      expect(prompt).toContain('友人');
      expect(prompt).toContain('恋人');
    });

    it('should support self-growth theme', () => {
      const theme: ConsultationTheme = 'self-growth';
      const prompt = buildSystemPrompt(theme);

      expect(prompt).toContain('自己成長');
      expect(prompt).toContain('自己理解');
      expect(prompt).toContain('習慣形成');
    });

    it('should include safety guidelines in all prompts', () => {
      const themes: ConsultationTheme[] = ['career', 'relationships', 'self-growth'];

      themes.forEach((theme) => {
        const prompt = buildSystemPrompt(theme);

        expect(prompt).toContain('クライシス検出');
        expect(prompt).toContain('いのちの電話');
        expect(prompt).toContain('0570-783-556');
      });
    });

    it('should include Kokoro character style', () => {
      const theme: ConsultationTheme = 'career';
      const prompt = buildSystemPrompt(theme);

      expect(prompt).toContain('ココロキャラクター');
      expect(prompt).toContain('温かく支援的');
      expect(prompt).toContain('先輩');
      expect(prompt).toContain('顔文字');
    });
  });

  describe('detectCrisisKeywords()', () => {
    it('should detect "死にたい"', () => {
      expect(detectCrisisKeywords('もう死にたい')).toBe(true);
      expect(detectCrisisKeywords('死にたいと思っています')).toBe(true);
    });

    it('should detect "消えたい"', () => {
      expect(detectCrisisKeywords('消えたい')).toBe(true);
      expect(detectCrisisKeywords('この世から消えたい')).toBe(true);
    });

    it('should detect "終わらせたい"', () => {
      expect(detectCrisisKeywords('すべてを終わらせたい')).toBe(true);
    });

    it('should detect "自殺"', () => {
      expect(detectCrisisKeywords('自殺を考えています')).toBe(true);
    });

    it('should detect "自傷"', () => {
      expect(detectCrisisKeywords('自傷行為をしてしまいました')).toBe(true);
    });

    it('should detect "もう限界"', () => {
      expect(detectCrisisKeywords('もう限界です')).toBe(true);
    });

    it('should detect "生きていけない"', () => {
      expect(detectCrisisKeywords('もう生きていけない')).toBe(true);
    });

    it('should detect "誰も助けてくれない"', () => {
      expect(detectCrisisKeywords('誰も助けてくれない')).toBe(true);
    });

    it('should handle messages with spaces', () => {
      expect(detectCrisisKeywords('も う 限 界')).toBe(true);
      expect(detectCrisisKeywords('死 に た い')).toBe(true);
    });

    it('should handle case variations', () => {
      expect(detectCrisisKeywords('死ニタイ')).toBe(true);
      expect(detectCrisisKeywords('ジサツ')).toBe(true);
    });

    it('should return false for normal messages', () => {
      expect(detectCrisisKeywords('キャリアについて相談したいです')).toBe(false);
      expect(detectCrisisKeywords('転職を考えています')).toBe(false);
      expect(detectCrisisKeywords('人間関係で悩んでいます')).toBe(false);
      expect(detectCrisisKeywords('こんにちは')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(detectCrisisKeywords('')).toBe(false);
    });

    it('should return false for messages with similar but different words', () => {
      expect(detectCrisisKeywords('疲れた')).toBe(false);
      expect(detectCrisisKeywords('しんどい')).toBe(false);
      expect(detectCrisisKeywords('つらい')).toBe(false);
    });
  });
});
