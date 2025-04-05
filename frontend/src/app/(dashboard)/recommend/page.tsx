"use client"

import { useState } from "react"
import { SwipeCard } from "@/components/swipe/swipe-card"
import { MemoInput } from "@/components/swipe/memo-input"
import { Button } from "@/components/ui/button"
import { Trash2, ThumbsUp, Star } from "lucide-react"
import { RecommendationExplanation } from "@/components/swipe/recommendation-explanation"

const sampleRecommendations = [
  {
    id: "1",
    title: "今熱い！！ Hono入門で爆速デプロイ🔥",
    url: "https://hono.dev",
    description:
      "JavaScriptフレームワーク界隈でここ最近 Hono が熱いです。弊社でもバックエンドFWの一つとしてHonoに注目しています。",
    imageUrl: "/placeholder.svg?height=300&width=600",
    rating: 4,
    explanation: `このコンテンツは、最新のJavaScriptフレームワーク「Hono」に関する入門記事で、以下の理由からおすすめです：

1. トレンド技術の解説  
2. 実用的なデプロイ情報  
3. 高速・軽量な設計思想  
4. Expressからの移行も視野に入れた比較`,
  },
  {
    id: "2",
    title: "Prisma ORMを使った型安全なデータ操作",
    url: "https://www.prisma.io/docs/orm?utm_source=hono&utm_medium=website&utm_campaign=workers",
    description:
      "Prismaを使うことで型安全にデータベースとやりとりでき、開発効率も向上します。",
    imageUrl: "/placeholder.svg?height=300&width=600",
    rating: 5,
    explanation: `このPrisma公式ドキュメントでは、以下の理由からおすすめできます：

1. 型安全なORMの実現方法を丁寧に解説  
2. TypeScriptとの親和性が高い  
3. 実例コードが豊富で理解しやすい`,
  },
  {
    id: "3",
    title: "Hono × Prisma × Postgres 実践例",
    url: "https://hono.dev/examples/prisma#using-prisma-postgres",
    description:
      "HonoでPrismaとPostgresを組み合わせた実用的なサンプルコードを紹介しています。",
    imageUrl: "/placeholder.svg?height=300&width=600",
    rating: 4,
    explanation: `このチュートリアルでは、Hono × Prisma × Postgres の連携について以下のポイントでおすすめです：

1. HonoとPrismaの連携方法を具体例で解説  
2. 実際のAPI実装までの流れがわかる  
3. 軽量で高速なスタック構成を体験できる`,
  },
]

export default function RecommendationPage() {
  // カードデータはスワイプ時に除外するため、配列の状態として管理
  const [recommendations, setRecommendations] = useState(sampleRecommendations)
  // Home のコードと同様、2枚のカードを交互に再利用する
  const [currentCardNo, setCurrentCardNo] = useState(0)
  const [memo, setMemo] = useState("")

  // 各ボタンの表示制御用
  const [binButton, setBinButton] = useState(true)
  const [superlikeButton, setSuperlikeButton] = useState(true)
  const [likeButton, setLikeButton] = useState(true)

  // 2枚のカードを交互に表示（存在しない場合は undefined になるので、下で表示制御）
  const card0Card = recommendations[currentCardNo]
  const card1Card = recommendations[(currentCardNo + 1) % 2]

  const isCard0Visible = card0Card !== undefined
  const isCard1Visible = card1Card !== undefined

  // 現在、最前面に表示されるカード（currentCardNo に対応）
  const currentCardForPanel = currentCardNo === 0 ? card0Card : card1Card

  const handleSwipe = (direction: "left" | "right" | "up", id: string) => {
    console.log(`Swiped ${direction} on card ${id}`)
    // 除外することで次のカードが下に見える演出
    setRecommendations((prev) => prev.filter((item) => item.id !== id))
    // 交互のカード表示用に更新（配列の残りが2枚未満の場合も考慮）
    setCurrentCardNo((prev) => (prev + 1) % 2)
    // ボタン表示をリセット
    setBinButton(true)
    setSuperlikeButton(true)
    setLikeButton(true)
  }

  const handleSaveMemo = (text: string) => {
    setMemo(text)
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex flex-col overflow-visible">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 p-4 overflow-auto">
          {/* 左：カードエリア */}
          <div className="flex flex-col items-center">
            <div className="flex-1 relative flex flex-col h-full w-full" style={{ maxWidth: "90vh" }}>
              <div
                className="swipe-card-container flex-1 relative"
                style={{ maxHeight: "calc(100vh - 250px)" }}
              >
                {/* カード0 */}
                {isCard0Visible && (
                  <div
                    className="absolute inset-0 transition-transform duration-300"
                    style={{ transform: "translateX(0)", zIndex: currentCardNo === 0 ? 100 : 90 }}
                  >
                    <SwipeCard
                      id={card0Card.id}
                      title={card0Card.title}
                      url={card0Card.url}
                      description={card0Card.description}
                      imageUrl={card0Card.imageUrl}
                      onSwipe={handleSwipe}
                      setBinButton={setBinButton}
                      setSuperlikeButton={setSuperlikeButton}
                      setLikeButton={setLikeButton}
                    />
                  </div>
                )}

                {/* カード1 */}
                {isCard1Visible && (
                  <div
                    className="absolute inset-0 transition-transform duration-300"
                    style={{ transform: "translateX(0)", zIndex: currentCardNo === 1 ? 100 : 90 }}
                  >
                    <SwipeCard
                      id={card1Card.id}
                      title={card1Card.title}
                      url={card1Card.url}
                      description={card1Card.description}
                      imageUrl={card1Card.imageUrl}
                      onSwipe={handleSwipe}
                      setBinButton={setBinButton}
                      setSuperlikeButton={setSuperlikeButton}
                      setLikeButton={setLikeButton}
                    />
                  </div>
                )}
              </div>

              {/* スワイプボタン */}
              {(isCard0Visible || isCard1Visible) && (
                <div className="flex justify-center gap-8 mt-4 mb-4 z-100">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-16 w-16 bg-white shadow-md border-2 border-dislike hover:bg-dislike/10 hover:border-dislike"
                    onClick={() =>
                      handleSwipe("left", currentCardNo === 0 ? card0Card.id : card1Card.id)
                    }
                    style={{ visibility: binButton ? "visible" : "hidden" }}
                  >
                    <Trash2 className="h-8 w-8 text-dislike" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-16 w-16 bg-white shadow-md border-2 border-superlike hover:bg-superlike/10 hover:border-superlike"
                    onClick={() =>
                      handleSwipe("up", currentCardNo === 0 ? card0Card.id : card1Card.id)
                    }
                    style={{ visibility: superlikeButton ? "visible" : "hidden" }}
                  >
                    <Star className="h-8 w-8 text-superlike" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-16 w-16 bg-white shadow-md border-2 border-like hover:bg-like/10 hover:border-like"
                    onClick={() =>
                      handleSwipe("right", currentCardNo === 0 ? card0Card.id : card1Card.id)
                    }
                    style={{ visibility: likeButton ? "visible" : "hidden" }}
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

          {/* 右：おすすめ理由パネル（スマホ未満では非表示、Homeの履歴と同サイズ） */}
          {(isCard0Visible || isCard1Visible) && currentCardForPanel && (
            <div className="hidden md:block overflow-auto max-h-[calc(100vh-4rem)] p-2 rounded-lg ">
              <RecommendationExplanation
                rating={currentCardForPanel.rating}
                explanation={currentCardForPanel.explanation}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
