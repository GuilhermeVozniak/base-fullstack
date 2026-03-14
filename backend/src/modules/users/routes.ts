import { Elysia } from "elysia"
import { forbiddenNotFoundResponses } from "@/http/responses"
import {
  getUserByIdHandler,
  updateUserBodySchema,
  updateUserByIdHandler,
  userIdParamsSchema,
  userResponseSchema,
} from "@/modules/users/handler"

export const usersRoutes = new Elysia({ name: "users.routes" }).group("/users", (app) =>
  app
    .get("/:id", getUserByIdHandler, {
      auth: true,
      detail: {
        description: "Get user by id (self-only)",
        tags: ["Users"],
      },
      params: userIdParamsSchema,
      response: {
        ...forbiddenNotFoundResponses,
        200: userResponseSchema,
      },
    })
    .patch("/:id", updateUserByIdHandler, {
      auth: true,
      detail: {
        description: "Update user by id (self-only)",
        tags: ["Users"],
      },
      params: userIdParamsSchema,
      body: updateUserBodySchema,
      response: {
        ...forbiddenNotFoundResponses,
        200: userResponseSchema,
      },
    })
)
