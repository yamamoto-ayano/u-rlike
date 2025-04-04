"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Folder, Plus } from "lucide-react"
import Link from "next/link"

// サンプルデータ
const sampleFolders = [
  { id: "hp-work", name: "HP仕事", count: 4 },
  { id: "lit", name: "LiT!", count: 3 },
  { id: "tech", name: "テクノロジー", count: 7 },
  { id: "recipes", name: "レシピ", count: 5 },
  { id: "travel", name: "旅行", count: 2 },
]

export default function FolderPage() {
  const [folders, setFolders] = useState(sampleFolders)

  return (
    <div className="flex h-screen">

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">フォルダ</h2>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新規フォルダ
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <Link key={folder.id} href={`/folder/${folder.id}`} className="block">
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Folder className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">{folder.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{folder.count}件のアイテム</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
  )
}

