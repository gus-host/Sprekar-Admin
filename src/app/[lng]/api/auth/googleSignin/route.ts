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
    const res = NextResponse.json(
      {
        data: response.data.data, // your tokens, user info, etc.
        message: response.data.message, // any message you want
      },
      { status: 200 }
    );

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
