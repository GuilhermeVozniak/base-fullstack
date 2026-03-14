import type { UserRecord } from "@/modules/users/repository/types"

export type UserDto = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export const toUserDto = (user: UserRecord): UserDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})
