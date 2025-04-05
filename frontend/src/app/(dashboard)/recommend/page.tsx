"use client"

import { useState } from "react"
import { MemoInput } from "@/components/swipe/memo-input"
import { RecommendationExplanation } from "@/components/swipe/recommendation-explanation"
import { Button } from "@/components/ui/button"
import { Share, Trash2 } from "lucide-react"
import Image from "next/image"

// サンプルデータ
const sampleRecommendation = {
  id: "1",
  title: "今熱い！！ Hono入門で爆速デプロイ🔥",
  url: "https://hono.dev",
  description: `JavaScriptフレームワーク界隈でここ最近 Hono が熱いです。
弊社でもバックエンドFWの一つとしてHonoに注目しています。
Honoは「API開発の効率化」「高速なレスポンス」「軽量な構造」といった特徴があり、特にエッジコンピューティング環境に最適化された次世代のJSフレームワークです。`,
  imageUrl: "/placeholder.svg?height=300&width=600",
  rating: 4,
  explanation: `このコンテンツは、最新のJavaScriptフレームワーク「Hono」に関する入門記事で、以下の理由からおすすめです：

1. トレンド技術の解説：現在注目を集めているエッジコンピューティング向けフレームワークについて学べます
2. 実用的な内容：具体的なデプロイ方法まで解説されており、すぐに実践できる知識が得られます
3. パフォーマンス重視：高速なレスポンスと軽量構造という、現代のWeb開発で重要な要素に焦点を当てています
4. バックエンド開発のトレンド：従来のExpressからの移行についても触れており、技術の変遷を理解できます

あなたの閲覧履歴から、Web開発やフレームワークに関する記事に興味があることが伺えるため、このコンテンツはあなたの関心に合致していると判断しました。`,
  memo: "ここにメモが表示される",
}

export default function RecommendPage() {
  const [recommendation, setRecommendation] = useState(sampleRecommendation)
  const [memo, setMemo] = useState(recommendation.memo)

  const handleSaveMemo = (text: string) => {
    setMemo(text)
    // 実際のアプリではここでメモを保存する処理を行う
  }

  const handleShare = (platform: "line" | "discord") => {
    console.log(`Sharing recommendation on ${platform}`)
    // 実際のアプリではここで共有処理を行う
  }

  return (
    <div className="flex h-full">

        <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-auto">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative aspect-video w-full">
                <Image
                  src={recommendation.imageUrl || "/placeholder.svg"}
                  alt={recommendation.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{recommendation.title}</h2>

                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gray-200 text-xs px-2 py-1 rounded">JavaScript</div>
                  <div className="bg-gray-200 text-xs px-2 py-1 rounded">API</div>
                  <div className="bg-gray-200 text-xs px-2 py-1 rounded">TypeScript</div>
                  <div className="bg-gray-200 text-xs px-2 py-1 rounded">フレームワーク</div>
                  <div className="bg-gray-200 text-xs px-2 py-1 rounded">Hono</div>
                </div>

                <div className="text-gray-700 mb-4 whitespace-pre-line">{recommendation.description}</div>

                <div className="text-sm text-gray-500 mb-6">
                  <p>Hono - Web framework built on Web Standards</p>
                  <p>{recommendation.url}</p>
                </div>

                <MemoInput initialValue={memo} onSave={handleSaveMemo} />

                <div className="flex justify-between mt-6">
                  <Button variant="outline" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    削除
                  </Button>

                  <Button variant="outline" className="gap-2" onClick={() => handleShare("line")}>
                    <Share className="h-4 w-4" />
                    共有
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <RecommendationExplanation rating={recommendation.rating} explanation={recommendation.explanation} />
          </div>
        </main>
      </div>
  )
}

