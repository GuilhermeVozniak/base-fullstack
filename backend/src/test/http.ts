type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

type AppLike = {
  handle: (request: Request) => Response | Promise<Response>
}

type RequestOptions = {
  method: HttpMethod
  path: string
  headers?: Record<string, string>
  body?: unknown
}

export const request = async (app: AppLike, options: RequestOptions) => {
  const headers: Record<string, string> = { ...(options.headers ?? {}) }

  if (options.body !== undefined && headers["content-type"] === undefined) {
    headers["content-type"] = "application/json"
  }

  return await app.handle(
    new Request(`http://localhost${options.path}`, {
      method: options.method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  )
}
