// File: /app/api/logout/route.ts
import { NextResponse } from "next/server";
const isProd = process.env.NEXT_APP_ENV === "production";

export async function GET() {
  // We’ll clear both cookies by setting them with Max-Age=0
  const response = NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "Set-Cookie": [
          // Clear defaultToken (js-cookie default path=/, no sameSite override)
          `defaultToken=; Path=/`,
          // Clear refreshToken (js-cookie used sameSite=None; path=/)
          `refreshTokenNew=; Path=/`,
        ].join(", "),
      },
    }
  );

  return response;
}
