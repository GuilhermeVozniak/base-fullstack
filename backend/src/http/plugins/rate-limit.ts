import { Elysia } from "elysia"
import { rateLimit } from "elysia-rate-limit"

function getUserKey({
  request,
  server,
}: {
  request: Request
  server: { requestIP?: (req: Request) => { address: string } | null } | null
}) {
  const sessionCookie = request.headers
    .get("cookie")
    ?.match(/better-auth\.session_token=([^;]+)/)?.[1]
  if (sessionCookie) return `user:${sessionCookie}`
  const ip = server?.requestIP?.(request)?.address ?? "unknown"
  return `ip:${ip}`
}

export const rateLimiter = new Elysia({ name: "rate-limit" }).use(
  rateLimit({
    max: 100,
    duration: 60_000,
    generator: (req, server) => getUserKey({ request: req, server }),
  })
)

export const strictRateLimiter = new Elysia({ name: "strict-rate-limit" }).use(
  rateLimit({
    max: 10,
    duration: 60_000,
    generator: (req, server) => getUserKey({ request: req, server }),
  })
)
