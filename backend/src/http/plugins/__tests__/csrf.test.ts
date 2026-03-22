import { describe, expect, it, mock } from "bun:test"

mock.module("@/env", () => ({
  env: {
    CORS_ORIGIN: "http://localhost:3000",
  },
}))

const { treaty } = await import("@elysiajs/eden")
const { Elysia } = await import("elysia")
const { csrf } = await import("@/http/plugins/csrf")

const createTestApp = () =>
  new Elysia()
    .use(csrf)
    .get("/test", () => ({ message: "ok" }))
    .post("/test", () => ({ message: "created" }))
    .put("/test", () => ({ message: "updated" }))
    .delete("/test", () => ({ message: "deleted" }))
    .patch("/test", () => ({ message: "patched" }))
    .head("/test", () => ({}))
    .options("/test", () => ({}))

describe("csrf plugin", () => {
  it("allows GET requests regardless of origin", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        origin: "https://malicious.com",
      },
    })

    const { status } = await api.test.get()

    expect(status).toBe(200)
  })

  it("allows HEAD requests regardless of origin", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        origin: "https://malicious.com",
      },
    })

    const { status } = await api.test.head()

    expect(status).toBe(200)
  })

  it("allows OPTIONS requests regardless of origin", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        origin: "https://malicious.com",
      },
    })

    const { status } = await api.test.options()

    expect(status).toBe(200)
  })

  it("allows POST requests with matching origin", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        origin: "http://localhost:3000",
      },
    })

    const { status } = await api.test.post()

    expect(status).toBe(200)
  })

  it("blocks POST requests with mismatched origin", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        origin: "https://malicious.com",
      },
    })

    const { status } = await api.test.post()

    expect(status).toBe(403)
  })

  it("blocks PUT requests with mismatched origin", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        origin: "https://evil.com",
      },
    })

    const { status } = await api.test.put()

    expect(status).toBe(403)
  })

  it("blocks PATCH requests with mismatched origin", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        origin: "https://attacker.com",
      },
    })

    const { status } = await api.test.patch()

    expect(status).toBe(403)
  })

  it("blocks DELETE requests with mismatched origin", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        origin: "https://bad.com",
      },
    })

    const { status } = await api.test.delete()

    expect(status).toBe(403)
  })

  it("allows POST requests without origin header", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { status } = await api.test.post()

    expect(status).toBe(200)
  })

  it("returns 403 response when CSRF check fails", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        origin: "https://malicious.com",
      },
    })

    const { status, data } = await api.test.post()

    expect(status).toBe(403)
  })
})
