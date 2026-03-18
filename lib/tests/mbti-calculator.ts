import { Answer, MBTIResult } from "@/types/test";
import { mbtiQuestions } from "@/data/tests/mbti-questions";

export function calculateMBTIResult(answers: Answer[]): MBTIResult {
  // 各軸のスコアを初期化
  const scores = {
    EI: 0, // E: プラス, I: マイナス
    SN: 0, // S: プラス, N: マイナス
    TF: 0, // T: プラス, F: マイナス
    JP: 0, // J: プラス, P: マイナス
  };

  // 各回答をスコアに加算
  answers.forEach((answer) => {
    const question = mbtiQuestions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const dimension = question.dimension as keyof typeof scores;
    // 質問の方向性を考慮してスコアを計算
    // value: 1-5, direction: 1 or -1
    // スコア = (value - 3) * direction
    // 3が中立なので、3を引いて-2から+2の範囲にする
    const score = (answer.value - 3) * question.direction;
    scores[dimension] += score;
  });

  // 各軸のタイプを決定
  const dimensions = {
    EI: {
      score: scores.EI,
      type: (scores.EI >= 0 ? "E" : "I") as "E" | "I",
    },
    SN: {
      score: scores.SN,
      type: (scores.SN >= 0 ? "S" : "N") as "S" | "N",
    },
    TF: {
      score: scores.TF,
      type: (scores.TF >= 0 ? "T" : "F") as "T" | "F",
    },
    JP: {
      score: scores.JP,
      type: (scores.JP >= 0 ? "J" : "P") as "J" | "P",
    },
  };

  // 4文字のタイプを組み立て
  const type = `${dimensions.EI.type}${dimensions.SN.type}${dimensions.TF.type}${dimensions.JP.type}`;

  return {
    type,
    dimensions,
  };
}

// MBTI 16タイプの説明データ
export const mbtiDescriptions: Record<
  string,
  {
    name: string;
    nickname: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    careers: string[];
  }
> = {
  INTJ: {
    name: "建築家",
    nickname: "戦略家",
    description:
      "独創的な思考と強い意志を持つ戦略家。完璧主義で、自分の知識と能力に自信を持っています。",
    strengths: [
      "戦略的思考",
      "独立性",
      "決断力",
      "長期的ビジョン",
      "高い専門性",
    ],
    weaknesses: [
      "感情表現が苦手",
      "権威に懐疑的",
      "完璧主義すぎる",
      "批判的になりやすい",
    ],
    careers: [
      "システムエンジニア",
      "研究者",
      "戦略コンサルタント",
      "起業家",
      "建築家",
    ],
  },
  INTP: {
    name: "論理学者",
    nickname: "思想家",
    description:
      "革新的な発明家で、知識と理論に対する飽くなき探究心を持っています。",
    strengths: [
      "分析力",
      "論理的思考",
      "創造性",
      "客観性",
      "問題解決能力",
    ],
    weaknesses: [
      "実行力不足",
      "感情の軽視",
      "批判的",
      "社交が苦手",
    ],
    careers: [
      "プログラマー",
      "科学者",
      "数学者",
      "哲学者",
      "大学教授",
    ],
  },
  ENTJ: {
    name: "指揮官",
    nickname: "リーダー",
    description:
      "大胆で想像力豊かな強い意志を持つリーダー。常に道を見つけるか、道を作り出します。",
    strengths: [
      "リーダーシップ",
      "効率性",
      "戦略的",
      "自信",
      "意志が強い",
    ],
    weaknesses: [
      "頑固",
      "支配的",
      "感情に鈍感",
      "せっかち",
    ],
    careers: [
      "経営者",
      "弁護士",
      "プロジェクトマネージャー",
      "政治家",
      "投資家",
    ],
  },
  ENTP: {
    name: "討論者",
    nickname: "革新者",
    description:
      "賢くて好奇心旺盛な思想家で、知的挑戦を断ることができません。",
    strengths: [
      "創造性",
      "知的好奇心",
      "カリスマ性",
      "柔軟性",
      "エネルギッシュ",
    ],
    weaknesses: [
      "議論好き",
      "不寛容",
      "集中力不足",
      "感情の軽視",
    ],
    careers: [
      "起業家",
      "発明家",
      "マーケター",
      "コンサルタント",
      "弁護士",
    ],
  },
  INFJ: {
    name: "提唱者",
    nickname: "カウンセラー",
    description:
      "静かで神秘的、それでいて人を励ます理想主義者。世界に永続的な良い影響を与えたいと願っています。",
    strengths: [
      "共感力",
      "洞察力",
      "理想主義",
      "創造性",
      "決意",
    ],
    weaknesses: [
      "完璧主義",
      "燃え尽きやすい",
      "プライベートを守りすぎる",
      "批判に敏感",
    ],
    careers: [
      "カウンセラー",
      "作家",
      "心理学者",
      "教師",
      "社会活動家",
    ],
  },
  INFP: {
    name: "仲介者",
    nickname: "理想主義者",
    description:
      "詩的で親切、利他的な人で、常に善良な理由や人々を助ける方法を探しています。",
    strengths: [
      "共感力",
      "創造性",
      "理想主義",
      "献身的",
      "価値観を重視",
    ],
    weaknesses: [
      "非現実的",
      "自己批判的",
      "感情的",
      "実用性不足",
    ],
    careers: [
      "作家",
      "アーティスト",
      "カウンセラー",
      "教師",
      "非営利団体職員",
    ],
  },
  ENFJ: {
    name: "主人公",
    nickname: "教師",
    description:
      "カリスマ性があり、人を励ますことのできるリーダー。聴衆を魅了します。",
    strengths: [
      "カリスマ性",
      "利他的",
      "リーダーシップ",
      "コミュニケーション能力",
      "信頼できる",
    ],
    weaknesses: [
      "理想主義すぎる",
      "感情的すぎる",
      "優柔不断",
      "自己犠牲的",
    ],
    careers: [
      "教師",
      "カウンセラー",
      "人事マネージャー",
      "イベントコーディネーター",
      "政治家",
    ],
  },
  ENFP: {
    name: "広報運動家",
    nickname: "チャンピオン",
    description:
      "熱心で創造的、社交的で自由な精神を持つ人で、常に笑顔の理由を見つけられます。",
    strengths: [
      "熱意",
      "創造性",
      "社交性",
      "楽観的",
      "柔軟性",
    ],
    weaknesses: [
      "集中力不足",
      "ストレス管理が苦手",
      "過度に感情的",
      "独立心が強すぎる",
    ],
    careers: [
      "マーケター",
      "ジャーナリスト",
      "俳優",
      "カウンセラー",
      "起業家",
    ],
  },
  ISTJ: {
    name: "管理者",
    nickname: "検査官",
    description:
      "実用的で事実に基づいた人で、信頼性は疑う余地がありません。",
    strengths: [
      "誠実",
      "責任感",
      "実用的",
      "組織力",
      "忍耐強い",
    ],
    weaknesses: [
      "頑固",
      "鈍感",
      "規則に固執",
      "変化を嫌う",
    ],
    careers: [
      "会計士",
      "軍人",
      "警察官",
      "管理職",
      "エンジニア",
    ],
  },
  ISFJ: {
    name: "擁護者",
    nickname: "保護者",
    description:
      "非常に献身的で温かい保護者。いつでも大切な人を守る準備ができています。",
    strengths: [
      "サポート力",
      "信頼性",
      "忍耐強い",
      "実用的",
      "熱心",
    ],
    weaknesses: [
      "謙虚すぎる",
      "変化への抵抗",
      "批判を受け入れにくい",
      "過度に利他的",
    ],
    careers: [
      "看護師",
      "教師",
      "社会福祉士",
      "事務職",
      "図書館司書",
    ],
  },
  ESTJ: {
    name: "幹部",
    nickname: "監督者",
    description:
      "優れた管理者で、物事や人々を管理することにおいて比類なき能力を持っています。",
    strengths: [
      "組織力",
      "リーダーシップ",
      "誠実",
      "決断力",
      "責任感",
    ],
    weaknesses: [
      "頑固",
      "感情に鈍感",
      "判断が厳しい",
      "柔軟性不足",
    ],
    careers: [
      "管理職",
      "警察官",
      "裁判官",
      "財務アナリスト",
      "軍人",
    ],
  },
  ESFJ: {
    name: "領事官",
    nickname: "提供者",
    description:
      "非常に思いやりがあり社交的で人気者。常に人の役に立とうとします。",
    strengths: [
      "協調性",
      "実用的",
      "思いやり",
      "忠誠心",
      "組織力",
    ],
    weaknesses: [
      "他人に頼りすぎる",
      "批判に弱い",
      "変化を嫌う",
      "利己的になれない",
    ],
    careers: [
      "看護師",
      "教師",
      "イベントプランナー",
      "受付",
      "販売員",
    ],
  },
  ISTP: {
    name: "巨匠",
    nickname: "職人",
    description:
      "大胆で実践的な実験者。あらゆる種類の道具を使いこなします。",
    strengths: [
      "実用的",
      "冷静",
      "即興力",
      "観察力",
      "リラックスしている",
    ],
    weaknesses: [
      "頑固",
      "鈍感",
      "プライベート重視",
      "飽きやすい",
    ],
    careers: [
      "エンジニア",
      "整備士",
      "パイロット",
      "警察官",
      "プログラマー",
    ],
  },
  ISFP: {
    name: "冒険家",
    nickname: "芸術家",
    description:
      "柔軟で魅力的な芸術家。いつでも新しいことを探索し、経験する準備ができています。",
    strengths: [
      "芸術的",
      "好奇心旺盛",
      "柔軟",
      "情熱的",
      "独立的",
    ],
    weaknesses: [
      "感情的",
      "競争を避ける",
      "ストレスに弱い",
      "独立心が強すぎる",
    ],
    careers: [
      "アーティスト",
      "デザイナー",
      "ミュージシャン",
      "シェフ",
      "看護師",
    ],
  },
  ESTP: {
    name: "起業家",
    nickname: "実業家",
    description:
      "賢く、エネルギッシュで、非常に鋭い知覚力を持つ人。リスクと隣り合わせの生活を心から楽しみます。",
    strengths: [
      "大胆",
      "実用的",
      "社交的",
      "観察力",
      "即興力",
    ],
    weaknesses: [
      "せっかち",
      "リスクを取りすぎる",
      "集中力不足",
      "鈍感",
    ],
    careers: [
      "起業家",
      "営業職",
      "警察官",
      "救急隊員",
      "スポーツ選手",
    ],
  },
  ESFP: {
    name: "エンターテイナー",
    nickname: "パフォーマー",
    description:
      "自発的でエネルギッシュ、熱心なエンターテイナー。周りの人々を退屈させることはありません。",
    strengths: [
      "大胆",
      "独創的",
      "実用的",
      "観察力",
      "優れた対人スキル",
    ],
    weaknesses: [
      "敏感",
      "衝突を避ける",
      "飽きやすい",
      "集中力不足",
    ],
    careers: [
      "俳優",
      "ミュージシャン",
      "イベントプランナー",
      "販売員",
      "旅行ガイド",
    ],
  },
};
