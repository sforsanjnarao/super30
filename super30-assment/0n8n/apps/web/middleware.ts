import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/home", "/credential", "/workflow"];
const publicRoutes = ["/login", "/signup", "/"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  if (protectedRoutes.some(route => path.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (publicRoutes.some(route => path.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/workflow", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/credential/:path*", "/workflow/:path*", "/login", "/signup"],
};