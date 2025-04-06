"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { UrlCard } from "@/components/folder/url-card"
import { FolderDropArea } from "@/components/folder/folder-drop-area"

// サンプルデータ
const sampleLikedItems = [
  {
    id: "1",
    title: "camp vol.2 - Figmaデザイン",
    url: "https://www.figma.com/design/UMwkZUoDMvCZj3E9Wz70Ip/camp-vol.2?node-id=95-170&t=DIMraF4L98V4GEbE-0",
    description: "デザインイベントcamp vol.2のFigmaプロジェクト。UIコンポーネントやレイアウトの構成を視覚的に確認可能。",
    imageUrl: "/placeholder.svg?height=96&width=96",
    liked: true,
  },
  {
    id: "2",
    title: "【完全解説】Cloudflare Pages + HonoでWebアプリ公開",
    url: "https://qiita.com/kaiparu/items/88ae7c11fb45b82b447a",
    description: "Cloudflare Pages上にHonoアプリをデプロイする方法を、画像付きでわかりやすく解説。",
    imageUrl: "/placeholder.svg?height=96&width=96",
    liked: true,
  },
  {
    id: "3",
    title: "Supabase + Next.jsでAIチャットアプリを作る",
    url: "https://zenn.dev/yasse/articles/2650d580ae8392",
    description: "SupabaseとNext.jsを用いて、ChatGPT APIを活用したAIチャットアプリを構築するチュートリアル。",
    imageUrl: "/placeholder.svg?height=96&width=96",
    liked: true,
  },
]

type LikeAPI = {
  status: number
  message: string
  data: {
    id: string
    title: string
    url: string
    description: string
    image: string,
    memo: string
  }[]
}

type FolderAPI = {
  status: number
  message: string
  data: {
    id: string
    name: string
    count: number
  }[]
}

const sampleFolders = [
  { id: "folder1", name: "フォルダ" },
  { id: "folder2", name: "HP仕事" },
  { id: "folder3", name: "LiT!" },
]

export default function LikePage() {
  const [likedItems, setLikedItems] = useState<LikeAPI["data"]>([])
  const [folders, setFolders] = useState<FolderAPI["data"]>([])
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const response = await fetch("http://localhost:8787/likes")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setLikedItems(data.data)

        const folderResponse = await fetch("http://localhost:8787/bookmarks")
        if (!folderResponse.ok) {
          throw new Error("Network response was not ok")
        }
        const folderData = await folderResponse.json()
        setFolders(folderData.data)
      } catch (error) {
        console.error("Error fetching liked items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLikedItems()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    )
  }

  const handleLike = (id: string) => {
    setLikedItems((prev) => prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)))
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

    // フォルダにアイテムを移動するAPIリクエストを送信
    fetch(`http://localhost:8787/likes/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((data) => {
        console.log("Item moved successfully:", data)
      })
      .catch((error) => {
        console.error("Error moving item:", error)
      })

    // UIからアイテムを削除（実際のアプリでは必要に応じて調整）
    setLikedItems((prev) => prev.filter((item) => item.id !== itemId))
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
            <h2 className="text-xl font-bold mb-4">いいねしたURL</h2>
            <div>
              {likedItems.map((item) => (
                <UrlCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  url={item.url}
                  description={item.description}
                  image={item.image}
                  liked={true}
                  onLike={handleLike}
                  draggable={true}
                  onDragStart={handleDragStart}
                  memo={item.memo}
                  memoFetchURL={ `http://localhost:8787/likes/${item.id}` }
                />
              ))}
            </div>
          </div>
        </main>
      </div>
  )
}

