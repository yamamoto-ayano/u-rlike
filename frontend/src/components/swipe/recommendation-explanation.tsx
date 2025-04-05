import { Star } from "lucide-react"

interface RecommendationExplanationProps {
  rating: number
  explanation: string
}

export function RecommendationExplanation({ rating, explanation }: RecommendationExplanationProps) {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-inner">
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-6 w-6 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>

      <h3 className="text-2xl font-bold mb-4">要約</h3>

      <div className="text-gray-700">
        <p>{explanation}</p>
      </div>
    </div>
  )
}

