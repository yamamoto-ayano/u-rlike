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
        <body className="overflow-hidden">
          <Flex className="flex-col w-full ">
            <Flex className="flex-row w-full">
            <Header/>
            </Flex>
            <Flex className="flex-row w-full">
              <Flex className="flex-row items-start justify-start p-4 "> 
                <Sidebar />
              </Flex>
              <Flex className="w-full">
                {children}
              </Flex>
            </Flex>
          </Flex>
        </body>
      </html>
  );
}