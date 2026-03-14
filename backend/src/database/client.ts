import { drizzle } from "drizzle-orm/node-postgres"
import { env } from "@/env"
import { schema } from "./schema"

export const db = drizzle(
  `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
  {
    schema,
    casing: "snake_case",
  }
)
