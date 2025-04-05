import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { cors } from 'hono/cors'

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
        name: true
      }
    })

    return c.json({
      status: 200,
      message: "getbookmark folder successful",
      data: folders
    })
  } catch (error) {
    return c.json({ status: 500, message: "Failed to get bookmark folder" }, 500)
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

    return c.json({
      status: 200,
      message: "get bookmarks successful",
      data: bookmarks
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
app.delete('bookmarks/:folderId', async (c) => {
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

export default app
