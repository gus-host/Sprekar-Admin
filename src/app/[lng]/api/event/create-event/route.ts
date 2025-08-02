import { NextResponse } from "next/server";
import axios from "axios";
import api from "@/utils/axios/api";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function POST(req: Request) {
  try {
    const {
      name,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      supportedLanguages,
      timezone,
      isQRCodeEnabled,
      isReoccuring,
    } = await req.json();

    const cookieStore = cookies();
    const token = (await cookieStore).get("refreshTokenNew");
    const response = await api.post(
      `${BASE_URL}/events`,
      {
        name,
        description,
        startDate,
        startTime,
        endDate,
        endTime,
        supportedLanguages,
        timezone,
        isQRCodeEnabled,
        isRecurring: isReoccuring,
      },
      {
        headers: {
          Authorization: `Bearer ${token?.value}`, // Send the JWT token
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "Error occurred";
    let statusCode = 500;
    if (axios.isAxiosError(error)) {
      console.log(error.response);
      errorMessage = error.response?.data?.message || "An error occured";
      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}
