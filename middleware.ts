import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/searches",
  "/candidates",
  "/invitations",
  "/interviews",
  "/assessments",
  "/negotiations",
  "/offers",
  "/companies",
  "/jobs/manage",
  "/settings",
  "/messages",
  "/notifications",
  "/subscription",
  "/email-templates",
  "/audit-logs",
]

// Routes that require admin role
const ADMIN_ROUTES = ["/admin"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("wlr_token")?.value

  // Check protected routes
  const isProtected = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))
  const isAdmin = ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))

  if (isProtected || isAdmin) {
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Admin routes: simple token check (full role validation happens client-side)
  // In production, decode JWT and check role server-side
  if (isAdmin && !token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/searches/:path*",
    "/candidates/:path*",
    "/invitations/:path*",
    "/interviews/:path*",
    "/assessments/:path*",
    "/negotiations/:path*",
    "/offers/:path*",
    "/companies/:path*",
    "/jobs/manage/:path*",
    "/settings/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/subscription/:path*",
    "/email-templates/:path*",
    "/audit-logs/:path*",
    "/admin/:path*",
  ],
}
