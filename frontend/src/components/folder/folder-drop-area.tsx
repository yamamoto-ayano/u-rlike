"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Folder } from "lucide-react"

interface FolderDropAreaProps {
  id: string
  name: string
  onDrop: (folderId: string, itemId: string) => void
}

export function FolderDropArea({ id, name, onDrop }: FolderDropAreaProps) {
  const [isActive, setIsActive] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsActive(true)
  }

  const handleDragLeave = () => {
    setIsActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsActive(false)
    console.log("!!!!!!!!!!")

    const itemId = e.dataTransfer.getData("text/plain")
    if (itemId) {
      onDrop(id, itemId)
    }
  }

  return (
    <div
      className={cn("p-4 border rounded-lg mb-2 droppable-area", isActive && "active")}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2">
        <Folder className="h-5 w-5" />
        <span>{name}</span>
      </div>
    </div>
  )
}

