import type { Metadata } from "next";
import "../styles/globals.css";
import { Header } from "@/components/common/header";
import { Sidebar } from "@/components/common/sidebar";
import { Flex } from "@/components/ui/flex";
import Head from 'next/head';


import { FolderModalWrapper } from "@/components/common/FolderModalWrapper";
import ClientProviders  from "@/components/common/clientWrapper";

const folderNav = {
  name: "フォルダ",
  path: "/folder",
  isFolder: true,
  subItems: [
    { 
      id : 1,
      name: "HP仕事", 
      path: "/folder/hp-work",
      count: 4,
    },
    {
      id: 2,
      name: "LiT!",
      path: "/folder/lit",
      count: 3,
     },
  ],
};


export const metadata: Metadata = {
  title: "U'RLike",
  description: "お気に入りのURLを保存して、あなたの好きなものを見つけよう！",
  icons: {
    icon: "icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ja">
        <body className="overflow-hidden">
          <ClientProviders>
            <Flex className="flex-col w-full h-dvh">
              <Flex className="flex-row w-full">
              <Header/>
              </Flex>
              <Flex className="flex-row w-full grow-1">
                <Flex className="flex-row items-start justify-start lg:p-4 h-full">
                  <Sidebar />
                </Flex>
                <Flex className="w-full h-full">
                  {children}
                  <FolderModalWrapper />
                </Flex>
              </Flex>
            </Flex>
          </ClientProviders>
        </body>
      </html>
  );
}