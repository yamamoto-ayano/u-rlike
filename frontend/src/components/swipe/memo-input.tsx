"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface MemoInputProps {
  initialValue?: string
  memo: string
  setMemo: (memo: string) => void
}

export function MemoInput({ initialValue = "", memo, setMemo }: MemoInputProps) {

  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg">
      <Textarea
        placeholder="メモを追加"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="min-h-[80px] bg-white"
      />
    </div>
  )
}

