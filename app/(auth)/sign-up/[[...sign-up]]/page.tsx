import { SignUp } from '@clerk/nextjs';

/**
 * サインアップページ
 *
 * Portfolio Wise風のシンプルな登録ページ。
 * Clerk の SignUp コンポーネントを使用して、Google OAuth を含む
 * アカウント作成フローを提供します。
 */
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md px-4">
        {/* Portfolio Wise風のヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personality Platform
          </h1>
          <p className="text-gray-600">
            無料アカウントを作成して、今すぐ診断を始めましょう
          </p>
        </div>

        {/* Clerk SignUp コンポーネント */}
        <SignUp
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
        />

        {/* Portfolio Wise風のフッター */}
        <p className="text-center text-sm text-gray-500 mt-8">
          アカウントをお持ちの場合は、サインインページからログインしてください。
        </p>
      </div>
    </div>
  );
}
