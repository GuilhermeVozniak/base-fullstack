import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Client } from "pg"
import { schema } from "@/database/schema"

let client: Client | null = null
let db: NodePgDatabase<typeof schema> | null = null

const TEST_DB_CONFIG = {
  host: process.env.POSTGRES_HOST ?? "localhost",
  port: parseInt(process.env.POSTGRES_PORT ?? "5433", 10),
  database: "base_fullstack_test",
  user: process.env.POSTGRES_USER ?? "base-fullstack",
  password: process.env.POSTGRES_PASSWORD ?? "base-fullstack_password",
}

export const startPostgresContainer = async () => {
  if (db) {
    return { client, db }
  }

  const adminClient = new Client({
    host: TEST_DB_CONFIG.host,
    port: TEST_DB_CONFIG.port,
    database: "postgres",
    user: TEST_DB_CONFIG.user,
    password: TEST_DB_CONFIG.password,
  })
  await adminClient.connect()

  await adminClient.query(`DROP DATABASE IF EXISTS ${TEST_DB_CONFIG.database}`)
  await adminClient.query(`CREATE DATABASE ${TEST_DB_CONFIG.database}`)
  await adminClient.end()

  client = new Client({
    host: TEST_DB_CONFIG.host,
    port: TEST_DB_CONFIG.port,
    database: TEST_DB_CONFIG.database,
    user: TEST_DB_CONFIG.user,
    password: TEST_DB_CONFIG.password,
  })
  await client.connect()

  db = drizzle(client, { schema, casing: "snake_case" })

  await migrate(db, { migrationsFolder: "./src/database/migrations" })

  return { client, db }
}

export const stopPostgresContainer = async () => {
  if (client) {
    await client.end()
    client = null
  }
  db = null
}

export const getTestDb = () => {
  if (!db) {
    throw new Error("Test database not initialized. Call startPostgresContainer first.")
  }
  return db
}

export const cleanupTables = async () => {
  if (!db) return

  await db.delete(schema.sessions)
  await db.delete(schema.accounts)
  await db.delete(schema.users)
  await db.delete(schema.verifications)
}
