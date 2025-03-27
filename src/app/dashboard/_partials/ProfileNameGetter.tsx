import { unstable_noStore as noStore } from "next/cache";
import axios from "axios";
import { cookies } from "next/headers";
import Greet from "./Greet";

const BASE_URL = process.env.API_BASE_URL;
export const revalidate = 0;

interface User {
  firstName: string;
}

export default async function ProfileNameGetter() {
  noStore();
  const cookieStore = cookies();
  const token = (await cookieStore).get("refreshToken")?.value;
  let user: User = {
    firstName: "",
  };

  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(response.status);
    }

    const data = await response.json();
    console.log(data);
    user = data.data.user; // Adjust if needed
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Axios Error:", err.message);
    } else if (err instanceof Error) {
      console.log("Fetch Error:", err);
    } else {
      console.log("Unknown Error:", err);
    }
  }

  return <Greet name={user.firstName} />;
}
