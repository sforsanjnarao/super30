import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/credentials", "/workflow"];
const publicRoutes = ["/signin", "/signup", "/"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  if (protectedRoutes.some(route => path.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (publicRoutes.some(route => path.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/credentials/:path*", "/workflow/:path*", "/signin", "/signup"],
};