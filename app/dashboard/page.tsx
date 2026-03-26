import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * ダッシュボードページ（保護されたページ）
 *
 * 認証されたユーザーのみがアクセスできます。
 * middleware.ts で保護されており、未認証ユーザーは自動的に
 * /sign-in にリダイレクトされます。
 */
export default async function DashboardPage() {
  const { userId } = await auth();

  // 認証チェック（middleware で保護されているため、通常は不要ですが念のため）
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">
          ダッシュボード
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 mb-4">
            ようこそ！あなたのダッシュボードです。
          </p>
          <p className="text-gray-600 mb-6">
            ここでは、過去の診断結果を確認したり、新しい診断を開始したりできます。
          </p>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">利用可能な診断</h2>
            <ul className="space-y-2 text-gray-700">
              <li>📊 ビッグファイブ性格診断</li>
              <li>💕 ラブタイプ診断</li>
              <li>🎯 適性検査</li>
              <li>🧠 MBTI診断</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
