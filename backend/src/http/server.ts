import { cors } from "@elysiajs/cors"
import openapi from "@elysiajs/openapi"
import { Elysia } from "elysia"
import type { OpenAPIV3 } from "openapi-types"
import { OpenAPI } from "@/auth"
import { env } from "@/env"
import { betterAuthPlugin } from "@/http/plugins/better-auth"
import { csrf } from "@/http/plugins/csrf"
import { errorHandler } from "@/http/plugins/error-handler"
import { log } from "@/http/plugins/logger"
import { rateLimiter } from "@/http/plugins/rate-limit"
import { requestId } from "@/http/plugins/request-id"
import { sanitize } from "@/http/plugins/sanitize"
import { routes } from "@/http/routes"

export const createServer = async () => {
  const app = new Elysia()
    .use(requestId)
    .use(log.into())
    .use(errorHandler)
    .use(rateLimiter)
    .use(
      openapi({
        documentation: {
          components: (await OpenAPI.components) as OpenAPIV3.ComponentsObject,
          paths: (await OpenAPI.getPaths()) as OpenAPIV3.PathsObject,
        },
      })
    )
    .use(
      cors({
        origin: env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    )
    .use(csrf)
    .use(sanitize)
    .use(betterAuthPlugin) // this is a macro that extends the context with user and session
    .use(routes)

  return app
}

export type App = Awaited<ReturnType<typeof createServer>>

export const startServer = async () => {
  const app = await createServer()
  app.listen(env.PORT)

  log.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

  return app
}
