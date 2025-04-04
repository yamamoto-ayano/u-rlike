// components/folder/url-card-node.tsx
import { Handle, Position } from '@xyflow/react'
import { UrlCard } from './url-card'

export function UrlCardNode({ data }: { data: any }) {
  return (
    <div className="relative">
      {/* 上からの接続を受け付ける */}
      <Handle type="target" position={Position.Top} style={{ width: 15, height: 15 }} />

      {/* 通常の UrlCard を描画 */}
      <UrlCard {...data} />

      {/* 下への接続を出力する */}
      <Handle type="source" position={Position.Bottom} style={{ width: 15, height: 15 }}/>
    </div>
  )
}