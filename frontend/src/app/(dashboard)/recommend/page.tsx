"use client"

import { useEffect, useState } from "react"
import { SwipeCard } from "@/components/swipe/swipe-card"
import { MemoInput } from "@/components/swipe/memo-input"
import { Button } from "@/components/ui/button"
import { Trash2, ThumbsUp, Star } from "lucide-react"
import { RecommendationExplanation } from "@/components/swipe/recommendation-explanation"
import { image } from "framer-motion/client"

type RecommendationItem = {
  id: string
  title: string
  url: string
  description: string
  image: string // 画像URLを追加
  rating: number
  explanation: string
}

export default function RecommendationPage() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [currentCardNo, setCurrentCardNo] = useState(0)
  const [memo, setMemo] = useState("")

  const [binButton, setBinButton] = useState(true)
  const [superlikeButton, setSuperlikeButton] = useState(true)
  const [likeButton, setLikeButton] = useState(true)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("http://localhost:8787/recommendations")
        if (!res.ok) throw new Error("Failed to fetch recommendations")
        const json = await res.json()

        const enrichedData = json.data.map((item: any) => ({
          ...item,
          imagea : "https://example.com/default-image.jpg", // デフォルト画像を指定
        }))
        setRecommendations(enrichedData)
      } catch (err) {
        console.error("Error fetching recommendations:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const card0Card = recommendations[currentCardNo]
  const card1Card = recommendations[(currentCardNo + 1) % 2]

  const isCard0Visible = card0Card !== undefined
  const isCard1Visible = card1Card !== undefined

  const currentCardForPanel = currentCardNo === 0 ? card0Card : card1Card

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">あなたへのおすすめを選定中...</div>
  }

  const handleSwipe = (direction: "left" | "right" | "up", id: string) => {
    console.log(`Swiped ${direction} on card ${id}`)

    if (direction === "right" || direction === "up") {
      const item = recommendations[currentCardNo]

      fetch(`http://localhost:8787/${direction === "right" ? "likes" : "superlikes"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: item.title,
          url: item.url,
          description: item.description,
          image: item.image,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok")
          return response.json()
        })
        .then((data) => {
          console.log("Swiped item:", data)
        })
        .catch((error) => {
          console.error("Error swiping item:", error)
        })
    }

    // カードを除外し次へ進める
    setRecommendations((prev) => prev.filter((item) => item.id !== id))
    setCurrentCardNo((prev) => (prev + 1) % 2)
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
          <div className="flex flex-col items-center">
            <div className="flex-1 relative flex flex-col h-full w-full" style={{ maxWidth: "90vh" }}>
              <div
                className="swipe-card-container flex-1 relative"
                style={{ maxHeight: "calc(100vh - 250px)" }}
              >
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
                      imageUrl={card0Card.image}
                      onSwipe={handleSwipe}
                      setBinButton={setBinButton}
                      setSuperlikeButton={setSuperlikeButton}
                      setLikeButton={setLikeButton}
                    />
                  </div>
                )}

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
                      imageUrl={card1Card.image}
                      onSwipe={handleSwipe}
                      setBinButton={setBinButton}
                      setSuperlikeButton={setSuperlikeButton}
                      setLikeButton={setLikeButton}
                    />
                  </div>
                )}
              </div>

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

              <div className="mt-2">
                <MemoInput onSave={handleSaveMemo} />
              </div>
            </div>
          </div>

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
