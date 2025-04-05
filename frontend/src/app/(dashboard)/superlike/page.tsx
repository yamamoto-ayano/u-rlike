"use client"

import type React from "react"
import { useState } from "react"
import { UrlCard } from "@/components/folder/url-card"
import { FolderDropArea } from "@/components/folder/folder-drop-area"

// サンプルデータ
const sampleSuperlikedItems = [
  {
    id: "1",
    title: "Next.js 14の新機能まとめ",
    url: "https://nextjs.org",
    description: "Server Componentsの改善やApp Routerの安定化など、Next.js 14の主要な変更点を紹介します。",
    imageUrl: "/placeholder.svg?height=96&width=96",
    liked: true,
  },
  {
    id: "2",
    title: "TypeScriptの高度な型システム入門",
    url: "https://typescript-jp.dev",
    description: "条件型、マップ型、テンプレートリテラル型など、TypeScriptの高度な型機能について解説します。",
    imageUrl: "/placeholder.svg?height=96&width=96",
    liked: true,
  },
  {
    id: "3",
    title: "React Server Componentsとは何か",
    url: "https://react.dev/blog/server-components",
    description: "Reactの新しいパラダイム、Server Componentsの概念と実装方法について詳しく解説します。",
    imageUrl: "/placeholder.svg?height=96&width=96",
    liked: true,
  },
]

const sampleFolders = [
  { id: "folder1", name: "フォルダ" },
  { id: "folder2", name: "HP仕事" },
  { id: "folder3", name: "LiT!" },
]

export default function SuperlikePage() {
  const [superlikedItems, setSuperlikedItems] = useState(sampleSuperlikedItems)
  const [folders, setFolders] = useState(sampleFolders)
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)

  const handleLike = (id: string) => {
    setSuperlikedItems((prev) => prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)))
  }

  const handleShare = (id: string, platform: "line" | "discord") => {
    console.log(`Sharing item ${id} on ${platform}`)
    // 実際のアプリではここで共有処理を行う
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id)
    setDraggedItemId(id)
  }

  const handleDrop = (folderId: string, itemId: string) => {
    console.log(`Moving item ${itemId} to folder ${folderId}`)
    // 実際のアプリではここでアイテムをフォルダに移動する処理を行う

    // UIからアイテムを削除（実際のアプリでは必要に応じて調整）
    setSuperlikedItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  return (
    <div className="flex h-full w-full">

        <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-auto">
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-4">フォルダ</h2>
            <div className="space-y-2">
              {folders.map((folder) => (
                <FolderDropArea key={folder.id} id={folder.id} name={folder.name} onDrop={handleDrop} />
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">スーパーライクしたURL</h2>
            <div>
              {superlikedItems.map((item) => (
                <UrlCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  url={item.url}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  liked={item.liked}
                  onLike={handleLike}
                  draggable={true}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
  )
}

