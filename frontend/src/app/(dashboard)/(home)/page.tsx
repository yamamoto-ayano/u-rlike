"use client"

import { useState } from "react"
import { SwipeCard } from "@/components/swipe/swipe-card"
import { MemoInput } from "@/components/swipe/memo-input"
import { Button } from "@/components/ui/button"
import { Trash2, ThumbsUp, Star } from "lucide-react"
import { HistoryList } from "@/components/swipe/historyList"

// サンプルデータ
const sampleHistoryItems = [
  {
    id: "1",
    title: "今熱い！！ Hono入門で爆速デプロイ🔥",
    url: "https://hono.dev",
    description:
      "JavaScriptフレームワーク界隈でここ最近 Hono が熱いです。弊社でもバックエンドFWの一つとしてHonoに注目しています。",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "React Hooksの基本と応用",
    url: "https://react.dev",
    description: "Reactの関数コンポーネントでステート管理を行うためのHooksについて解説します。",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    title: "Next.js 14の新機能まとめ",
    url: "https://nextjs.org",
    description: "Server Componentsの改善やApp Routerの安定化など、Next.js 14の主要な変更点を紹介します。",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  // 以下、重複データはそのまま
]

export default function Home() {
  const [historyItems, setHistoryItems] = useState(sampleHistoryItems)
  const [memo, setMemo] = useState("")
  const [currentCardNo, setCurrentCardNo] = useState(0)

  // スワイプ処理
  const handleSwipe = (direction: "left" | "right" | "up", id: string) => {
    console.log(`Swiped ${direction} on card ${id}`)

    // 履歴から削除
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));

    // 次のカードに移動
    setCurrentCardNo((prev) => (prev + 1) % 2)

    // 実際のアプリではここでデータを更新する処理を行う
    if (direction === "right") {
      // いいね処理
    } else if (direction === "left") {
      // 削除処理
    } else if (direction === "up") {
      // スーパーライク処理
    }
  }

  


  // メモ保存処理
  const handleSaveMemo = (text: string) => {
    setMemo(text)
    // 実際のアプリではここでメモを保存する処理を行う
  }

  // 現在のカードデータ
  const card0Card = historyItems[currentCardNo]
  const card1Card = historyItems[(1 + currentCardNo) % 2]

  // カードがすべて使い果たされた場合
  const isCard0Visible = !(card0Card === undefined)
  const isCard1Visible = !(card1Card === undefined)

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex flex-col overflow-visible">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 p-4 overflow-auto overflow-visible">
          <div className="flex flex-col items-center">
            <div className="flex-1 relative flex flex-col h-full w-full" style={{ maxWidth: "90vh" }}>
              <div className="swipe-card-container flex-1 relative" style={{ maxHeight: "calc(100vh - 250px)" }}>
                {/* カード0 */}
                {isCard0Visible && (
                  <div
                    className="absolute inset-0 transition-transform duration-300"
                    style={{ transform: "translateX(0)", zIndex: currentCardNo === 0 ? 10 : 0 }}
                  >
                    <SwipeCard
                      id={card0Card.id}
                      title={card0Card.title}
                      url={card0Card.url}
                      description={card0Card.description}
                      imageUrl={card0Card.imageUrl}
                      onSwipe={handleSwipe}
                    />
                  </div>
                )}

                {/* カード1 */}
                {isCard1Visible && (
                  <div
                    className="absolute inset-0 transition-transform duration-300 z-0"
                    style={{ transform: "translateX(0)", zIndex: currentCardNo === 1 ? 10 : 0 }}
                  >
                    <SwipeCard
                      id={card1Card.id}
                      title={card1Card.title}
                      url={card1Card.url}
                      description={card1Card.description}
                      imageUrl={card1Card.imageUrl}
                      onSwipe={handleSwipe}
                    />
                  </div>
                )}
              </div>

              {/* スワイプボタン */}
              {(isCard0Visible || isCard1Visible) && (
                <div className="flex justify-center gap-8 mt-4 mb-4 z-100 bottom-0 right-0 left-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-16 w-16 bg-white shadow-md border-2 border-dislike hover:bg-dislike/10 hover:border-dislike"
                    onClick={() => handleSwipe("left", currentCardNo === 0 ? card0Card.id : card1Card.id)}
                  >
                    <Trash2 className="h-8 w-8 text-dislike" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-16 w-16 bg-white shadow-md border-2 border-superlike hover:bg-superlike/10 hover:border-superlike"
                    onClick={() => handleSwipe("up", currentCardNo === 0 ? card0Card.id : card1Card.id)}
                  >
                    <Star className="h-8 w-8 text-superlike" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-16 w-16 bg-white shadow-md border-2 border-like hover:bg-like/10 hover:border-like"
                    onClick={() => handleSwipe("right", currentCardNo === 0 ? card0Card.id : card1Card.id)}
                  >
                    <ThumbsUp className="h-8 w-8 text-like" />
                  </Button>
                </div>
              )}

              {/* メモ入力 */}
              <div className="mt-2">
                <MemoInput onSave={handleSaveMemo} />
              </div>
            </div>
          </div>

          {/* 履歴 */}
          <HistoryList items={historyItems} />
        </div>
      </div>
    </div>
  )
}