import { Hono } from 'hono'
import { z } from "zod";
import { zValidator } from '@hono/zod-validator'

const BaseSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

const ImageSchema = z.object({
  image: z.string().max(1000000).optional(),  //maxは任意の容量,optionalはどちらでも良い
});

const history = BaseSchema.extend({
  url: z.string(),
  title: z.string(),
}).merge(ImageSchema);

const bookmarks = BaseSchema;

const bookmarks_folder_id = BaseSchema.extend({
  title: z.string(),
  memo: z.string(),
  url: z.string(),
}).merge(ImageSchema);

const bookmarks_bookmark_id = BaseSchema.extend({
  folderId: z.string(),
  message: z.string(),
}).merge(ImageSchema);

const validateRequest = (schema: z.ZodTypeAny) => zValidator("json", schema, (result, c) => {
  if (!result.success) {
    return c.json({ message: "Validation failed" }, 400);
  }
});

const app = new Hono()

app.post("/histories",  validateRequest(history), (c) => {
    const { url, title, description, image } = c.req.valid("json");
    console.log(url, title, description, image);
    return c.json({
      status: 200,
      message: "ok",
    }, 200);
  }
);

app.get("/histories", validateRequest(history), (c) => {
    const { url, title, description, image } = c.req.valid("json");
    console.log(url, title, description, image);
    return c.json({
      message: "get histories successful",
      status: 200,
      data: [
        {
          url,
          title,
          description,
          image,
        }
      ]
    }, 200);
  }
);

app.get("/bookmarks", validateRequest(bookmarks), (c) => {
    const { id, name } = c.req.valid("json");
    console.log(id, name);
    return c.json({
      message: "get bookmark folder successful",
      status: 200,
      data: [
        {
          name,
          id,
        }
      ]
    }, 200);
  }
);

app.post("/bookmarks",validateRequest(bookmarks), (c) => {
    const { name, description } = c.req.valid("json");
    console.log(name, description);
    return c.json({
      message: "get bookmark folder successful",
      status: 200,
      data: [
        {
          name,
          id,
        }
      ]
    }, 200);
  }
);

app.get("/bookmarks/<folder_id>", validateRequest(bookmarks_folder_id), (c) => {
    const { id, name, title, image, description, memo } = c.req.valid("json");
    console.log(id, name, title, image, description, memo);
    return c.json({
      message: "get bookmarks23 successful",
      status: 200,
      data: [
        {
          id: z.string(),
          name: z.string(),
          title: z.string(),
          image: z.string(),
          memo: z.string(),
          description: z.string(),
        }
      ]
    }, 200);
  }
);

app.post("/bookmarks/<folder_id>", validateRequest(bookmarks_folder_id), (c) => {
    const { url, title, description, image, memo } = c.req.valid("json");
    console.log(url, title, description, image, memo);
    return c.json({
      id: z.number(),
      message: "bookmark successful",
      status: 200,
    }, 200);
  }
);

app.put("/bookmarks/<folder_id>", validateRequest(bookmarks_folder_id), (c) => {
    const { name, description} = c.req.valid("json");
    console.log(name, description);
    return c.json({
      message: "change bookmark folder successful",
      status: 200,
    }, 200);
  }
);

app.delete("/bookmarks/<folder_id>",validateRequest(bookmarks_folder_id), (c) => {
    const { name, description} = c.req.valid("json");
    console.log(name, description);
    return c.json({
      message: "delete bookmark folder successful",
      status: 200,
    }, 200);
  }
);

app.delete("/bookmarks/<folder_id>/<bookmark_id>", validateRequest(bookmarks_bookmark_id), (c) => {
    const { name, description} = c.req.valid("json");
    console.log(name, description);
    return c.json({
      message: "delete bookmark successful",
      status: 200,
    }, 200);
  }
);

app.put("/bookmarks/<folder_id>/<bookmark_id>", validateRequest(bookmarks_bookmark_id), (c) => {
    const { image, memo, folderId} = c.req.valid("json");
    console.log(image, memo, folderId);
    return c.json({
      id : z.number(),
      message: "change bookmark successful",
      status: 200,
    }, 200);
  }
);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app