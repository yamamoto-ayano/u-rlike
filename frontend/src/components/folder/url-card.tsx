"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Share, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface UrlCardProps {
  id: string
  title: string
  url: string
  description: string
  imageUrl: string
  liked?: boolean
  onLike?: (id: string) => void
  onShare?: (id: string, platform: "line" | "discord") => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent, id: string) => void
}

export function UrlCard({
  id,
  title,
  url,
  description,
  imageUrl,
  liked = false,
  onLike,
  onShare,
  draggable = false,
  onDragStart,
}: UrlCardProps) {
  const [isLiked, setIsLiked] = useState(liked)

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (onLike) {
      onLike(id)
    }
  }

  const handleShare = (platform: "line" | "discord") => {
    if (onShare) {
      onShare(id, platform)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (draggable && onDragStart) {
      onDragStart(e, id)
    }
  }

  return (
    <div
      className={`flex gap-4 p-4 border rounded-lg mb-4 bg-white ${draggable ? "draggable-item" : ""}`}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={imageUrl || "/placeholder.svg?height=96&width=96"}
          alt={title}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <p className="text-xs text-gray-500">{url}</p>
      </div>

      <div className="flex flex-col gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Share className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleShare("line")}>LINEで共有</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare("discord")}>Discordで共有</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={handleLike} className={isLiked ? "text-like" : ""}>
          <Heart className={`h-5 w-5 ${isLiked ? "fill-like" : ""}`} />
        </Button>
      </div>
    </div>
  )
}

