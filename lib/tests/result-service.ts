// lib/tests/result-service.ts
// Task 3-1: 診断結果保存API - ビジネスロジック
// TDDサイクル: Green - テストを通す最小限の実装

import { PrismaClient, TestType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 診断結果保存のメタデータ
 */
export interface TestResultMetadata {
  ipAddress?: string;
  userAgent?: string;
}

/**
 * 診断結果を保存
 *
 * @param userId - ユーザーID（匿名の場合null）
 * @param testType - 診断タイプ（BIGFIVE, APTITUDE, LOVE_TYPE）
 * @param scores - 診断スコア（JSON形式）
 * @param typeId - タイプID（BigFive: "15type-id"、Aptitude: "aptitude-type-id"）
 * @param metadata - メタデータ（IPアドレス、UserAgent）
 * @returns 保存された診断結果ID
 * @throws {Error} Scores cannot be empty - scoresが空の場合
 * @throws {Error} Type ID is required - typeIdが空の場合
 * @throws {Error} User not found - ユーザーが存在しない場合（userId非nullの場合）
 */
export async function saveTestResult(
  userId: string | null,
  testType: TestType,
  scores: Prisma.InputJsonValue,
  typeId: string,
  metadata?: TestResultMetadata
): Promise<{ resultId: string }> {
  // バリデーション
  if (!scores || (typeof scores === 'object' && scores !== null && !Array.isArray(scores) && Object.keys(scores).length === 0)) {
    throw new Error('Scores cannot be empty');
  }

  if (!typeId || typeId.trim() === '') {
    throw new Error('Type ID is required');
  }

  // userId非nullの場合、ユーザー存在確認
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }
  }

  // 診断結果作成
  const testResult = await prisma.testResult.create({
    data: {
      userId: userId || null,
      testType,
      scores,
      typeId,
      ipAddress: metadata?.ipAddress || null,
      userAgent: metadata?.userAgent || null,
    },
  });

  return {
    resultId: testResult.id,
  };
}
