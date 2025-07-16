import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log(BASE_URL);

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const response = await axios.post(`${BASE_URL}/auth/google/login`, {
      token,
    });
    const res = NextResponse.redirect(new URL("/dashboard", req.url));

    res.cookies.set({
      name: "defaultToken",
      value: response.data.data.tokens.access.token,
      secure: process.env.NEXT_APP_ENV === "production",
      sameSite: process.env.NEXT_APP_ENV === "production" ? "none" : "lax",
      path: "/",
      domain:
        process.env.NEXT_APP_ENV === "production"
          ? ".sprekar.com"
          : "localhost",
    });

    res.cookies.set({
      name: "refreshTokenNew",
      value: response.data.data.tokens.refresh,
      secure: process.env.NEXT_APP_ENV === "production",
      sameSite: process.env.NEXT_APP_ENV === "production" ? "none" : "lax",
      path: "/",
      domain:
        process.env.NEXT_APP_ENV === "production"
          ? ".sprekar.com"
          : "localhost",
    });

    return res;
  } catch (error: unknown) {
    let errorMessage = "Error occurred";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || "Axios request failed";
      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      console.log(error);
      errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}
