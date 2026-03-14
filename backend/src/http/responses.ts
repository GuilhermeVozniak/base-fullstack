import { z } from "zod"

/**
 * Shared HTTP response schemas for reuse across routes.
 * These provide sensible defaults that can be overridden in handlers.
 */

export const errorResponseSchema = z.object({
  message: z.string(),
})

export const errorResponses = {
  400: errorResponseSchema,
  401: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  500: errorResponseSchema,
} as const

export const forbiddenNotFoundResponses = {
  403: errorResponseSchema,
  404: errorResponseSchema,
} as const
