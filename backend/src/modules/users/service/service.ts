import type { UsersUpdateInput } from "@/modules/users/repository"
import { usersRepository } from "@/modules/users/repository"
import { toUserDto } from "./dtos"
import { ForbiddenError, NotFoundError } from "./errors"

export const usersService = {
  getByIdSelfOnly: async (authUserId: string, id: string) => {
    if (authUserId !== id) {
      throw new ForbiddenError()
    }

    const user = await usersRepository.findById(id)
    if (!user) {
      throw new NotFoundError()
    }

    return toUserDto(user)
  },

  updateByIdSelfOnly: async (authUserId: string, id: string, input: UsersUpdateInput) => {
    if (authUserId !== id) {
      throw new ForbiddenError()
    }

    const user = await usersRepository.updateById(id, input)
    if (!user) {
      throw new NotFoundError()
    }

    return toUserDto(user)
  },
}
