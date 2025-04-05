// components/swipe/history-list.tsx
"use client"

import Image from "next/image"

type HistoryItem = {
  id: string
  title: string
  url: string
  description: string
  imageUrl: string
}

type HistoryListProps = {
    items: HistoryItem[]
  }

export const HistoryList = ({ items }: HistoryListProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-auto" style={{ height: "calc(100vh - 250px)", marginBottom: "16px" }}>
        <h2 className="text-2xl font-bold mb-4">履歴</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div 
                key={item.id}  
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
               
            >
              <Image
                src={`https://www.google.com/s2/favicons?sz=64&domain_url=${item.url}`}
                alt="favicon"
                className="w-6 h-6"
              />
              <div className="flex-1 truncate">
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-gray-500 ml-2">{new URL(item.url).hostname}</span>
              </div>
            </div>
          ))}
        </div>
    </div>
        

  )
}
