import { type NextRequest, NextResponse } from "next/server"

const publicPaths = ["/", "/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get("better-auth.session_token")?.value

  const isPublic = publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (!isPublic && !sessionToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|health|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
