import { NextResponse } from "next/server";
import axios from "axios";
import api from "@/utils/axios/api";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url); // Extract query params
    const id = searchParams.get("id"); // Read "id" from the query string

    if (!id) {
      return NextResponse.json(
        { message: "Missing event ID" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const token = (await cookieStore).get("refreshTokenNew")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await api.delete(`${BASE_URL}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ data: response.data }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "Error occurred";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
      errorMessage = error.response?.data?.message || "An error occurred";
      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}
