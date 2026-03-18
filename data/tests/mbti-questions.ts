import { Question } from "@/types/test";

// MBTI診断の質問セット（各軸10問ずつ、計40問）
export const mbtiQuestions: Question[] = [
  // E/I（外向性 vs 内向性）- 10問
  {
    id: 1,
    text: "大勢の人と一緒にいると元気になる",
    dimension: "EI",
    direction: 1, // E方向
  },
  {
    id: 2,
    text: "一人で過ごす時間が必要だと感じる",
    dimension: "EI",
    direction: -1, // I方向
  },
  {
    id: 3,
    text: "初対面の人とも気軽に話せる",
    dimension: "EI",
    direction: 1,
  },
  {
    id: 4,
    text: "深く考えてから行動する方だ",
    dimension: "EI",
    direction: -1,
  },
  {
    id: 5,
    text: "パーティーや集まりが好きだ",
    dimension: "EI",
    direction: 1,
  },
  {
    id: 6,
    text: "静かな環境で集中するのが好きだ",
    dimension: "EI",
    direction: -1,
  },
  {
    id: 7,
    text: "多くの友人を持つことが重要だ",
    dimension: "EI",
    direction: 1,
  },
  {
    id: 8,
    text: "少数の親しい友人で満足している",
    dimension: "EI",
    direction: -1,
  },
  {
    id: 9,
    text: "すぐに行動に移すタイプだ",
    dimension: "EI",
    direction: 1,
  },
  {
    id: 10,
    text: "内省的で自分の内面を大切にする",
    dimension: "EI",
    direction: -1,
  },

  // S/N（感覚 vs 直観）- 10問
  {
    id: 11,
    text: "現実的で実用的なことに興味がある",
    dimension: "SN",
    direction: 1, // S方向
  },
  {
    id: 12,
    text: "抽象的な理論や概念を考えるのが好きだ",
    dimension: "SN",
    direction: -1, // N方向
  },
  {
    id: 13,
    text: "詳細や事実を重視する",
    dimension: "SN",
    direction: 1,
  },
  {
    id: 14,
    text: "全体像やパターンを見る方が得意だ",
    dimension: "SN",
    direction: -1,
  },
  {
    id: 15,
    text: "経験から学ぶことを好む",
    dimension: "SN",
    direction: 1,
  },
  {
    id: 16,
    text: "未来の可能性について考えるのが好きだ",
    dimension: "SN",
    direction: -1,
  },
  {
    id: 17,
    text: "具体的な手順に従うのが得意だ",
    dimension: "SN",
    direction: 1,
  },
  {
    id: 18,
    text: "新しいアイデアや革新を追求する",
    dimension: "SN",
    direction: -1,
  },
  {
    id: 19,
    text: "五感を通じて情報を得るのが好きだ",
    dimension: "SN",
    direction: 1,
  },
  {
    id: 20,
    text: "直感やひらめきを信じる",
    dimension: "SN",
    direction: -1,
  },

  // T/F（思考 vs 感情）- 10問
  {
    id: 21,
    text: "論理的な分析を重視する",
    dimension: "TF",
    direction: 1, // T方向
  },
  {
    id: 22,
    text: "人の感情を考慮して決断する",
    dimension: "TF",
    direction: -1, // F方向
  },
  {
    id: 23,
    text: "客観的で公平な判断を心がける",
    dimension: "TF",
    direction: 1,
  },
  {
    id: 24,
    text: "共感力が高く、他人の気持ちがわかる",
    dimension: "TF",
    direction: -1,
  },
  {
    id: 25,
    text: "効率性と合理性を優先する",
    dimension: "TF",
    direction: 1,
  },
  {
    id: 26,
    text: "調和を保つことが重要だと思う",
    dimension: "TF",
    direction: -1,
  },
  {
    id: 27,
    text: "批判的思考が得意だ",
    dimension: "TF",
    direction: 1,
  },
  {
    id: 28,
    text: "人を励ましたりサポートするのが好きだ",
    dimension: "TF",
    direction: -1,
  },
  {
    id: 29,
    text: "原則や規則を重んじる",
    dimension: "TF",
    direction: 1,
  },
  {
    id: 30,
    text: "個人的な価値観を大切にする",
    dimension: "TF",
    direction: -1,
  },

  // J/P（判断 vs 知覚）- 10問
  {
    id: 31,
    text: "計画を立ててから行動する",
    dimension: "JP",
    direction: 1, // J方向
  },
  {
    id: 32,
    text: "柔軟に状況に応じて対応する",
    dimension: "JP",
    direction: -1, // P方向
  },
  {
    id: 33,
    text: "締め切りは早めに終わらせたい",
    dimension: "JP",
    direction: 1,
  },
  {
    id: 34,
    text: "ギリギリまで選択肢を残しておきたい",
    dimension: "JP",
    direction: -1,
  },
  {
    id: 35,
    text: "整理整頓された環境が好きだ",
    dimension: "JP",
    direction: 1,
  },
  {
    id: 36,
    text: "自由で変化のある環境が好きだ",
    dimension: "JP",
    direction: -1,
  },
  {
    id: 37,
    text: "決断を下すのが得意だ",
    dimension: "JP",
    direction: 1,
  },
  {
    id: 38,
    text: "新しい情報を探し続けるのが好きだ",
    dimension: "JP",
    direction: -1,
  },
  {
    id: 39,
    text: "ルーティンや習慣を大切にする",
    dimension: "JP",
    direction: 1,
  },
  {
    id: 40,
    text: "即興や自発性を楽しむ",
    dimension: "JP",
    direction: -1,
  },
];

export const likertScale = [
  { value: 1, label: "全く当てはまらない" },
  { value: 2, label: "あまり当てはまらない" },
  { value: 3, label: "どちらともいえない" },
  { value: 4, label: "やや当てはまる" },
  { value: 5, label: "とても当てはまる" },
];
