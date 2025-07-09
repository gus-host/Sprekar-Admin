import { NextResponse } from "next/server";
import axios from "axios";
import api from "@/utils/axios/api";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("refreshTokenNew");
    const response = await api.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token?.value}`, // Send the JWT token
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "Error occurred";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || "Axios request failed";
      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}
