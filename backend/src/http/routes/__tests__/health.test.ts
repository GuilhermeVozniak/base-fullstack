import { describe, expect, it } from "bun:test"
import { treaty } from "@elysiajs/eden"
import { Elysia } from "elysia"
import { healthRoutes } from "@/http/routes/health"

const createTestApp = () => new Elysia().use(healthRoutes)

describe("health routes", () => {
  it("GET /health returns 200 status", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { status } = await api.health.get()

    expect(status).toBe(200)
  })

  it("GET /health returns ok status", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.health.get()

    expect(data?.status).toBe("ok")
  })

  it("GET /health returns valid ISO timestamp", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.health.get()

    expect(typeof data?.timestamp).toBe("string")
    expect(() => new Date(data!.timestamp)).not.toThrow()
  })

  it("GET /health response matches expected schema", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const { data } = await api.health.get()

    expect(data).toEqual({
      status: "ok",
      timestamp: expect.any(String),
    })
  })

  it("GET /health timestamp is recent", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const before = new Date()
    const { data } = await api.health.get()
    const after = new Date()

    const responseTime = new Date(data?.timestamp as string)

    expect(responseTime.getTime()).toBeGreaterThanOrEqual(before.getTime() - 100)
    expect(responseTime.getTime()).toBeLessThanOrEqual(after.getTime() + 100)
  })

  it("GET /health can be called multiple times", async () => {
    const app = createTestApp()
    const api = treaty(app)

    const response1 = await api.health.get()
    const response2 = await api.health.get()

    expect(response1.status).toBe(200)
    expect(response2.status).toBe(200)
    expect(response1.data?.status).toBe("ok")
    expect(response2.data?.status).toBe("ok")
  })
})
