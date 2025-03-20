import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_BASE_URL;

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("refreshToken");

    const { password, passwordConfirm, id } = await req.json();

    const response = await axios.post(
      `${BASE_URL}/auth/change-password`,
      {
        oldPassword: password,
        newPassword: passwordConfirm,
        id,
      },
      {
        headers: {
          Authorization: `Bearer ${token?.value}`, // Send the JWT token
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "Error occurred";
    let statusCode = 500;
    // console.log(error);

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
