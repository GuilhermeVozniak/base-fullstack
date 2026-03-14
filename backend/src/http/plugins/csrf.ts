import { Elysia } from "elysia"
import { env } from "@/env"

export const csrf = new Elysia({ name: "csrf" }).onBeforeHandle(({ request }) => {
  const method = request.method.toUpperCase()

  if (["GET", "HEAD", "OPTIONS"].includes(method)) return

  const origin = request.headers.get("origin")
  const allowedOrigin = env.CORS_ORIGIN

  if (origin && origin !== allowedOrigin) {
    return new Response("CSRF origin mismatch", { status: 403 })
  }
})
