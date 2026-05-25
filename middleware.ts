import { NextResponse, type NextRequest } from "next/server";

import { adminAuthCookieName, adminAuthCookieValue } from "@/lib/admin/auth";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get(adminAuthCookieName)?.value === adminAuthCookieValue;
  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
