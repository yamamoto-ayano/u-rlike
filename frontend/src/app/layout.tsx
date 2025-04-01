import type { Metadata } from "next";
import "../styles/globals.css";
import { Header } from "@/components/common/header";
import { Sidebar } from "@/components/common/sidebar";

export const metadata: Metadata = {
  title: "U'RLike",
  description: "お気に入りのURLを保存して、あなたの好きなものを見つけよう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ja">
        <body className="flex flex-col min-h-screen">
          {/* ヘッダー */}
          <Header />
          {/* サイドバー */}
          <Sidebar  />
          {/* ヘッダーとサイドバーの高さ分余白を確保 */}
          <main className="my-16 flex-1">{children}</main>
        </body>
      </html>
  );
}