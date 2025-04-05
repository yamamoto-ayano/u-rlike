/*
- POST /histories
    - 履歴をサーバーに追加
    - リクエスト
        - application/json
            
            ```tsx
            {
                url: string,
                title: string,
                description: string,
                image?: string
            }
            ```
            
    - レスポンス
        - application/json
            - 成功時
                
                ```tsx
                {
                    status: 200,
                    message: "add history successful"
                }
                ```
                
- GET /histories
    - 履歴を取得
    - まだチェックしていない、直近の1000件を返す
    - レスポンス
        - application/json
        
        ```tsx
        {
            status: 200,
            message: "get histories successful",
            data: [
                {
                    url: string,
                    title: string,
                    description: string,
                    image?: string
                },
                ...
            ]
        }
        ```
        
- GET /bookmarks
    - ブックマークフォルダの一覧を返す
    - レスポンス
        - application/json
        
        ```tsx
        {
            status: 200,
            message: "get bookmark folder successful",
            data: [
                {
                    id: string,
                    name: string,
                    count: number
                },
                ...
            ]
        }
        ```
        
- POST /bookmarks
    - ブックマークフォルダを作成する
    - リクエスト
        - application/json
        
        ```tsx
        {
            name: string,
            description: string
        }
        ```
        
    - レスポンス
        - application/json
        
        ```tsx
        {
            name: string,
            id: string
        }
        ```
        
- GET /bookmarks/<folder_id>
    - ブックマークフォルダの中身を取得
    - レスポンス
        - application/json
        
        ```tsx
        {
            status: 200,
            message: "get bookmarks23 successful",
            count: number,
            data: [
                {
                    id: string,
                    url: string,
                    title: string,
                    description: string,
                    image?: string,
                    memo: string
                },
                ...
            ]
        }
        ```
        
- POST /bookmarks/<folder_id>
    - ブックマークに追加
    - リクエスト
        - application/json
        
        ```tsx
        
        {
            url: string,
            title: string,
            description: string,
            image?: string
            memo: string
        }
        ```
        
    - レスポンス
        - application/json
        
        ```tsx
        {
            status: 200,
            message: "bookmark successful",
            id: number
        }
        ```
        
- PUT /bookmarks/<folder_id>
    - ブックマークフォルダの編集
    - とりあえず対応は名前か概要の変更のみ
    - リクエスト
        - application/json
        
        ```tsx
        {
            name?: string,
            description?: string
        }
        ```
        
    - レスポンス
        - application/json
        
        ```tsx
        {
            status: 200,
            message: "change bookmark folder successful"
        }
        ```
        
- DELETE /bookmarks/<folder_id>
    - ブックマークフォルダの削除
    - レスポンス
        - application/json
        
        ```tsx
        {
            status: 200,
            message: "delete bookmark folder successful"
        }
        ```
        
- DELETE /bookmarks/<folder_id>/<bookmark_id>
    - ブックマークの削除
    - レスポンス
        - application/json
        
        ```tsx
        {
            status: 200,
            message: "delete bookmark successful"
        }
        ```
        
- PUT /bookmarks/<folder_id>/<bookmark_id>
    - ブックマークの編集
    - メモなどの変更や、ブックマークフォルダの変更
    - リクエスト
        - application/json
        
        ```tsx
        
        {
            image?: string,
            memo?: string,
            folderId?: string
        }
        ```
        
    - レスポンス
        - application/json
        
        ```tsx
        {
            status: 200,
            message: "change bookmark successful",
            id: string
        }
        ```
        
- POST /bookmarks/<folder_id>/edges
    - エッジを作成するエンドポイント(エッジ＝紐付け)
    - リクエスト
        - application/json
        
        ```jsx
        {
            "source": "string",//nodeId自分
            "target": "string",//nodeId相手
            "type": "string", //(custom-edge)
            "memo": "string"
        }
        ```
        
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "add edge successful",
            "id": "string"
        
        ```
        
- GET /bookmarks/<folder_id>/edges
    - エッジの一覧を取得するエンドポイント
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "get edges successful",
            "data": [
                {
                    "id": "string",//(ノードのid)
                    "source": "string",//(伸ばす前の目の紐付けのノード)
                    "target": "string",//(伸ばした後の紐付けのノード)
                    "type": "string",
                    "memo": "string"
                },
                ...
            ]
        }
        ```
        
- PUT /bookmarks/<folder_id>/edges/<edge_id>
    - エッジのメモを編集するエンドポイント
        - リクエスト
        
        ```jsx
        {
            "memo": "string"
        }
        ```
        
        - レスポンス
        
        ```jsx
        {
            "status": 200,
            "message": "update edge successful",
            "id": "string"
        }
        ```
        
- DELETE /bookmarks/<folder_id>/edges/<edge_id>
    - エッジを削除するエンドポイント
        - レスポンス
        
        ```jsx
        {
            "status": 200,
            "message": "delete edge successful"
        }
        ```
*/

import { Hono } from 'hono'
import { cors } from 'hono/cors'

const isCloudflare = typeof globalThis?.WebSocket !== 'function'

const { PrismaClient } = isCloudflare
  ? await import('@prisma/client/edge')
  : await import('@prisma/client')

const prisma = new PrismaClient()
const app = new Hono()

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// 履歴関連のAPIの実装
// 履歴を追加する
app.post('/histories', async (c) => {
  try {
    const { url, title, description, image } = await c.req.json()

    await prisma.history.create({
      data: {
        url,
        title,
        description,
        image,
      }
    })

    return c.json({
      status: 200,
      message: "add history successful"
    })
  } catch (error) {
    console.error('Error adding history:', error)
    return c.json({ status: 500, message: "Failed to add history" }, 500)
  }
})

// 履歴一覧を取得する
app.get('/histories', async (c) => {
  try {
    const histories = await prisma.history.findMany({
      where: {
        checked: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1000
    })

    return c.json({
      status: 200,
      message: "get histories successful",
      data: histories.map(({ id, checked, createdAt, ...rest }) => rest)
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to get histories" }, 500)
  }
})

// ブックマークフォルダのAPIの実装
// フォルダ一覧を取得
app.get('/bookmarks', async (c) => {
  try {
    const folders = await prisma.bookmarkFolder.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })

    return c.json({
      status: 200,
      message: "get bookmark folder successful",
      data: folders.map(({ _count, ...rest }) => ({
        ...rest,
        count: _count.bookmarks
      }))
    })
  }
  catch (error) {
    return c.json({ status: 500, message: "Failed to get bookmark folders" }, 500)
  }
})

// ブックマークフォルダを作成
app.post('/bookmarks', async (c) => {
  try {
    const { name, description } = await c.req.json()

    const folder = await prisma.bookmarkFolder.create({
      data: {
        name,
        description
      },
      select: {
        id: true,
        name: true
      }
    })

    return c.json(folder)
  } catch (error) {
    return c.json({ status: 500, message: "Failed to create bookmark folder" }, 500)
  }
})

// フォルダ内のブックマーク一覧を取得
app.get('bookmarks/:folderId', async (c) => {
  try {
    const folderId = c.req.param('folderId')

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        folderId
      }
    })

    const count = await prisma.bookmark.count({
      where: {
        folderId
      }
    })

    return c.json({
      status: 200,
      message: "get bookmarks successful",
      data: bookmarks,
      count
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to get bookmarks" }, 500)
  }
})

// ブックマークをフォルダに追加
app.post('/bookmarks/:folderId', async (c) => {
  try {
    const folderId = c.req.param('folderId')
    const { url, title, description, image, memo } = await c.req.json()

    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title,
        description,
        image,
        memo,
        folderId
      },
    })

    return c.json({
      status: 200,
      message: "add bookmark successful",
      id: bookmark.id
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to add bookmark" }, 500)
  }
})

app.put('/bookmarks/:folderId', async (c) => {
  try {
    const folderId = c.req.param('folderId')
    const { name, description } = await c.req.json()

    const updateData: any = {}
    if (name) updateData.name = name
    if (description) updateData.description = description

    await prisma.bookmarkFolder.update({
      where: { id: folderId },
      data: updateData
    })

    return c.json({
      status: 200,
      message: "update bookmark folder successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to update bookmark folder" }, 500)
  }
})

// ブックマークフォルダを削除
app.delete('/bookmarks/:folderId', async (c) => {
  try {
    const folderId = c.req.param('folderId')

    await prisma.bookmarkFolder.delete({
      where: { id: folderId }
    })

    return c.json({
      status: 200,
      message: "delete bookmark folder successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to delete bookmark folder" }, 500)
  }
})

// ブックマークを削除
app.delete('/bookmarks/:folderId/:bookmarkId', async (c) => {
  try {
    const bookmarkId = c.req.param('bookmarkId')

    await prisma.bookmark.delete({
      where: { id: bookmarkId }
    })

    return c.json({
      status: 200,
      message: "delete bookmark successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to delete bookmark" }, 500)
  }
})

// ブックマークを編集
app.put('/bookmarks/:folderId/:bookmarkId', async (c) => {
  try {
    const bookmarkId = c.req.param('bookmarkId')
    const { image, memo, folderId } = await c.req.json()

    const updateData: any = { folderId }
    if (image) updateData.image = image
    if (memo) updateData.memo = memo

    const updatedBookmark = await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: updateData
    })

    return c.json({
      status: 200,
      message: "update bookmark successful",
      data: updatedBookmark
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to update bookmark" }, 500)
  }
})

app.post('/bookmarks/:folderId/edges', async (c) => {
  try {
    const folderId = c.req.param('folderId')
    const { source, target, type, memo } = await c.req.json()

    const edge = await prisma.edges.create({
      data: {
        source,
        target,
        type,
        memo,
        folderId
      }
    })

    return c.json({
      status: 200,
      message: "add edge successful",
      id: edge.id
    })
  }
  catch (error) {
    return c.json({ status: 500, message: "Failed to add edge" }, 500)
  }
})

app.get('/bookmarks/:folderId/edges', async (c) => {
  try {
    const folderId = c.req.param('folderId')

    const edges = await prisma.edges.findMany({
      where: {
        folderId
      }
    })

    return c.json({
      status: 200,
      message: "get edges successful",
      data: edges
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to get edges" }, 500)
  }
})

app.put('/bookmarks/:folderId/edges/:edgeId', async (c) => {
  try {
    const edgeId = c.req.param('edgeId')
    const { memo } = await c.req.json()

    const updatedEdge = await prisma.edges.update({
      where: { id: edgeId },
      data: { memo }
    })

    return c.json({
      status: 200,
      message: "update edge successful",
      data: updatedEdge
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to update edge" }, 500)
  }
})

app.delete('/bookmarks/:folderId/edges/:edgeId', async (c) => {
  try {
    const edgeId = c.req.param('edgeId')

    await prisma.edges.delete({
      where: { id: edgeId }
    })

    return c.json({
      status: 200,
      message: "delete edge successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to delete edge" }, 500)
  }
})

export default app
