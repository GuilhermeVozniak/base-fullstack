import { beforeEach, describe, expect, it } from "bun:test"
import { treaty } from "@elysiajs/eden"
import { Elysia } from "elysia"
import { errorHandler } from "@/http/plugins/error-handler"
import { requestId } from "@/http/plugins/request-id"

const createTestApp = () =>
  new Elysia()
    .use(requestId)
    .use(errorHandler)
    .get("/success", () => ({ message: "ok" }))
    .get("/throw-error", () => {
      throw new Error("Test error")
    })
    .post("/validation-error", () => {
      const error = new Error("Invalid input")
      ;(error as any).code = "VALIDATION"
      throw error
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

  it("catches thrown errors and returns 500", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { status } = await api["throw-error"].get()

    expect(status).toBe(500)
  })

  it("handles validation errors", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { status } = await api["validation-error"].post()

    expect(status).toBe(400)
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
