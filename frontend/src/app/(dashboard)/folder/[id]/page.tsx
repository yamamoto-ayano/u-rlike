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

// カスタムエッジの型定義
interface CustomEdgeData extends Edge<Record<string, unknown>, string | undefined> {
    onDelete?: (id: string) => void
    onUpdateMemo?: (id: string, memo: string) => void
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

  // メモの初期値を取得
  const [memoText, setMemoText] = useState<string>(typeof data?.memo === 'string' ? data.memo : '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 高さをテキストに応じて調整
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [memoText])

  // メモの変更をハンドルする関数
  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemoText(e.target.value)
    if (data?.onUpdateMemo) {
      (data.onUpdateMemo as (id: string, memo: string) => void)(id, e.target.value)
    }
  }

  // メモの変更をAPIへ送信する関数
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
        markerEnd="url(#arrowhead)" // 矢印の方向をターゲットノードに向ける
      />

      {/* メモと削除ボタンを表示 */}
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
                (data?.onDelete as (id: string) => void)?.(id)
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
              
        {/* 矢印の定義 */}
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

// テスト用のURLカードデータ
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

// フォルダ詳細ページ
// フォルダのURLを取得して、URLカードを表示するページ
export default function FolderDetailPage() {
  const { id } = useParams()
  const [likedItems, setLikedItems] = useState(sampleLikedItems)
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)

  // 初期データを取得
  useEffect(() => {
    fetch(`/api/folders/${id}/graph`)
      .then((res) => res.json())
      .then((data) => {
        const fetchedNodes = data.nodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            draggable: true,
          },
        }))
        const fetchedEdges = data.edges.map((edge: any) => ({
          ...edge,
          type: 'custom-edge',
        }))
        setNodes(fetchedNodes)
        setEdges(fetchedEdges)
      })
      .catch((err) => console.error('Error fetching graph data:', err))
  }, [id])


  // シェアボタンの処理
  const handleShare = (id: string, platform: 'line' | 'discord') => {
    console.log(`Sharing item ${id} on ${platform}`)
  }

  // ドラッグスタートの処理
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    setDraggedItemId(id)
  }

  // ドロップ処理（ノードの移動など）
  const initialNodes: Node[] = useMemo(
    () =>
      likedItems.map((item, index) => ({
        id: item.id,
        type: 'urlCard',
        position: { x: 100 + index * 250, y: 100 },
        data: {
          ...item,
          onShare: handleShare,
          onDragStart: (e: React.DragEvent) => handleDragStart(e, item.id),
          draggable: true,
        },
      })),
    [likedItems]
  )

  // ノードの初期位置を設定
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

  // ノードとエッジの状態管理
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // ノードの追加処理
  const handleConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        id: `${connection.source}-${connection.target}`, // ユニークなIDを追加
        ...connection,
        type: 'custom-edge',
        data: {}, // 初期データ忘れずに
      };
      setEdges((eds) => addEdge(edge, eds))
    },
    [setEdges]
  )

  // ノードの削除処理
  const nodeTypes = useMemo(
    () => ({
      urlCard: UrlCardNode,
    }),
    []
  )

  // ノード変更時にAPIへ送信
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes)

      // 変更されたノードの位置をバックエンドに送信
      const updatedNodes = changes
        .filter((change: any) => change.type === 'position')
        .map((change: any) => ({
          id: change.id,
          position: change.position,
        }))

      if (updatedNodes.length > 0) {
        fetch(`/api/folders/${id}/nodes/positions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedNodes),
        })
          .then((res) => res.json())
          .then((res) => console.log('Node positions updated:', res))
          .catch((err) => console.error('Error updating node positions:', err))
      }
    },
    [id, onNodesChange]
  )

// エッジ作成時にAPIへ送信
const onConnect = useCallback(
  async (connection: Connection) => {
    const newEdge = {
      ...connection,
      id: `${connection.source}-${connection.target}`, // エッジIDを明示的に設定
      type: 'custom-edge',
      data: {}, // 必要に応じて初期データを設定
    };

    // フロントエンドでエッジを追加
    setEdges((eds) => addEdge({ ...newEdge, type: newEdge.type || 'custom-edge' }, eds));

    try {
      // サーバーに新しいエッジを送信
      const response = await fetch(`/api/folders/${id}/edges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEdge),
      });

      if (!response.ok) {
        throw new Error(`Failed to create edge: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Edge created:', result);
    } catch (err) {
      console.error('Error creating edge:', err);
    }
  },
  [id, setEdges]
);

// エッジ削除時にAPIへ送信
const handleEdgeDelete = useCallback(
  async (edgeId: string) => {
    // フロントエンドでエッジを削除
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));

    try {
      // サーバーに削除リクエストを送信
      const response = await fetch(`/api/folders/${id}/edges/${edgeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete edge: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Edge deleted:', result);
    } catch (err) {
      console.error('Error deleting edge:', err);
    }
  },
  [id, setEdges]
);

  // エッジのカスタムレンダリング
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

  // ノードのドラッグ処理
  return (
    <main className="h-screen w-full p-6">
      <h2 className="text-2xl font-bold mb-6">フォルダ: {id}</h2>

      <div className="h-[80vh] border rounded">
        {/* React Flowのコンポーネント */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.1}
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
