"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { tr } from "framer-motion/client";

interface SwipeCardProps {
  id: string;
  title: string;
  url: string;
  description: string;
  imageUrl: string;
  onSwipe: (direction: "left" | "right" | "up", id: string) => void;
  setBinButton: (value: boolean) => void;
  setSuperlikeButton: (value: boolean) => void;
  setLikeButton: (value: boolean) => void;
}

export function SwipeCard({ id, title, url, description, imageUrl, onSwipe, setBinButton, setSuperlikeButton, setLikeButton }: SwipeCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  const animationFrame = useRef<number | null>(null);

  const updatePosition = () => {
    if (cardRef.current) {
      const absX = Math.abs(offsetX.current);
      const absY = Math.abs(offsetY.current);
      if (isDragging && (absX > 100 || absY > 100)) {
        if (absX > absY) {
          cardRef.current.style.boxShadow =
            offsetX.current > 0
              ? `0 0 20px rgba(255, 75, 75, ${Math.min(absX / 200, 0.8)})`
              : `0 0 20px rgba(156, 163, 175, ${Math.min(absX / 200, 0.8)})`;
              setBinButton(offsetX.current < 0);
              setLikeButton(offsetX.current > 0);
              setSuperlikeButton(false);
        } else if (offsetY.current < 0) {
          cardRef.current.style.boxShadow = `0 0 20px rgba(75, 123, 255, ${Math.min(absY / 200, 0.8)})`;
          setBinButton(false);
          setLikeButton(false);
          setSuperlikeButton(true);
        } else {
          cardRef.current.style.boxShadow =
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
          setBinButton(true);
          setLikeButton(true);
          setSuperlikeButton(true);
        }
      } else {
        cardRef.current.style.boxShadow =
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
        setBinButton(true);
        setLikeButton(true);
        setSuperlikeButton(true);
      }

      cardRef.current.style.transform = `translate(${offsetX.current}px, ${offsetY.current}px) rotate(${
        offsetX.current * 0.15
      }deg)`;
    }
    if (isDragging.current) {
      animationFrame.current = requestAnimationFrame(updatePosition);
    }
  };

  // ---- ポインタイベント ----
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    cardRef.current?.style.setProperty("transition", "none");
    animationFrame.current = requestAnimationFrame(updatePosition);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    offsetX.current = e.clientX - startX.current;
    offsetY.current = e.clientY - startY.current;
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    finishSwipe();
  };

  // ---- タッチイベント ----
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    cardRef.current?.style.setProperty("transition", "none");
    animationFrame.current = requestAnimationFrame(updatePosition);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    offsetX.current = touch.clientX - startX.current;
    offsetY.current = touch.clientY - startY.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    finishSwipe();
  };

  // ---- 共通スワイプ処理 ----
  const finishSwipe = () => {
    isDragging.current = false;

    const absX = Math.abs(offsetX.current);
    const absY = Math.abs(offsetY.current);

    if ((absX > 100 || absY > 100) && !(absY > absX && offsetY.current > 0)) {
      let direction: "left" | "right" | "up" | null = null;
      if (absX > absY) {
        direction = offsetX.current > 0 ? "right" : "left";
      } else if (offsetY.current < 0) {
        direction = "up";
      }

      if (direction) {
        setSwipeDirection(direction);
        onSwipe(direction, id);

        cardRef.current?.style.setProperty("transition", "transform 0.2s ease-out");
        cardRef.current?.style.setProperty(
          "transform",
          `translate(${direction === "right" ? window.innerWidth : direction === "left" ? -window.innerWidth : 0}px, ${
            direction === "up" ? -window.innerHeight : 0
          }px)`
        );

        setTimeout(() => {
          cardRef.current?.style.setProperty("display", "none");
          cardRef.current?.style.setProperty("transform", "translate(0, 0)");
          cardRef.current?.style.setProperty(
            "box-shadow",
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          );
        }, 200);

        setTimeout(() => {
          cardRef.current?.style.setProperty("display", "block");
        }, 300);
      }
    } else {
      cardRef.current?.style.setProperty("transition", "transform 0.2s ease-out");
      cardRef.current?.style.setProperty("transform", "translate(0, 0)");
    }

    offsetX.current = 0;
    offsetY.current = 0;
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
  };

  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => setSwipeDirection(null), 500);
      return () => clearTimeout(timer);
    }
  }, [swipeDirection]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "swipe-card rounded-lg overflow-hidden shadow-lg bg-white transition-all duration-300 w-full select-none touch-none ",
        swipeDirection && `swipe-effect-${swipeDirection}`
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative">
        <div className="relative aspect-video w-full">
          <Image
            src={imageUrl || "/placeholder.svg?height=200&width=400"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="">
            {["JavaScript", "API", "TypeScript", "フレームワーク", "Hono"].map((tag) => (
              <div key={tag} className="bg-gray-200 text-xs px-2 py-1 rounded inline-block ml-1 mt-1">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <p className="text-xs text-gray-500">最終更新日: 2025年02月03日 投稿日: 2024年12月27日</p>
        <a className="text-sm mt-4 block text-blue-900" href={url}>{url}</a>
      </div>
    </div>
  );
}
