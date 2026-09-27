import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.has("token");
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && pathname.startsWith("/transactions")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/transactions", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/transactions", "/login"],
};
