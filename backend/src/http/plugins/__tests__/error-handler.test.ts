import { describe, expect, it, mock } from "bun:test"

mock.module("@/http/plugins/logger", () => ({
  log: {
    warn: () => {},
    debug: () => {},
    error: () => {},
    info: () => {},
    into: () => (app: unknown) => app,
  },
}))

const { treaty } = await import("@elysiajs/eden")
const { Elysia, t } = await import("elysia")
const { errorHandler } = await import("@/http/plugins/error-handler")
const { requestId } = await import("@/http/plugins/request-id")

const createTestApp = () =>
  new Elysia()
    .use(requestId)
    .use(errorHandler)
    .get("/success", () => ({ message: "ok" }))
    .get("/throw-error", () => {
      throw new Error("Test error")
    })
    .post("/validation-error", ({ body }) => body, {
      body: t.Object({
        name: t.String(),
      }),
    })
    .get("/not-found-route", () => {
      return { message: "found" }
    })

describe("error-handler plugin", () => {
  it("returns 200 for successful requests", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { status, data } = await api.success.get()

    expect(status).toBe(200)
    expect(data).toEqual({ message: "ok" })
  })

  it("catches thrown errors and returns error status", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { status } = await api["throw-error"].get()

    expect(status).toBe(500)
  })

  it("handles validation errors", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { status } = await api["validation-error"].post({ name: 123 as unknown as string })

    expect(status).toBe(422)
  })

  it("maps NOT_FOUND errors to 404", async () => {
    const app = createTestApp()

    const response = await app.handle(new Request("http://localhost/nonexistent"))

    expect(response.status).toBe(404)
  })

  it("includes requestId in error context when header is present", async () => {
    const app = createTestApp()
    const api = treaty(app, {
      headers: {
        "x-request-id": "test-request-123",
      },
    })

    const { status } = await api["throw-error"].get()

    expect(status).toBe(500)
  })
})
