// File: /app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // We’ll clear both cookies by setting them with Max-Age=0
  const response = NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "Set-Cookie": [
          // Clear defaultToken (js-cookie default path=/, no sameSite override)
          `defaultToken=; Path=/; Max-Age=0; HttpOnly=false; SameSite=Lax`,
          // Clear refreshToken (js-cookie used sameSite=None; path=/)
          `refreshToken=; Path=/; Max-Age=0; HttpOnly=false; SameSite=None; Secure`,
        ].join(", "),
      },
    }
  );
  return response;
}
