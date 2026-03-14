import { Elysia } from "elysia"
import { log } from "@/http/plugins/logger"

export const errorHandler = new Elysia({ name: "error-handler" }).onError(
  ({ code, error, request, path }) => {
    const errorContext = {
      requestId: request.headers.get("x-request-id"),
      code,
      path,
      method: request.method,
      url: request.url,
      message: "message" in error ? error.message : String(error),
      stack: process.env.NODE_ENV !== "production" && "stack" in error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }

    if (code === "VALIDATION") {
      log.warn(errorContext, "Validation error")
    } else if (code === "NOT_FOUND") {
      log.debug(errorContext, "Route not found")
    } else {
      log.error(errorContext, "Unhandled error")
    }
  }
)
