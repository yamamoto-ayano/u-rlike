// src/routes/recommendations.ts
import { Hono } from "hono"
import { OpenAI } from "openai"
// src/index.ts などのルートで追加
import { cors } from "hono/cors"

const recommendationRoute = new Hono()

const OPENAI_API_KEY = "" // ← process.env じゃなくて直接使う

console.log(OPENAI_API_KEY)  // .envから読み込まれていればここで表示される

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

recommendationRoute.get("/recommendations", async (c) => {
  const prompt = `
あなたはおすすめコンテンツを提供するAIです。
以下の形式で8件のhttps://qiita.com/で上位のwebサイトをJSON配列で出力してください（日本語）：

[
  {
    "id": "uuid",
    "title": "タイトル",
    "url": "https://qiita.com/...",
    "description": "簡単な説明",
    "image": "描画しなくていい",
    "rating": 数値（1〜5で評価して）,
    "explanation": "なぜおすすめなのか理由を2文で"
  },
  ...
]
JSONのみを返してください。
`

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  })

  try {
    const rawText = completion.choices[0].message.content || "[]"
    const data = JSON.parse(rawText)
    return c.json({ data })
  } catch (e) {
    return c.json({ error: "Failed to parse ChatGPT response" }, 500)
  }
})

export default recommendationRoute
