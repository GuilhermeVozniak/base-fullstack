import { log } from "@/http/plugins/logger"
import { startServer } from "@/http/server"

const app = await startServer()

const shutdown = (signal: string) => {
  log.info(`Received ${signal}, shutting down gracefully...`)
  app.stop()
  process.exit(0)
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", () => shutdown("SIGINT"))
