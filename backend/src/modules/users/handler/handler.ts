import type { z } from "zod"
import { ForbiddenError, NotFoundError, usersService } from "@/modules/users/service"
import type { updateUserBodySchema, userIdParamsSchema, userResponseSchema } from "./schemas"

type User = z.infer<typeof userResponseSchema>
type Params = z.infer<typeof userIdParamsSchema>

/**
 * @param context
 * @returns
 */
export const getUserByIdHandler = async (
  context: Record<string, unknown>
): Promise<User | { message: string }> => {
  const { user, params, status } = context as {
    user: User
    params: Params
    status: (code: number, body: { message: string }) => { message: string }
  }
  try {
    return await usersService.getByIdSelfOnly(user.id, params.id)
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return status(403, { message: "Forbidden" })
    }

    if (error instanceof NotFoundError) {
      return status(404, { message: "Not found" })
    }

    throw error
  }
}

type UpdateBody = z.infer<typeof updateUserBodySchema>

/**
 * @param context
 * @returns
 */
export const updateUserByIdHandler = async (
  context: Record<string, unknown>
): Promise<User | { message: string }> => {
  const { user, params, body, status } = context as {
    user: User
    params: Params
    body: UpdateBody
    status: (code: number, body: { message: string }) => { message: string }
  }
  try {
    return await usersService.updateByIdSelfOnly(user.id, params.id, body)
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return status(403, { message: "Forbidden" })
    }

    if (error instanceof NotFoundError) {
      return status(404, { message: "Not found" })
    }

    throw error
  }
}
