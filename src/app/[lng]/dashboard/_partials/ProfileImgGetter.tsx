import { unstable_noStore as noStore } from "next/cache";
import ProfileImg from "./ProfileImg";
import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const revalidate = 0;

export interface User {
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  _id?: string;
}

export default async function ProfileImgGetter() {
  noStore();
  const cookieStore = cookies();
  const token = (await cookieStore).get("refreshTokenNew")?.value;
  let user: User = {
    profilePicture: "",
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

  return <ProfileImg user={user} />;
}
