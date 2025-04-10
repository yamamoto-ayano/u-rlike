'use client'

import { useCallback, useMemo, useState, useRef, useEffect, memo } from 'react'
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
} from '@xyflow/react' // React Flowのインポート
import { UrlCardNode } from '@/components/folder/url-card-node'
import { useParams } from 'next/navigation'
import '@xyflow/react/dist/style.css'
import { UrlCard } from '@/components/folder/url-card'

// カスタムエッジの型定義
interface CustomEdgeData extends Edge<Record<string, unknown>, string | undefined> {
    onDelete?: (id: string) => void
    onUpdateMemo?: (id: string, memo: string) => void
    memo?: string
    folderId?: string
}

// メモ付き削除ボタンカスタムエッジの定義
const CustomEdge = (props: EdgeProps<CustomEdgeData>) => {
  const { id, sourceX, sourceY, targetX, targetY, markerEnd, data } = props
  console.log('CustomEdge data:', props)
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const memo = data?.memo

  // メモの初期値を取得
  const [memoText, setMemoText] = useState<string>(typeof memo === 'string' ? memo : '')
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
    if (data?.folderId) {
      fetch(`http://localhost:8787/bookmarks/${data.folderId}/edges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memo: memoText }),
      })
        .then((res) => res.json())
        .then((res) => console.log('Memo updated:', res))
        .catch((err) => console.error('Error updating memo:', err))
    }
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



// フォルダのURLを取得して、URLカードを表示するページ
export default function FolderDetailPage() {
  const { id } = useParams()
  const [likedItems, setLikedItems] = useState([])
  const [edgeData, setEdgeData] = useEdgesState([])
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const response = await fetch(`http://localhost:8787/bookmarks/${id}`)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setLikedItems(data.data)
        setNodes(data.data.filter((item: any) => {
          return item.positionx
        }).map(((item: any) => {
          return {
            id: item.id,
            type: 'urlCard',
            position: {
              x: item.positionx,
              y: item.positiony,
            },
            data: {
              ...item,
              onShare: handleShare,
              onDragStart: (e: React.DragEvent) => handleDragStart(e, item.id),
              draggable: true,
            },
          }
        }
        )));
        console.log(data.data.filter((item: any) => {
          return item.positionx
        }).map(((item: any) => {
          item.position = {
            x: item.positionx,
            y: item.positiony,
          }
          return item
        }
        )))


        console.log('Fetched liked items:', data.data)

        // フォルダのエッジデータを取得
        const edgeResponse = await fetch(`http://localhost:8787/bookmarks/${id}/edges`)
        if (!edgeResponse.ok) {
          throw new Error('Network response was not ok')
        }
        const edgeData = await edgeResponse.json()
        setEdgeData(edgeData.data)
        setEdges(edgeData.data.map((edge: any) => ({
          id: edge.id,
          source: edge.sourceId,
          target: edge.targetId,
          type: edge.type || 'custom-edge',
          memo: edge.memo,
          data: {
            memo: edge.memo
          }
        })))
        console.log('Fetched edge data:', edgeData.data.map((edge: any) => ({
          id: edge.id,
          source: edge.sourceId,
          target: edge.targetId,
          type: edge.type || 'custom-edge',
          memo: edge.memo,
        })))
        
      } catch (error) {
        console.error('Error fetching liked items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLikedItems()
  }, [])


  // シェアボタンの処理
  const handleShare = (id: string, platform: 'line' | 'discord') => {
    console.log(`Sharing item ${id} on ${platform}`)
  }

  // ドラッグスタートの処理
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id) // ドラッグするアイテムのIDを設定
    setDraggedItemId(id)
  }

  // ドロップ処理（ノードの移動など）
  const initialNodes: Node[] = useMemo(
    () =>
      likedItems.map((item, index) => ({
        id: item.id,
        type: 'urlCard',
        position: { x: 100 + index * 250, y: 100 }, // 初期位置を設定
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
    return edgeData
  }, [likedItems])

  // ノードとエッジの状態管理
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

// ノードの削除処理
const nodeTypes = useMemo(
  () => ({
    urlCard: (nodeProps: any) => (
      <div className="relative group">
        {/* 削除ボタン */}
        <button
          className="absolute top-0 right-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ zIndex: 10 }}
          onClick={() => {
            setNodes((nds) => nds.filter((n) => n.id !== nodeProps.id))
            fetch(`http://localhost:8787/bookmarks/${id}/${nodeProps.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ positionx: null, positiony: null }),
            })
              .then((res) => res.json())
              .then((res) => console.log('Node deleted:', res))
              .catch((err) => console.error('Error deleting node:', err))
          }}
        >
          <img
            src="/images/cancel.svg"
            alt="削除"
            className="w-4 h-4"
          />
        </button>
        <UrlCardNode {...nodeProps} memoFetchAPI={`http://localhost:8787/bookmarks/${id}/${nodeProps.id}`} />
      </div>
    ),
  }),
  [setNodes]
);

  // ノード変更時にAPIへ送信
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes)
      console.log('Node changes:', changes)

      for (const change of changes) {
        if (change.type === 'position') {
          // ノード位置変更時の処理
          fetch(`http://localhost:8787/bookmarks/${id}/${change.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ positionx: change.position.x, positiony: change.position.y }),
          })
            .then((res) => res.json())
            .then((res) => console.log('Node position updated:', res))
            .catch((err) => console.error('Error updating node position:', err))
        }
        if (change.type === 'remove') {
          // ノード削除時の処理
          fetch(`http://localhost:8787/bookmarks/${id}/${change.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ positionx: null, positiony: null }),
          })
            .then((res) => res.json())
            .then((res) => console.log('Node deleted:', res))
            .catch((err) => console.error('Error deleting node:', err))
        }
      }
    },
    [id, onNodesChange]
  )

  const handleEdgesChange = useCallback(
    (changes: any) => {


    },
    [id, onEdgesChange]
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
      const response = await fetch(`http://localhost:8787/bookmarks/${id}/edges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: connection.source,
          target: connection.target,
          id: newEdge.id,
          type: newEdge.type,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to create edge: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Edge created:', result);
    } catch (err) {
      console.error('Error creating edge:', err);
      // エッジを削除する場合は、setEdgesを使ってフロントエンドの状態を戻す
      setEdges((eds) => eds.filter((e) => e.id !== newEdge.id));
    }
  },
  [id, setEdges]
);

  // エッジのカスタムレンダリング
  const edgeTypes = useMemo(
    () => ({
      'custom-edge': (edgeProps: EdgeProps<CustomEdgeData>) => (
        <CustomEdge
          {...edgeProps}
          data={{
            folderId: id,
            
            ...edgeProps.data,
            onDelete: (id_: string) =>
            {
              // APIへ削除リクエスト
              fetch(`http://localhost:8787/bookmarks/${id}/edges/${edgeProps.id}`, {
                method: 'DELETE',
              })
                .then((res) => res.json())
                .then((res) => console.log('Edge deleted:', res))
                .catch((err) => console.error('Error deleting edge:', err))
              setEdges((eds) => eds.filter((e) => e.id !== id_));
            }
          }}
        />
      ),
    }),
    [setEdges]
  )

  if (isLoading) {
    return <div className="text-center">Loading...</div>
  }

  // ノードのドラッグ処理
  return (
    <main className="h-full w-full flex bg-white">  
      {/* 中央のReact Flow */}
      <section className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4">フォルダ: {id}</h2>
        <div
          className="h-[70vh] border rounded bg-white"
          onDragOver={(e) => e.preventDefault()} // ドロップを許可
          // ドロップ時の処理
          onDrop={(e) => {
          const nodeId = e.dataTransfer.getData('text/plain');
          const bounds = e.currentTarget.getBoundingClientRect();
          const position = {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
          }; // ドロップ位置を計算
          setNodes((nds) => [
          ...nds,
      {
        id: nodeId,
        type: 'urlCard',
        position,
        data: likedItems.find((item) => item.id === nodeId) || {},
      },
    ]);
  }}
>
  <ReactFlow
    nodes={nodes}
    edges={edges}
    onNodesChange={handleNodesChange}
    onEdgesChange={handleEdgesChange}
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
      </section>
  
 {/* 右側のカードリスト */}
 <aside
  className="w-50 bg-[#fafafa] border-l px-3 py-4 overflow-y-auto"
  onDragOver={(e) => e.preventDefault()} // ドロップを許可
  onDrop={(e) => {
    const nodeId = e.dataTransfer.getData('text/plain');
    const position = { x: e.clientX - 100, y: e.clientY - 100 }; // ドロップ位置を計算
    fetch(`http://localhost:8787/bookmarks/${id}/${nodeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ positionx: position.x, positiony: position.y }),
    })
      .then((res) => res.json())
      .then((res) => console.log('Node position updated:', res))
      .catch((err) => console.error('Error updating node position:', err))
    setNodes((nds) => [
      ...nds,
      {
        id: nodeId,
        type: 'urlCard',
        position,
        data: likedItems.find((item) => item.id === nodeId) || {},
      },
    ]);
  }}
>
   {/* カードリストのスタイル */}
  {likedItems.map((item) => (
    <div className="h-22 transform scale-65 flex justify-center" key={item.id}>
    <UrlCard
      key={item.id}
      {...item}
      onLike={() => {}}
      draggable={true}
      onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)} // ドラッグ開始時にIDを設定
      className="w-60 h-30"
    />
    </div>
  ))}
</aside>
    </main>
  )
}