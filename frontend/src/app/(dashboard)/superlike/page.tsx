"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { UrlCard } from "@/components/folder/url-card"
import { FolderDropArea } from "@/components/folder/folder-drop-area"

type SuperLikeAPI = {
  status: number
  message: string
  data: {
    id: string
    title: string
    url: string
    description: string
    image: string
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

export default function LikePage() {
  const [superlikedItems, setSuperlikedItems] = useState<SuperLikeAPI["data"]>([])
  const [folders, setFolders] = useState<FolderAPI["data"]>([])
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const response = await fetch("http://localhost:8787/superlikes")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setSuperlikedItems(data.data)

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
                  image={item.image}
                  liked={true}
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

