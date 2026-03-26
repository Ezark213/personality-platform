import { SignIn } from '@clerk/nextjs';

/**
 * サインインページ
 *
 * Portfolio Wise風のシンプルなログインページ。
 * Clerk の SignIn コンポーネントを使用して、Google OAuth を含む
 * 認証フローを提供します。
 */
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md px-4">
        {/* Portfolio Wise風のヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personality Platform
          </h1>
          <p className="text-gray-600">
            アカウントにサインインして、診断結果を保存しましょう
          </p>
        </div>

        {/* Clerk SignIn コンポーネント */}
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
        />

        {/* Portfolio Wise風のフッター */}
        <p className="text-center text-sm text-gray-500 mt-8">
          アカウントをお持ちでない場合は、サインアップページから登録してください。
        </p>
      </div>
    </div>
  );
}
