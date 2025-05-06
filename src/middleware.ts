// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const revalidate = 0;

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1️⃣ Special‐case liveTranslation
  if (pathname.startsWith("/dashboard/liveTranslation/")) {
    if (search) {
      // has a query param → bypass auth
      return NextResponse.next();
    } else {
      // no query param → enforce auth
      const token = req.cookies.get("refreshToken")?.value;
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }
  }

  // 2️⃣ Everything else under /dashboard → always enforce
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("refreshToken")?.value;
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
