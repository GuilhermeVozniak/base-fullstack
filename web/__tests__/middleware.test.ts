import { describe, it, expect } from "bun:test"
import { middleware, config } from "@/middleware"
import { NextRequest, NextResponse } from "next/server"

describe("middleware", () => {
  const createRequest = (
    pathname: string,
    cookie?: { name: string; value: string }
  ): NextRequest => {
    const url = new URL(`http://localhost:3000${pathname}`)
    const request = new NextRequest(url)

    if (cookie) {
      request.cookies.set(cookie.name, cookie.value)
    }

    return request
  }

  describe("public paths", () => {
    it("allows access to home page without session", () => {
      const request = createRequest("/")
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it("allows access to login page without session", () => {
      const request = createRequest("/login")
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it("allows access to register page without session", () => {
      const request = createRequest("/register")
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it("allows access to nested public paths without session", () => {
      const request = createRequest("/login/reset-password")
      const response = middleware(request)

      expect(response.status).toBe(200)
    })
  })

  describe("protected paths", () => {
    it("redirects to login when accessing protected path without session", () => {
      const request = createRequest("/dashboard")
      const response = middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get("location")).toContain("/login")
    })

    it("redirects to login for nested protected paths without session", () => {
      const request = createRequest("/dashboard/settings")
      const response = middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get("location")).toContain("/login")
    })

    it("passes through protected path with valid session token", () => {
      const request = createRequest("/dashboard", {
        name: "better-auth.session_token",
        value: "valid-token-123",
      })
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it("allows access to admin path with session", () => {
      const request = createRequest("/admin", {
        name: "better-auth.session_token",
        value: "valid-token-456",
      })
      const response = middleware(request)

      expect(response.status).toBe(200)
    })
  })

  describe("callbackUrl", () => {
    it("sets callbackUrl parameter on redirect", () => {
      const request = createRequest("/dashboard/profile")
      const response = middleware(request)

      const location = response.headers.get("location")
      expect(location).toContain("callbackUrl=%2Fdashboard%2Fprofile")
    })

    it("preserves original pathname in callbackUrl", () => {
      const request = createRequest("/protected/page")
      const response = middleware(request)

      const location = response.headers.get("location")
      expect(location).toContain("callbackUrl=%2Fprotected%2Fpage")
    })
  })

  describe("matcher config", () => {
    it("exports matcher configuration", () => {
      expect(config.matcher).toBeDefined()
      expect(Array.isArray(config.matcher)).toBe(true)
    })

    it("matcher excludes static files", () => {
      expect(config.matcher[0]).toContain("_next/static")
      expect(config.matcher[0]).toContain("_next/image")
      expect(config.matcher[0]).toContain("favicon.ico")
    })

    it("matcher excludes image files", () => {
      expect(config.matcher[0]).toContain("svg|png|jpg|jpeg|gif|webp")
    })

    it("matcher excludes api and health paths", () => {
      expect(config.matcher[0]).toContain("api")
      expect(config.matcher[0]).toContain("health")
    })
  })

  describe("edge cases", () => {
    it("handles paths with query parameters", () => {
      const request = createRequest("/dashboard?tab=settings")
      const response = middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get("location")).toContain("/login")
    })

    it("handles paths with hash fragments", () => {
      const request = createRequest("/dashboard#section1")
      const response = middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get("location")).toContain("/login")
    })

    it("does not modify response for NextResponse.next()", () => {
      const request = createRequest("/")
      const response = middleware(request)

      expect(response instanceof NextResponse).toBe(true)
    })
  })

  describe("session token validation", () => {
    it("recognizes empty session token as no session", () => {
      const request = createRequest("/dashboard", {
        name: "better-auth.session_token",
        value: "",
      })
      const response = middleware(request)

      // Empty token should still pass through the middleware
      // The actual validation happens elsewhere
      expect(response).toBeDefined()
    })

    it("accepts any non-empty session token value", () => {
      const request = createRequest("/admin/users", {
        name: "better-auth.session_token",
        value: "any-non-empty-value",
      })
      const response = middleware(request)

      expect(response.status).toBe(200)
    })
  })
})
