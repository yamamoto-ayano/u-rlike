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
            "source": string,//nodeId自分
            "target": string,//nodeId相手
            "type": string, //(custom-edge)
            "memo": string
        }
        ```
        
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "add edge successful",
            "id": string
        
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
                    "id": string,//(ノードのid)
                    "source": string,//(伸ばす前の目の紐付けのノード)
                    "target": string,//(伸ばした後の紐付けのノード)
                    "type": string,
                    "memo": string
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
            "memo": string
        }
        ```
        
        - レスポンス
        
        ```jsx
        {
            "status": 200,
            "message": "update edge successful",
            "id": string
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
- GET /likes
    - いいねした履歴を取得するエンドポイント
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "get likes successful",
            "data": [
                {
                    "id": string,
                    "url": string,
                    "title": string,
                    "description": string,
                    "image": string,
                    "memo": string
                },
                ...
            ]
        }
        ```
- POST /likes
    - いいねを追加するエンドポイント
    - リクエスト
        - application/json
        
        ```jsx
        {
            "url": string,
            "title": string,
            "description": string,
            "image": string,
            "memo": string
        }
        ```
        
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "add like successful"
        }
        ```
- DELETE /likes/<like_id>
    - いいねを削除するエンドポイント
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "delete like successful"
        }
        ```
- PUT /likes/<like_id>
    - いいねのメモを編集したり、ブックマークに追加したりするエンドポイント
    - リクエスト
        - application/json
        
        ```jsx
        {
            "memo"?: string,
            "folderId"?: string
        }
        ```
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "update like successful"
        }
        ```
- GET /likes/<like_id>
    - いいねの詳細を取得するエンドポイント
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "get like successful",
            "data": {
                "id": string,
                "url": string,
                "title": string,
                "description": string,
                "image": string,
                "memo": string
            }
        }
        ```
- GET /superlikes
    - スーパいいねした履歴を取得するエンドポイント
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "get superlikes successful",
            "data": [
                {
                    "id": string,
                    "url": string,
                    "title": string,
                    "description": string,
                    "image": string,
                    "memo": string
                },
                ...
            ]
        }
        ```
- POST /superlikes
    - スーパいいねを追加するエンドポイント
    - リクエスト
        - application/json
        
        ```jsx
        {
            "url": string,
            "title": string,
            "description": string,
            "image": string,
            "memo": string
        }
        ```
        
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "add superlike successful"
        }
        ```
- DELETE /superlikes/<superlike_id>
    - スーパいいねを削除するエンドポイント
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "delete superlike successful"
        }
        ```
- PUT /superlikes/<superlike_id>
    - スーパいいねのメモを編集したり、ブックマークに追加したりするエンドポイント
    - リクエスト
        - application/json
        
        ```jsx
        {
            "memo"?: string,
            "folderId"?: string
        }
        ```
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "update superlike successful"
        }
        ```
GET /superlikes/<superlike_id>
    - スーパいいねの詳細を取得するエンドポイント
    - レスポンス
        - application/json
        
        ```jsx
        {
            "status": 200,
            "message": "get superlike successful",
            "data": {
                "id": string,
                "url": string,
                "title": string,
                "description": string,
                "image": string,
                "memo": string
            }
        }
        ```

*/

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { z } from 'zod'
import * as bcrypt from 'bcrypt'
import * as JWT from 'jsonwebtoken'

// 環境変数
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret'
const JWT_EXPIRES_IN = '1h'

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

// ユーザー登録スキーマ
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8)
})

// ログインスキーマ
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8)
})

// JWTミドルウェア
const jwtMiddleware = jwt({
  secret: JWT_SECRET
})

app.use('/api/protected/*', jwtMiddleware)

app.post('/auth/register', async (c) => {
  try {
    const body = await c.req.json

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return c.json({ error: 'Invalid input', details: result.error.format() }, 400)
    }

    const { username, email, password } = result.data

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        authType: 'local'
      }
    })

    const { password: _, ...userWithoutPassword } = user

    return c.json({
      message: 'User registered successfully',
      user: userWithoutPassword
    }, 201)
  } catch (error) {
    console.error('Error registering user:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.post('/auth/login', async (c) => {
  try {
    const body = await c.req.json()

    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return c.json({ error: 'Invalid input', details: result.error.format() }, 400)
    }

    const { username, password } = result.data

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    if (user.authType !== 'local') {
      return c.json({ error: 'This account uses a different authentication method' }, 400)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return c.json({ error: 'Invalid password' }, 401)
    }

    // JWTトークン生成
    // ★拡張性のポイント: OAuthと互換性のあるペイロード構造
    const token = JWT.sign(
      { 
        sub: user.id,
        username: user.username,
        email: user.email,
        // scopeフィールドを追加し、将来OAuthで使用できるようにする
        scope: 'user:read user:write'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    await prisma.token.create({
      data: {
        accessToken: token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600 * 1000) // 1時間後に期限切れ
      }
    })

    return c.json({
      message: 'Login successful',
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// token検証エンドポイント
app.post('/auth/verify', async (c) => {
  try {
    const body = await c.req.json()
    const { token } = body

    if (!token) {
      return c.json({ error: 'Token is required' }, 400)
    }

    try {
      const decoded = JWT.verify(token, JWT_SECRET)

      const tokenRecord = await prisma.token.findFirst({
        where: {
          accessToken: token,
          expiresAt: {
            gt: new Date()
          }
        }
      })

      if (!tokenRecord) {
        return c.json({ error: 'Token is invalid or expired' }, 401)
      }

      return c.json({
        valid: true,
        payload: decoded
      })
    } catch (err) {
      return c.json({ error: 'Token is invalid' }, 401)
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// logoutエンドポイント
app.post('/auth/logout', async (c) => {
  try {
    const payload = c.get('jwtPayload')
    const token = c.req.header('Authorization')?.replace('Bearer', '')

    if (!token) {
      return c.json({ error: 'Token is required' }, 400)
    }

    // トークンを無効化する
    await prisma.token.updateMany({
      where: {
        accessToken: token,
        userId: payload.sub
      },
      data: {
        expiresAt: new Date() // 即時無効化
      }
    })

    return c.json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Error logging out:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
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
      data: histories.map(({ checked, createdAt, ...rest }) => rest)
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to get histories" }, 500)
  }
})

// 履歴を削除する
app.delete('/histories/:historyId', async (c) => {
  try {
    const historyId = c.req.param('historyId')

    await prisma.history.delete({
      where: { id: historyId }
    })

    return c.json({
      status: 200,
      message: "delete history successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to delete history" }, 500)
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
    const originFolderId = c.req.param('folderId')
    const { image, memo, folderId, positionx, positiony } = await c.req.json()

    const updateData: any = {}
    if (image) updateData.image = image
    if (memo) updateData.memo = memo
    if (folderId) {
      updateData.folder = { connect: { id: folderId } }
    }
    if (positionx) updateData.positionx = positionx
    if (positiony) updateData.positiony = positiony

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
    console.error('Error updating bookmark:', error)
    return c.json({ status: 500, message: "Failed to update bookmark" }, 500)
  }
})

app.post('/bookmarks/:folderId/edges', async (c) => {
  try {
    const folderId = c.req.param('folderId')
    const { id, source, target, type, memo } = await c.req.json()

    const edge = await prisma.edges.create({
      data: {
        id,
        source: { connect: { id: source } },
        target: { connect: { id: target } },
        type,
        memo: memo || "",
        folder: { connect: { id: folderId } }
      }
    })

    return c.json({
      status: 200,
      message: "add edge successful",
      id: edge.id
    })
  }
  catch (error) {
    console.error('Error adding edge:', error)
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

// いいね関連のAPIの実装
// いいね一覧を取得
app.get('/likes', async (c) => {
  try {
    const likes = await prisma.like.findMany()

    return c.json({
      status: 200,
      message: "get likes successful",
      data: likes
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to get likes" }, 500)
  }
})

// いいねを追加
app.post('/likes', async (c) => {
  try {
    const { url, title, description, image } = await c.req.json()

    await prisma.like.create({
      data: {
        url,
        title,
        description,
        image
      }
    })

    return c.json({
      status: 200,
      message: "add like successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to add like" }, 500)
  }
})
// いいねを削除
app.delete('/likes/:likeId', async (c) => {
  try {
    const likeId = c.req.param('likeId')

    await prisma.like.delete({
      where: { id: likeId }
    })

    return c.json({
      status: 200,
      message: "delete like successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to delete like" }, 500)
  }
})
// いいねを編集
app.put('/likes/:likeId', async (c) => {
  try {
    const likeId = c.req.param('likeId')
    const { memo, folderId } = await c.req.json()
    console.log(memo, folderId)
    console.log(likeId)

    if (memo || memo === "") {
      await prisma.like.update({
        where: { id: likeId },
        data: { memo }
      })
    } 
    if (folderId) {
      const like = await prisma.like.findUnique({
        where: { id: likeId }
      })
      if (!like) {
        console.log("ret")
        return c.json({ status: 404, message: "Like not found" }, 404)
      }
      // console.log(like)
      console.log("a")

      const folder = await prisma.bookmarkFolder.findUnique({
        where: { id: folderId }
      })
      console.log(folder)
      const bookmark = await prisma.bookmark.create({
        data: {
          url: like.url,
          title: like.title,
          description: like.description,
          image: like.image,
          memo: like.memo || "",
          // folderId,
          folder: {connect: { id: folderId }}
        },
      })
      // console.log(ret)
      console.log("b")
      await prisma.like.delete({
        where: { id: likeId }
      })
    }
    return c.json({
      status: 200,
      message: "update like successful"
    })
  } catch (error) {
    console.error('Error updating like:', error)
    return c.json({ status: 500, message: "Failed to update like" }, 500)
  }
})

// いいねの詳細を取得
app.get('/likes/:likeId', async (c) => {
  try {
    const likeId = c.req.param('likeId')

    const like = await prisma.like.findUnique({
      where: { id: likeId }
    })

    return c.json({
      status: 200,
      message: "get like successful",
      data: like
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to get like" }, 500)
  }
})
// スーパいいね関連のAPIの実装
// スーパいいね一覧を取得
app.get('/superlikes', async (c) => {
  try {
    const superlikes = await prisma.superlike.findMany()

    return c.json({
      status: 200,
      message: "get superlikes successful",
      data: superlikes
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to get superlikes" }, 500)
  }
})
// スーパいいねを追加
app.post('/superlikes', async (c) => {
  try {
    const { url, title, description, image } = await c.req.json()

    await prisma.superlike.create({
      data: {
        url,
        title,
        description,
        image
      }
    })

    return c.json({
      status: 200,
      message: "add superlike successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to add superlike" }, 500)
  }
})
// スーパいいねを削除
app.delete('/superlikes/:superlikeId', async (c) => {
  try {
    const superlikeId = c.req.param('superlikeId')

    await prisma.superlike.delete({
      where: { id: superlikeId }
    })

    return c.json({
      status: 200,
      message: "delete superlike successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to delete superlike" }, 500)
  }
})
// スーパいいねを編集
app.put('/superlikes/:superlikeId', async (c) => {
  try {
    const superlikeId = c.req.param('superlikeId')
    const { memo, folderId } = await c.req.json()

    if (memo || memo === "") {
      await prisma.superlike.update({
        where: { id: superlikeId },
        data: { memo }
      })
    } else if (folderId) {
      const superlike = await prisma.superlike.findUnique({
        where: { id: superlikeId }
      })
      if (!superlike) {
        return c.json({ status: 404, message: "Superlike not found" }, 404)
      }
      await prisma.bookmark.create({
        data: {
          url: superlike.url,
          title: superlike.title,
          description: superlike.description,
          image: superlike.image,
          memo : superlike.memo || "",
          folder: { connect: { id: folderId } }
        }
      })
    }
    return c.json({
      status: 200,
      message: "update superlike successful"
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to update superlike" }, 500)
  }
})

// スーパいいねの詳細を取得
app.get('/superlikes/:superlikeId', async (c) => {
  try {
    const superlikeId = c.req.param('superlikeId')

    const superlike = await prisma.superlike.findUnique({
      where: { id: superlikeId }
    })

    return c.json({
      status: 200,
      message: "get superlike successful",
      data: superlike
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to get superlike" }, 500)
  }
})


export default app
