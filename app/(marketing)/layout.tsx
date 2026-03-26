import { Header } from '@/components/layout/Header';

/**
 * マーケティングレイアウト
 *
 * トップページや公開ページで使用されるレイアウト。
 * Portfolio Wise風のヘッダーを含みます。
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
