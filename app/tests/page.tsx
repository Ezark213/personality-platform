import Link from "next/link";

const tests = [
  {
    id: "mbti",
    title: "MBTI診断",
    description: "16タイプ性格診断で、あなたの性格タイプを発見",
    longDescription: "外向型/内向型、感覚型/直観型、思考型/感情型、判断型/知覚型の4つの軸から、あなたの性格を16タイプに分類します。",
    color: "from-purple-500 to-pink-500",
    icon: "🧠",
    questions: 40,
    duration: "約10分",
    status: "available"
  },
  {
    id: "bigfive",
    title: "ビッグファイブ診断",
    description: "5つの性格因子であなたを分析",
    longDescription: "開放性、誠実性、外向性、協調性、神経症傾向の5つの因子から、あなたの性格を科学的に分析します。",
    color: "from-blue-500 to-cyan-500",
    icon: "📊",
    questions: 20,
    duration: "約5分",
    status: "available"
  },
  {
    id: "love-type",
    title: "ラブタイプ診断",
    description: "あなたの恋愛傾向を徹底分析",
    longDescription: "恋愛におけるあなたの行動パターン、コミュニケーションスタイル、相性の良いタイプを診断します。",
    color: "from-red-500 to-orange-500",
    icon: "💕",
    questions: 20,
    duration: "約5分",
    status: "available"
  },
  {
    id: "aptitude",
    title: "適性検査",
    description: "あなたに最適なキャリアパスを提案",
    longDescription: "興味、能力、価値観から、あなたに合った職業や働き方を診断します。",
    color: "from-green-500 to-teal-500",
    icon: "💼",
    questions: 20,
    duration: "約5分",
    status: "available"
  }
];

export default function TestsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">診断テスト一覧</h1>
          <p className="text-gray-600 dark:text-gray-300">
            科学的根拠に基づいた性格診断で、自己理解を深めましょう
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
            >
              <div className={`bg-gradient-to-r ${test.color} p-6 text-white`}>
                <div className="text-5xl mb-2">{test.icon}</div>
                <h2 className="text-2xl font-bold mb-1">{test.title}</h2>
                <p className="text-sm opacity-90">{test.description}</p>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {test.longDescription}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <span>📝 {test.questions}問</span>
                  <span>⏱️ {test.duration}</span>
                </div>

                {test.status === "available" ? (
                  <Link
                    href={`/tests/${test.id}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300"
                  >
                    診断を開始
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
                  >
                    近日公開
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
          >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
