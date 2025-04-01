"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface MemoInputProps {
  initialValue?: string
  onSave?: (memo: string) => void
}

export function MemoInput({ initialValue = "", onSave }: MemoInputProps) {
  const [memo, setMemo] = useState(initialValue)

  const handleSave = () => {
    if (onSave) {
      onSave(memo)
    }
  }

  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg">
      <Textarea
        placeholder="メモを追加"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="min-h-[80px] bg-white"
      />
      {onSave && (
        <div className="mt-2 flex justify-end">
          <Button onClick={handleSave}>保存</Button>
        </div>
      )}
    </div>
  )
}

