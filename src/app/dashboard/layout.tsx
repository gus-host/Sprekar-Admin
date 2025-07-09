import NotificationIcon from "@/app/_svgs/NotificationIcon";
import { ChevronDown } from "lucide-react";
import DashboardMain from "./_partials/DashboardMain";
import { ReactNode } from "react";
import Sidebar from "./_partials/Sidebar";
import { User } from "./_partials/ProfileImgGetter";
import Link from "next/link";

import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import axios from "axios";
import ReloadComp from "./_partials/ReloadComp";
import ProfileImg from "./_partials/ProfileImg";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { UserProvider } from "../context/UserContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const revalidate = 0;

export default async function layout({ children }: { children: ReactNode }) {
  noStore();
  const cookieStore = cookies();
  const token = (await cookieStore).get("refreshTokenNew")?.value;
  let error,
    plan: "free" | "monthly pro" | "none" | undefined = undefined;
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

    if (user) {
      try {
        const response = await fetch(`${BASE_URL}/subscription`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const data = await response.json();
        plan =
          data.subscription === null
            ? "free"
            : data.subscription.status === "active"
            ? "monthly pro"
            : "none"; // Adjust if needed
      } catch (err) {
        if (axios.isAxiosError(err)) {
          error = err.message;
          console.log("Axios Error:", err.message);
        } else if (err instanceof Error) {
          error = err.message;
          console.log("Fetch Error:", err);
        } else {
          error = "An unknown error occurred.";
          console.log("Unknown Error:", error);
        }
      }
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log("Axios Error:", err.message);
      toast.error(err.message);
      redirect("/login");
    } else if (err instanceof Error) {
      console.log("Fetch Error:", err);
      redirect("/login");
    } else {
      console.log("Unknown Error:", err);
      redirect("/login");
    }
  }

  if (user)
    return (
      <UserProvider user={user as User}>
        <div className="flex flex-col h-dvh">
          <div className="flex justify-between items-center px-[30px] py-[15px] border-b-[#A6A6A654] border-solid border-b-[1px] max-[1200px]:pl-[50px] z-[997]">
            <Link
              href={"/dashboard"}
              className="font-bold text-[20px] text-[#000000]"
            >
              SPREKAR
            </Link>
            <div className="flex items-center gap-[38px]">
              <NotificationIcon />
              <div className="flex items-center gap-[10px]">
                <ProfileImg user={user} />
                <ChevronDown />
              </div>
            </div>
          </div>
          <DashboardMain plan={plan} error={error as string}>
            {error ? <ReloadComp /> : children}
          </DashboardMain>
          {/* {error ? (
        <div className="fixed bg-[#1E1E1E] left-[15px] top-[80.67px] px-[15px] pt-[30px] pb-[50px] text-[#fff] text-[16px] flex flex-col">
         
        </div>
      ) : ( */}
          <Sidebar plan={plan} error={error as string} />
          {/* )} */}
        </div>
      </UserProvider>
    );
}
