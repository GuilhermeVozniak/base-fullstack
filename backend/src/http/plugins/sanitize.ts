import { Elysia } from "elysia"

function stripHtml(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/<[^>]*>/g, "").replace(/[<>]/g, "")
  }
  if (Array.isArray(value)) {
    return value.map(stripHtml)
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, stripHtml(v)]))
  }
  return value
}

export const sanitize = new Elysia({ name: "sanitize" })
  .onBeforeHandle(({ body }) => {
    if (body && typeof body === "object") {
      const sanitized = stripHtml(body)
      Object.assign(body, sanitized)
    }
  })
  .as("global")
