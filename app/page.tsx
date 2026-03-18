import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Personality Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            あなたの本当の性格を見つけよう。AIが診断結果を詳しく分析します。
          </p>
          <Link
            href="/tests"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            診断を始める
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-2">科学的な診断</h3>
            <p className="text-gray-600 dark:text-gray-300">
              MBTI、ビッグファイブなど、心理学に基づいた信頼性の高い診断テストを提供
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI分析</h3>
            <p className="text-gray-600 dark:text-gray-300">
              あなたの診断結果をAIが詳しく分析し、パーソナライズされたアドバイスを提供
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">統合分析</h3>
            <p className="text-gray-600 dark:text-gray-300">
              複数の診断結果を組み合わせて、より深い自己理解をサポート
            </p>
          </div>
        </div>

        {/* Available Tests */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">利用可能な診断テスト</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/tests/mbti" className="block">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-white">
                <h3 className="text-2xl font-bold mb-2">MBTI</h3>
                <p className="text-sm opacity-90">16タイプ性格診断</p>
              </div>
            </Link>
            <Link href="/tests/big-five" className="block">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-white">
                <h3 className="text-2xl font-bold mb-2">ビッグファイブ</h3>
                <p className="text-sm opacity-90">5因子性格診断</p>
              </div>
            </Link>
            <Link href="/tests/love-type" className="block">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-white">
                <h3 className="text-2xl font-bold mb-2">ラブタイプ</h3>
                <p className="text-sm opacity-90">恋愛傾向診断</p>
              </div>
            </Link>
            <Link href="/tests/aptitude" className="block">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-white">
                <h3 className="text-2xl font-bold mb-2">適性検査</h3>
                <p className="text-sm opacity-90">キャリア診断</p>
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-4">今すぐ始めよう</h2>
          <p className="text-lg mb-6">無料で最初の診断を受けられます</p>
          <Link
            href="/tests"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            無料で始める
          </Link>
        </div>
      </div>
    </main>
  );
}
