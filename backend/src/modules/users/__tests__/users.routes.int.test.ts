import { beforeEach, describe, expect, it } from "bun:test"
import { treaty } from "@elysiajs/eden"
import { Elysia } from "elysia"
import type { UserRecord, UsersUpdateInput } from "@/modules/users/repository"
import { mockModuleWithMutableExports } from "@/test/mock-module"
import { testAuthPlugin } from "@/test/plugins/test-auth"

let findByIdImpl: (id: string) => Promise<UserRecord | null>
let updateByIdImpl: (id: string, input: UsersUpdateInput) => Promise<UserRecord | null>

mockModuleWithMutableExports("@/modules/users/repository/repository", {
  usersRepository: {
    findById: (id: string) => findByIdImpl(id),
    updateById: (id: string, input: UsersUpdateInput) => updateByIdImpl(id, input),
  },
})

const { usersRoutes } = await import("@/modules/users/routes")

const createTestApp = () => new Elysia().use(testAuthPlugin).use(usersRoutes)

const createApi = (authUserId?: string) => {
  const app = createTestApp()
  return treaty(app, {
    headers: authUserId ? { authorization: `Bearer ${authUserId}` } : undefined,
  })
}

describe("users routes integration", () => {
  beforeEach(() => {
    findByIdImpl = async () => {
      throw new Error("findByIdImpl not mocked for this test")
    }
    updateByIdImpl = async () => {
      throw new Error("updateByIdImpl not mocked for this test")
    }
  })

  it("GET /users/:id returns 401 when not authenticated", async () => {
    const api = createApi()

    const { status } = await api.users({ id: "id" }).get()

    expect(status).toBe(401)
  })

  it("GET /users/:id returns 403 when requesting another user", async () => {
    const api = createApi("auth")

    const { status } = await api.users({ id: "other" }).get()

    expect(status).toBe(403)
  })

  it("GET /users/:id returns 404 when not found", async () => {
    findByIdImpl = async () => null
    const api = createApi("id")

    const { status } = await api.users({ id: "id" }).get()

    expect(status).toBe(404)
  })

  it("GET /users/:id returns 200 and user dto when found", async () => {
    const now = new Date("2020-01-01T00:00:00.000Z")
    findByIdImpl = async () => ({
      id: "id",
      name: "Name",
      email: "name@example.com",
      emailVerified: true,
      image: null,
      role: null,
      banned: null,
      banReason: null,
      banExpires: null,
      createdAt: now,
      updatedAt: now,
    })
    const api = createApi("id")

    const { data, status } = await api.users({ id: "id" }).get()

    expect(status).toBe(200)
    expect(data).toEqual({
      id: "id",
      name: "Name",
      email: "name@example.com",
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    })
  })

  it("PATCH /users/:id returns 401 when not authenticated", async () => {
    const api = createApi()

    const { status } = await api.users({ id: "id" }).patch({ name: "New" })

    expect(status).toBe(401)
  })

  it("PATCH /users/:id returns 403 when updating another user", async () => {
    const api = createApi("auth")

    const { status } = await api.users({ id: "other" }).patch({ name: "New" })

    expect(status).toBe(403)
  })

  it("PATCH /users/:id returns 404 when user not found", async () => {
    updateByIdImpl = async () => null
    const api = createApi("id")

    const { status } = await api.users({ id: "id" }).patch({ name: "New" })

    expect(status).toBe(404)
  })

  it("PATCH /users/:id returns 422 when body is empty", async () => {
    const api = createApi("id")

    const { status } = await api.users({ id: "id" }).patch({})

    expect(status).toBe(422)
  })

  it("PATCH /users/:id returns 200 and updated dto", async () => {
    const now = new Date("2020-01-01T00:00:00.000Z")
    updateByIdImpl = async (_id, input) => ({
      id: "id",
      name: input.name ?? "Name",
      email: "name@example.com",
      emailVerified: true,
      image: input.image ?? null,
      role: null,
      banned: null,
      banReason: null,
      banExpires: null,
      createdAt: now,
      updatedAt: now,
    })
    const api = createApi("id")

    const { data, status } = await api.users({ id: "id" }).patch({ name: "New" })

    expect(status).toBe(200)
    expect(data).toEqual({
      id: "id",
      name: "New",
      email: "name@example.com",
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    })
  })
})
