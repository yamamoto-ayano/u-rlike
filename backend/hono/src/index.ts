import { Hono } from 'hono';
import { z } from "zod";
import { zValidator } from '@hono/zod-validator';

// ----- スキーマ定義 -----
const ImageSchema = z.object({
  image: z.string().max(3_000_000).optional(), // base64想定（3MBまで）
});

export const CreateHistorySchema = z.object({
  url: z.string(),
  title: z.string(),
  description: z.string().optional(),
}).merge(ImageSchema);

// --- ブックマークフォルダ ---

// POST: 作成時
export const CreateBookmarkFolderSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

// PUT: 更新時
export const UpdateBookmarkFolderSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

// --- フォルダ内ブックマーク ---

// POST: ブックマーク追加
export const CreateBookmarkInFolderSchema = z.object({
  url: z.string(),
  title: z.string(),
  description: z.string().optional(),
  memo: z.string(),
}).merge(ImageSchema);

// PUT: ブックマークの編集（メモ変更、フォルダ変更など）
export const UpdateBookmarkSchema = z.object({
  image: z.string().optional(),
  memo: z.string().optional(),
  folderId: z.string(), // 移動も想定
});



// バリデーション関数（エラー時は自動的に 400 を返す）
const validateRequest = (schema: z.ZodTypeAny) =>
  zValidator("json", schema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Validation failed" }, 400);
    }
  });

const app = new Hono();

// ----- エンドポイント定義 -----

// 履歴をサーバーに追加するエンドポイント
app.post("/histories", validateRequest(CreateHistorySchema), (c) => {
  const { url, title, description, image } = c.req.valid("json");
  console.log(url, title, description, image);
  // DB保存処理などをここに追加
  return c.json({
    status: 200,
    message: "add CreateHistorySchema successful",
  }, 200);
});

// 履歴を取得するエンドポイント
app.get("/histories", (c) => {
  // 仮データ: DB から取得
  return c.json({
    message: "get histories successful",
    status: 200,
    data: [
      {
        url: "https://example.com",
        title: "History Entry",
        description: "Sample history description",
        image: "img.png",
      }
    ]
  });
});

// ブックマークフォルダ一覧を取得
app.get("/bookmarks", (c) => {
  // 仮データ: DBからフォルダ一覧を取得する想定
  const folders = [
    { id: "folder1", name: "Folder One" },
    { id: "folder2", name: "Folder Two" }
  ];
  return c.json({
    message: "get bookmark folder successful",
    status: 200,
    data: folders
  }, 200);
});

// ブックマークフォルダを新規作成
app.post("/bookmarks", validateRequest(CreateBookmarkFolderSchema), (c) => {
  const { name, description } = c.req.valid("json");
  console.log(name, description);
  // 仮のIDを生成(DBでおこなう)
  return c.json({
    message: "bookmark folder created successfully",
    status: 200,
    data: {
      id: "generated-folder-id",
      name: name,
    }
  }, 200);
});

// 指定したフォルダ内のブックマークを取得
app.get("/bookmarks/:folder_id", (c) => {
  const folderId = c.req.param("folder_id"); // パスパラメータの取得
  console.log("folderId", folderId);
  
  // 仮データ: folderId に紐づくブックマークをDBから取得する想定
  const bookmarkItems = [
    {
      id: "1",
      name: "Google",
      title: "Search Engine",
      image: "https://example.com/logo.png",
      memo: "Frequently used",
      description: "A search engine website"
    },
    {
      id: "2",
      name: "GitHub",
      title: "Code Hosting",
      image: "https://example.com/github.png",
      memo: "Code repository",
      description: "A platform for hosting code"
    }
  ];
  return c.json({
    message: "get bookmarks successful",
    status: 200,
    data: bookmarkItems
  }, 200);
});

// 指定フォルダにブックマークを追加するエンドポイント
app.post("/bookmarks/:folder_id", validateRequest(CreateBookmarkInFolderSchema), (c) => {
  const folderId = c.req.param("folder_id"); // フォルダIDをパスパラメータから取得
  const { url, title, description, image, memo } = c.req.valid("json");
  console.log("folderId", folderId, url, title, description, image, memo);
  // 仮のブックマークIDを返す。実際は DB 挿入後の生成ID
  return c.json({
    id: 1, // 例: DBによる生成ID
    message: "bookmark successful",
    status: 200,
  }, 200);
});

// ブックマークフォルダの編集
app.put("/bookmarks/:folder_id", validateRequest(UpdateBookmarkFolderSchema), (c) => {
  const folderId = c.req.param("folder_id");
  const { name, description } = c.req.valid("json");
  console.log("Updating folder", folderId, name, description);
  // DB更新処理などをここに追加
  return c.json({
    message: "change bookmark folder successful",
    status: 200,
  }, 200);
});

// フォルダ削除
app.delete("/bookmarks/:folder_id", (c) => {
  const folderId = c.req.param("folder_id");
  console.log("Deleting folder", folderId);
  return c.json({
    message: "delete bookmark folder successful",
    status: 200,
  });
});

// ブックマーク削除
app.delete("/bookmarks/:folder_id/:bookmark_id", (c) => {
  const folderId = c.req.param("folder_id");
  const bookmarkId = c.req.param("bookmark_id");
  console.log("Deleting bookmark", bookmarkId, "from folder", folderId);
  return c.json({
    message: "delete bookmark successful",
    status: 200,
  });
});

// フォルダ内のブックマークの編集（例：メモ変更、別フォルダへの移動など）
app.put("/bookmarks/:folder_id/:bookmark_id", validateRequest(UpdateBookmarkSchema), (c) => {
  const folderId = c.req.param("folder_id");
  const bookmarkId = c.req.param("bookmark_id");
  const { image, memo, folderId: newFolderId } = c.req.valid("json");
  console.log("Updating bookmark", bookmarkId, "in folder", folderId, "with new folderId", newFolderId, image, memo);
  // DB更新処理などをここに追加
  return c.json({
    id: 1,
    message: "change bookmark successful",
    status: 200,
  }, 200);
});

// test用ルートエンドポイント：単純なテキストを返す
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

export default app;
