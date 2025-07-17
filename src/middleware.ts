// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const revalidate = 0;

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (
    pathname === "/dashboard/subscription" &&
    searchParams.has("subscriptionStatus")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/dashboard" && searchParams.has("isAuth")) {
    return NextResponse.next();
  }

  // 2️⃣ Everything else under /dashboard → always enforce
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("refreshTokenNew")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 3️⃣ All other routes → no middleware
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
