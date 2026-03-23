import { randomUUIDv7 } from "bun"
import { Elysia } from "elysia"

export const requestId = new Elysia({ name: "request-id" })
  .derive(({ request }) => {
    const id = request.headers.get("x-request-id") ?? randomUUIDv7()
    return { requestId: id }
  })
  .onAfterHandle(({ requestId, set }) => {
    set.headers["x-request-id"] = requestId
  })
  .as("global")
