'use client'

import { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  getBezierPath,
  EdgeProps,
  Connection,
  Node,
  Edge,
  Controls,
  MiniMap,
} from '@xyflow/react'
import { UrlCardNode } from '@/components/folder/url-card-node'
import { useParams } from 'next/navigation'
import '@xyflow/react/dist/style.css'

interface CustomEdgeData {
    onDelete?: (id: string) => void
    memo?: string
  }  

// メモ付き削除ボタンカスタムエッジの定義
const CustomEdge = (props: EdgeProps<CustomEdgeData>) => {
  const { id, sourceX, sourceY, targetX, targetY, markerEnd, data } = props
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const [memoText, setMemoText] = useState(data?.memo || '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 高さをテキストに応じて調整
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [memoText])

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemoText(e.target.value)
    data?.onUpdateMemo?.(id, e.target.value)
  }

  const handleMemoBlur = () => {
    // APIへ送信例
    fetch(`/api/edges/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memo: memoText }),
    })
      .then((res) => res.json())
      .then((res) => console.log(' Memo updated:', res))
      .catch((err) => console.error(' Error updating memo:', err))
  }

  return (
    <>
      <path
        id={id}
        d={edgePath}
        className="react-flow__edge-path stroke-blue-500"
        markerEnd={markerEnd || 'url(#arrowhead)'}
      />
      <foreignObject
        width={200}
        height={100}
        x={labelX - 100}
        y={labelY - 50}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
            fontSize: 12,
            color: '#333',
            background: 'transparent',
          }}
        >
          <textarea
            ref={textareaRef}
            value={memoText}
            placeholder="メモを入力..."
            onChange={handleMemoChange}
            onBlur={handleMemoBlur}
            rows={1}
            style={{
              width: '100%',
              resize: 'none',
              background: '#ffe5e5',
              border: '1px solid #ccc',
              borderRadius: 12,
              padding: '4px 8px',
              fontSize: 12,
              textAlign: 'center',
              marginBottom: 6,
              overflow: 'hidden',
            }}
          />

          <button
            onClick={() => {
                data?.onDelete?.(id)
            }}
            style={{
              padding: '4px 12px',
              fontSize: 11,
              background: '#e5e5e5',
              color: '#111',
              border: 'none',
              borderRadius: 9999,
              cursor: 'pointer',
            }}
          >
            delete
          </button>
        </div>
      </foreignObject>

      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L10,3.5 L0,7" fill="#3b82f6" />
        </marker>
      </defs>
    </>
  )
}


// sampleLikedItems を使ってノード生成
const sampleLikedItems = [
  {
    id: '1',
    title: 'URLタイトル1',
    url: 'https://example.com/1',
    description: 'メモメモメモメモメモメモメモメモ',
    imageUrl: '/placeholder.svg?height=96&width=96',
    liked: true,
  },
  {
    id: '2',
    title: 'URLタイトル2',
    url: 'https://example.com/2',
    description: 'メモメモメモメモメモメモメモメモ',
    imageUrl: '/placeholder.svg?height=96&width=96',
    liked: true,
  },
  {
    id: '3',
    title: 'URLタイトル3',
    url: 'https://example.com/3',
    description: 'メモメモメモメモメモメモメモメモ',
    imageUrl: '/placeholder.svg?height=96&width=96',
    liked: true,
  },
]

export default function FolderDetailPage() {
  const { id } = useParams()
  const [likedItems, setLikedItems] = useState(sampleLikedItems)
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)

  const handleLike = (itemId: string) => {
    setLikedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, liked: !item.liked } : item
      )
    )
  }

  const handleShare = (id: string, platform: 'line' | 'discord') => {
    console.log(`Sharing item ${id} on ${platform}`)
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    setDraggedItemId(id)
  }

  const initialNodes: Node[] = useMemo(
    () =>
      likedItems.map((item, index) => ({
        id: item.id,
        type: 'urlCard',
        position: { x: 100 + index * 250, y: 100 },
        data: {
          ...item,
          onLike: handleLike,
          onShare: handleShare,
          onDragStart: (e: React.DragEvent) => handleDragStart(e, item.id),
          draggable: true,
        },
      })),
    [likedItems]
  )

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = []
    for (let i = 0; i < likedItems.length - 1; i++) {
      edges.push({
        id: `${likedItems[i].id}->${likedItems[i + 1].id}`,
        type: 'custom-edge',
        source: likedItems[i].id,
        target: likedItems[i + 1].id,
        data: {},
      })
    }
    return edges
  }, [likedItems])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        ...connection,
        type: 'custom-edge',
        data: {}, // 初期データ忘れずに
      }
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges]
  )

  const nodeTypes = useMemo(
    () => ({
      urlCard: UrlCardNode,
    }),
    []
  )

  // ✕ボタン付きエッジの登録：setEdges を渡す
  const edgeTypes = useMemo(
    () => ({
      'custom-edge': (edgeProps: EdgeProps) => (
        <CustomEdge
          {...edgeProps}
          data={{
            ...edgeProps.data,
            onDelete: (id: string) =>
              setEdges((eds) => eds.filter((e) => e.id !== id)),
          }}
        />
      ),
    }),
    [setEdges]
  )

  return (
    <main className="h-screen w-full p-6">
      <h2 className="text-2xl font-bold mb-6">フォルダ: {id}</h2>

      <div className="h-[80vh] border rounded">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          panOnDrag={true}
          zoomOnScroll={true}
        >
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </main>
  )
}
