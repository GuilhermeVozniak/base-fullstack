import { eq } from "drizzle-orm"
import { db } from "@/database/client"
import { schema } from "@/database/schema"

import type { UsersUpdateInput } from "./types"

export const usersRepository = {
  findById: async (id: string) => {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id))

    return user ?? null
  },

  updateById: async (id: string, input: UsersUpdateInput) => {
    const set: Record<string, unknown> = {}

    if (input.name !== undefined) set.name = input.name
    if (input.image !== undefined) set.image = input.image

    if (Object.keys(set).length === 0) {
      return await usersRepository.findById(id)
    }

    const [user] = await db.update(schema.users).set(set).where(eq(schema.users.id, id)).returning()

    return user ?? null
  },
}
