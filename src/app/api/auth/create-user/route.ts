import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    const response = await axios.post(`${BASE_URL}/auth/create-user`, {
      firstName,
      lastName,
      email,
      password,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "Error occurred";
    let statusCode = 500;
    // console.log(error);

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || "An error occured";

      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}
