// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages, cookieName } from "./app/i18n/settings";

acceptLanguage.languages(languages);

export const revalidate = 0;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // console.log("Middleware: not-found", pathname === "/_not-found");

  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lng) lng = fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }

  // const isNext404Route = pathname === "/_not-found";
  // if (isNext404Route) {
  //   return NextResponse.redirect(new URL(`/${lng}/not-found`, req.url));
  // }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") as string);
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  if (
    pathname === `/${lng}/dashboard/subscription` &&
    req.nextUrl.searchParams.has("subscriptionStatus")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith(`/${lng}/dashboard`)) {
    const token = req.cookies.get("refreshTokenNew")?.value;

    if (!token) {
      console.warn("No refresh token found. Redirecting to login.");
      return NextResponse.redirect(new URL(`/${lng}/login`, req.url));
    }
  }

  // 3️⃣ All other routes → no middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip:
    // - api routes
    // - _next (static files)
    // - assets
    // - public files like .png, .jpg, .svg, .mp4, etc.
    "/((?!api|_next/static|_next/image|assets|videos|favicon.ico|sw.js|site.webmanifest|.*\\.).*)",
    "/api/:path*",
  ],
};
