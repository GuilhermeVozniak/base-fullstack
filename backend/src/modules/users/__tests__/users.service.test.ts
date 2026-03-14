import { beforeEach, describe, expect, it } from "bun:test"
import type { UserRecord, UsersUpdateInput } from "@/modules/users/repository"
import { mockModuleWithMutableExports } from "@/test/mock-module"

let findByIdImpl: (id: string) => Promise<UserRecord | null>
let updateByIdImpl: (id: string, input: UsersUpdateInput) => Promise<UserRecord | null>

mockModuleWithMutableExports("@/modules/users/repository/repository", {
  usersRepository: {
    findById: (id: string) => findByIdImpl(id),
    updateById: (id: string, input: UsersUpdateInput) => updateByIdImpl(id, input),
  },
})

const serviceModule = await import("@/modules/users/service")
const { usersService, ForbiddenError, NotFoundError } = serviceModule

describe("usersService", () => {
  beforeEach(() => {
    findByIdImpl = async () => null
    updateByIdImpl = async () => null
  })

  it("throws ForbiddenError when requesting another user's data", async () => {
    await expect(usersService.getByIdSelfOnly("auth", "other")).rejects.toBeInstanceOf(
      ForbiddenError
    )
  })

  it("throws NotFoundError when user does not exist", async () => {
    findByIdImpl = async () => null

    await expect(usersService.getByIdSelfOnly("id", "id")).rejects.toBeInstanceOf(NotFoundError)
  })

  it("returns a UserDto when user exists", async () => {
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

    const dto = await usersService.getByIdSelfOnly("id", "id")

    expect(dto).toEqual({
      id: "id",
      name: "Name",
      email: "name@example.com",
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    })
  })

  it("throws ForbiddenError when updating another user", async () => {
    await expect(
      usersService.updateByIdSelfOnly("auth", "other", { name: "New" })
    ).rejects.toBeInstanceOf(ForbiddenError)
  })

  it("throws NotFoundError when updated user is missing", async () => {
    updateByIdImpl = async () => null

    await expect(
      usersService.updateByIdSelfOnly("id", "id", { name: "New" })
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it("returns a UserDto when update succeeds", async () => {
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

    const dto = await usersService.updateByIdSelfOnly("id", "id", {
      name: "New",
    })

    expect(dto).toEqual({
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
