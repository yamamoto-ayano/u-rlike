import type { Metadata } from "next";
import "../styles/globals.css";
import { Header } from "@/components/common/header";
import { Sidebar } from "@/components/common/sidebar";
import { Flex } from "@/components/ui/flex";

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
        <body className="h-screen flex flex-col">
          {/* ヘッダー */}
          <Header />
          {/* <Flex> */}
          <div className="flex flex-row h-screen flex-1">
            {/* サイドバー */}
            <Sidebar  />
            {/* ヘッダーとサイドバーの高さ分余白を確保 */}
            <main className="flex-1">{children}</main>
          </div>
          {/* </Flex> */}
        </body>
      </html>
  );
}