// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const revalidate = 0;

export function middleware(req: NextRequest) {
  // Example: Redirect if user is not authenticated
  const token = req.cookies.get("refreshToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to `/dashboard` and all subroutes
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
