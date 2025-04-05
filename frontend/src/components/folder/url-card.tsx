"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Share, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UrlCardProps {
  id: string
  title: string
  url: string
  description: string
  image: string
  liked?: boolean
  onLike?: (id: string) => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent, id: string) => void
  className?: string
}

export function UrlCard({
  id,
  title,
  url,
  description,
  image,
  liked = false,
  onLike,
  draggable = false,
  onDragStart,
  className,
}: UrlCardProps) {
  const [isLiked, setIsLiked] = useState(liked)

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (onLike) {
      onLike(id)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (draggable && onDragStart) {
      onDragStart(e, id)
    }
  }

  const handleWebShare = async () => {
    const shareData = {
      title,
      text: description,
      url,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error("共有に失敗しました:", err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${title} - ${url}`)
        alert("共有できないブラウザのため、リンクをコピーしました！")
      } catch (err) {
        alert("クリップボードへのコピーに失敗しました。")
      }
    }
  }

  const handleShareLine = () => {
    const message = `${title}\n${description}\n${url}`
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`
    window.open(lineUrl, "_blank")
  }
  

  return (
    <div
      className={`flex gap-4 p-4 border rounded-lg mb-4 bg-white ${className ?? ""} ${
        draggable ? "draggable-item" : ""
      }`}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={image || "/placeholder.svg?height=96&width=96"}
          alt={title}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <h3 className="text-xl font-bold mb-1 truncate">{title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
        <p className="text-xs text-gray-500 truncate">{url}</p>
      </div>

      <div className="flex flex-col gap-2 items-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="共有">
              <Share className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleWebShare}>共有する</DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareLine }>LINEに送る</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLike}
          className={isLiked ? "text-like" : ""}
          aria-label="いいね"
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-like" : ""}`} />
        </Button>
      </div>
    </div>
  )
}
