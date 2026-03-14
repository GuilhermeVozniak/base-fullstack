import { z } from "zod"

export const userIdParamsSchema = z.object({
  id: z.string().min(1),
})

export const updateUserBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    image: z.string().min(1).nullable().optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: "At least one field must be provided",
  })

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
