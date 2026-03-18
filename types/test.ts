// 診断テスト関連の型定義

export interface Question {
  id: number;
  text: string;
  dimension: string; // MBTI: E/I, S/N, T/F, J/P
  direction: 1 | -1; // 1: ポジティブ方向, -1: ネガティブ方向
}

export interface Answer {
  questionId: number;
  value: number; // 1-5のリッカート尺度
}

export interface TestResult {
  testType: string;
  answers: Answer[];
  scores: Record<string, number>;
  result: string;
  completedAt: Date;
}

export interface MBTIResult {
  type: string; // e.g., "INTJ"
  dimensions: {
    EI: { score: number; type: "E" | "I" };
    SN: { score: number; type: "S" | "N" };
    TF: { score: number; type: "T" | "F" };
    JP: { score: number; type: "J" | "P" };
  };
}
