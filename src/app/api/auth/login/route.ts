import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const isProd = process.env.NODE_ENV === "production";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    const {
      data: {
        data: {
          tokens: {
            refresh: refreshToken,
            access: { token: accessToken },
          },
        },
      },
    } = response;

    const res = NextResponse.json(response.data, { status: 200 });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: isProd ? ".sprekar.com" : undefined,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set("defaultToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: isProd ? ".sprekar.com" : undefined,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: unknown) {
    let errorMessage = "Error occurred";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || "Axios request failed";
      console.log(error.response);
      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}
