import { afterAll, beforeAll, beforeEach, describe, expect, it } from "bun:test"
import { eq } from "drizzle-orm"
import { schema } from "@/database/schema"
import type { UsersUpdateInput } from "@/modules/users/repository/types"
import {
  cleanupTables,
  getTestDb,
  startPostgresContainer,
  stopPostgresContainer,
} from "@/test/containers/postgres"

beforeAll(async () => {
  await startPostgresContainer()
}, 120000)

afterAll(async () => {
  await stopPostgresContainer()
})

beforeEach(async () => {
  await cleanupTables()
})

const createUsersRepository = () => {
  const db = getTestDb()

  return {
    findById: async (id: string) => {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id))

      return user ?? null
    },

    updateById: async (id: string, input: UsersUpdateInput) => {
      const set: Record<string, unknown> = {}

      if (input.name !== undefined) set.name = input.name
      if (input.image !== undefined) set.image = input.image

      if (Object.keys(set).length === 0) {
        const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id))
        return user ?? null
      }

      const [user] = await db
        .update(schema.users)
        .set(set)
        .where(eq(schema.users.id, id))
        .returning()

      return user ?? null
    },
  }
}

const createUser = async (overrides: Partial<typeof schema.users.$inferInsert> = {}) => {
  const db = getTestDb()
  const now = new Date()

  const [user] = await db
    .insert(schema.users)
    .values({
      id: overrides.id ?? "test-user-id",
      name: overrides.name ?? "Test User",
      email: overrides.email ?? "test@example.com",
      emailVerified: overrides.emailVerified ?? false,
      image: overrides.image ?? null,
      createdAt: overrides.createdAt ?? now,
      updatedAt: overrides.updatedAt ?? now,
    })
    .returning()

  return user
}

describe("usersRepository", () => {
  describe("findById", () => {
    it("returns null when user does not exist", async () => {
      const repo = createUsersRepository()
      const result = await repo.findById("non-existent-id")

      expect(result).toBeNull()
    })

    it("returns user when found", async () => {
      const repo = createUsersRepository()
      await createUser({ id: "user-123", name: "John Doe" })

      const result = await repo.findById("user-123")

      expect(result).not.toBeNull()
      expect(result?.id).toBe("user-123")
      expect(result?.name).toBe("John Doe")
      expect(result?.email).toBe("test@example.com")
    })
  })

  describe("updateById", () => {
    it("returns null when user does not exist", async () => {
      const repo = createUsersRepository()
      const result = await repo.updateById("non-existent-id", {
        name: "New Name",
      })

      expect(result).toBeNull()
    })

    it("updates user name", async () => {
      const repo = createUsersRepository()
      await createUser({ id: "user-123", name: "Old Name" })

      const result = await repo.updateById("user-123", {
        name: "New Name",
      })

      expect(result).not.toBeNull()
      expect(result?.name).toBe("New Name")
    })

    it("updates user image", async () => {
      const repo = createUsersRepository()
      await createUser({ id: "user-123", image: null })

      const result = await repo.updateById("user-123", {
        image: "https://example.com/avatar.png",
      })

      expect(result).not.toBeNull()
      expect(result?.image).toBe("https://example.com/avatar.png")
    })

    it("sets image to null", async () => {
      const repo = createUsersRepository()
      await createUser({
        id: "user-123",
        image: "https://example.com/old.png",
      })

      const result = await repo.updateById("user-123", {
        image: null,
      })

      expect(result).not.toBeNull()
      expect(result?.image).toBeNull()
    })

    it("updates multiple fields at once", async () => {
      const repo = createUsersRepository()
      await createUser({ id: "user-123", name: "Old Name", image: null })

      const result = await repo.updateById("user-123", {
        name: "New Name",
        image: "https://example.com/new.png",
      })

      expect(result).not.toBeNull()
      expect(result?.name).toBe("New Name")
      expect(result?.image).toBe("https://example.com/new.png")
    })

    it("returns current user when no fields provided", async () => {
      const repo = createUsersRepository()
      await createUser({ id: "user-123", name: "Original Name" })

      const result = await repo.updateById("user-123", {})

      expect(result).not.toBeNull()
      expect(result?.name).toBe("Original Name")
    })
  })
})
