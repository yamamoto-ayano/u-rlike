"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SwipeCardProps {
  id: string
  title: string
  url: string
  description: string
  imageUrl: string
  onSwipe: (direction: "left" | "right" | "up", id: string) => void
}

export function SwipeCard({ id, title, url, description, imageUrl, onSwipe }: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setStartY(e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const currentX = e.clientX
    const currentY = e.clientY
    const newOffsetX = currentX - startX
    const newOffsetY = currentY - startY

    setOffsetX(newOffsetX)
    setOffsetY(newOffsetY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const newOffsetX = currentX - startX
    const newOffsetY = currentY - startY

    setOffsetX(newOffsetX)
    setOffsetY(newOffsetY)
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    const absX = Math.abs(offsetX)
    const absY = Math.abs(offsetY)

    if (absX > 80 || absY > 80) {
      if (absX > absY) {
        if (offsetX > 0) {
          setSwipeDirection("right")
          onSwipe("right", id)
        } else {
          setSwipeDirection("left")
          onSwipe("left", id)
        }
      } else {
        if (offsetY < 0) {
          setSwipeDirection("up")
          onSwipe("up", id)
        }
      }
    } else {
      setOffsetX(0)
      setOffsetY(0)
    }

    setIsDragging(false)
  }

  const handleTouchEnd = handleMouseUp

  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => {
        setSwipeDirection(null)
        setOffsetX(0)
        setOffsetY(0)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [swipeDirection])

  return (
    <div
      ref={cardRef}
      className={cn(
        "swipe-card rounded-lg overflow-hidden shadow-lg bg-white transition-all duration-300 w-full",
        swipeDirection === "right" && "swipe-effect-right",
        swipeDirection === "left" && "swipe-effect-left",
        swipeDirection === "up" && "swipe-effect-up",
      )}
      style={{
        transform: isDragging
          ? `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.15}deg)`
          : "translate(0, 0)",
        boxShadow: isDragging
          ? offsetX > 50
            ? `0 0 20px rgba(255, 75, 75, ${Math.min(Math.abs(offsetX) / 200, 0.8)})`
            : offsetX < -50
              ? `0 0 20px rgba(156, 163, 175, ${Math.min(Math.abs(offsetX) / 200, 0.8)})`
              : offsetY < -50
                ? `0 0 20px rgba(75, 123, 255, ${Math.min(Math.abs(offsetY) / 200, 0.8)})`
                : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative">
        <div className="relative aspect-video w-full">
          <Image src={imageUrl || "/placeholder.svg?height=200&width=400"} alt={title} fill className="object-cover" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 text-xs px-2 py-1 rounded">JavaScript</div>
            <div className="bg-gray-200 text-xs px-2 py-1 rounded">API</div>
            <div className="bg-gray-200 text-xs px-2 py-1 rounded">TypeScript</div>
            <div className="bg-gray-200 text-xs px-2 py-1 rounded">フレームワーク</div>
            <div className="bg-gray-200 text-xs px-2 py-1 rounded">Hono</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="text-xs text-gray-500">
          <p>最終更新日: 2025年02月03日 投稿日: 2024年12月27日</p>
        </div>
        <div className="mt-4">
          <p className="text-sm">{url}</p>
        </div>
      </div>
    </div>
  )
}

