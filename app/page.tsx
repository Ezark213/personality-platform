import Link from "next/link";

/**
 * トップページ（Portfolio Wise風デザイン）
 *
 * Portfolio Wiseのクリーンなデザインを参考に、
 * より大きな余白、読みやすいフォント階層、
 * シンプルなカラーパレットを適用しています。
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Portfolio Wise風のクリーンなデザイン */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              あなたの性格を科学的に分析
              <br />
              <span className="text-primary-600">AIが導く自己理解</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              MBTI、ビッグファイブ、恋愛タイプなど、科学的根拠に基づいた診断テストで、
              あなたの本当の性格を見つけましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
              >
                無料で始める
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition"
              >
                機能を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Portfolio Wise風のカード型レイアウト */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              なぜ Personality Platform？
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              科学的根拠に基づいた診断とAI分析で、あなたの本当の性格を深く理解できます。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                科学的な診断
              </h3>
              <p className="text-gray-600 leading-relaxed">
                MBTI、ビッグファイブなど、心理学に基づいた信頼性の高い診断テストを提供します。
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI分析
              </h3>
              <p className="text-gray-600 leading-relaxed">
                あなたの診断結果をAIが詳しく分析し、パーソナライズされたアドバイスを提供します。
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                統合分析
              </h3>
              <p className="text-gray-600 leading-relaxed">
                複数の診断結果を組み合わせて、より深い自己理解をサポートします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tests Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              利用可能な診断テスト
            </h2>
            <p className="text-lg text-gray-600">
              あなたに合った診断テストを選んで、自己理解を深めましょう。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Test Card 1 */}
            <Link href="/tests/mbti" className="block group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition text-white h-full">
                <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition">
                  MBTI
                </h3>
                <p className="text-sm opacity-90">
                  16タイプ性格診断
                </p>
              </div>
            </Link>

            {/* Test Card 2 */}
            <Link href="/tests/bigfive" className="block group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition text-white h-full">
                <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition">
                  ビッグファイブ
                </h3>
                <p className="text-sm opacity-90">
                  5因子性格診断
                </p>
              </div>
            </Link>

            {/* Test Card 3 */}
            <Link href="/tests/love-type" className="block group">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition text-white h-full">
                <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition">
                  ラブタイプ
                </h3>
                <p className="text-sm opacity-90">
                  恋愛傾向診断
                </p>
              </div>
            </Link>

            {/* Test Card 4 */}
            <Link href="/tests/aptitude" className="block group">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition text-white h-full">
                <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition">
                  適性検査
                </h3>
                <p className="text-sm opacity-90">
                  キャリア診断
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Portfolio Wise風のシンプルなデザイン */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            今すぐ始めよう
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            無料で最初の診断を受けられます。アカウント登録も簡単です。
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition shadow-xl hover:shadow-2xl"
          >
            無料で始める
          </Link>
        </div>
      </section>
    </main>
  );
}
