import type { schema } from "@/database/schema"

export type UserRecord = typeof schema.users.$inferSelect

export type UsersUpdateInput = {
  name?: string
  image?: string | null
}
