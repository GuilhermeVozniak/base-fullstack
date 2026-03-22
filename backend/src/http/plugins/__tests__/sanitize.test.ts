import { describe, expect, it } from "bun:test"
import { treaty } from "@elysiajs/eden"
import { Elysia } from "elysia"
import { sanitize } from "@/http/plugins/sanitize"

const createTestApp = () =>
  new Elysia()
    .use(sanitize)
    .get("/test", () => ({ message: "ok" }))
    .post("/echo", ({ body }: { body: unknown }) => body)

describe("sanitize plugin", () => {
  it("strips HTML tags from string fields", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.echo.post({
      text: "<script>alert('xss')</script>Hello",
    })

    expect(data).toEqual({
      text: "alert('xss')Hello",
    })
  })

  it("removes angle brackets from strings", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.echo.post({
      content: "<img src=x onerror=alert('xss')>",
    })

    expect(data).toEqual({
      content: "img srcu onerroralertxss",
    })
  })

  it("sanitizes nested object strings", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.echo.post({
      user: {
        name: "<b>John</b>",
        bio: "Hello <script>alert('hi')</script> world",
      },
    })

    expect(data).toEqual({
      user: {
        name: "bJohnb",
        bio: "Hello alert('hi') world",
      },
    })
  })

  it("sanitizes strings in arrays", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.echo.post({
      tags: ["<script>evil</script>", "normal", "<img>"],
    })

    expect(data).toEqual({
      tags: ["scriptevilscript", "normal", "img"],
    })
  })

  it("leaves non-string fields untouched", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.echo.post({
      count: 42,
      active: true,
      ratio: 3.14,
      empty: null,
    })

    expect(data).toEqual({
      count: 42,
      active: true,
      ratio: 3.14,
      empty: null,
    })
  })

  it("handles mixed content in objects", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.echo.post({
      title: "<h1>Title</h1>",
      count: 10,
      description: "<p>Desc</p>",
      active: true,
    })

    expect(data).toEqual({
      title: "h1Titleh1",
      count: 10,
      description: "pDescp",
      active: true,
    })
  })

  it("allows GET requests without sanitization (no body)", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { status, data } = await api.test.get()

    expect(status).toBe(200)
    expect(data).toEqual({ message: "ok" })
  })

  it("handles deeply nested objects", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.echo.post({
      level1: {
        level2: {
          level3: {
            text: "<div>Deep</div>",
          },
        },
      },
    })

    expect(data).toEqual({
      level1: {
        level2: {
          level3: {
            text: "divDepdiv",
          },
        },
      },
    })
  })

  it("preserves empty strings and valid content", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.echo.post({
      empty: "",
      valid: "Hello World",
      withSpaces: "  spaces  ",
    })

    expect(data).toEqual({
      empty: "",
      valid: "Hello World",
      withSpaces: "  spaces  ",
    })
  })
})
