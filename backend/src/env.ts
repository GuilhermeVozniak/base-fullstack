import { z } from "zod"

export const envSchema = z.object({
  PORT: z.string().min(1),
  BETTER_AUTH_URL: z.url().startsWith("http://"),
  BETTER_AUTH_SECRET: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
})

// parsing env variables
export const env = envSchema.parse(process.env)
