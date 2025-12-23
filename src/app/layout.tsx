import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '日本語学習アプリ - ことわざ・言い回し',
  description: 'ゲーミフィケーション × AI で楽しく日本語を学ぼう',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}

