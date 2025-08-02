"use client";

import DashboardIcon from "@/app/[lng]/_svgs/DashboardIcon";
import CalenderIcon from "@/app/[lng]/_svgs/CalenderIcon";
import MicIcon from "@/app/[lng]/_svgs/MicIcon";
import PastIcon from "@/app/[lng]/_svgs/PastIcon";
import PeopleIcon from "@/app/[lng]/_svgs/PeopleIcon";
import SubscriptionIcon from "@/app/[lng]/_svgs/SubscriptionIcon";
import SettingsIcon from "@/app/[lng]/_svgs/SettingsIcon";
import ExitIcon from "@/app/[lng]/_svgs/ExitIcon";
import NavLink from "./NavLink";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ReloadBtn from "./ReloadBtn";
import { useParams } from "next/navigation";

export const dynamic = "force-static";
export const revalidate = 0;

export default function Sidebar({
  plan,
  error,
}: {
  plan: "free" | "monthly pro" | "none" | undefined;
  error: string;
}) {
  const { lng } = useParams<{ lng: string }>();
  return (
    <div
      className={cn(
        `fixed bg-[#1E1E1E] left-[15px] top-[80.67px] px-[15px] pt-[30px] pb-[50px] text-[#fff] text-[16px] max-[1200px]:top-0 max-[1200px]:left-0 max-[1200px]:collapse max-[1200px]:rounded-[0px] rounded-[10px] h-[85dvh] flex flex-col truncate`,
        error ? "min-w-[233px]" : ""
      )}
    >
      {error ? (
        <div className="flex flex-col gap-2 text-[14px] items-center bg-white rounded-xl mb-6 py-2 text-[#000]">
          <span>An error occured</span>
          <ReloadBtn />
        </div>
      ) : (
        <>
          {plan === "free" && (
            <div className="flex flex-col gap-2 text-[14px] items-center bg-white rounded-xl mb-6 py-2 text-[#000]">
              <span>You are on free plan</span>
              <Link
                href={"/dashboard/subscription"}
                className="hover hover:bg-gray-50 px-3 py-1 rounded-[12px] border border-[#000] text-[12px]"
              >
                upgrade
              </Link>
            </div>
          )}

          {plan === "monthly pro" && (
            <div className="px-2 py-1 bg-[#fff] text-[12px] inline! mb-4 rounded-xl text-black w-fit font-medium">
              Pro
            </div>
          )}

          <div className="flex flex-col justify-between gap-[35px] relative flex-1 overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
            <div className=" h-[288px]">
              <div className="flex flex-col gap-[20px] h-full">
                <NavLink
                  href={"/dashboard"}
                  className="flex items-center gap-[10px] hover:opacity-[100]"
                  lng={lng}
                >
                  <DashboardIcon /> <span>Dashboard</span>
                </NavLink>
                <NavLink
                  href={"/dashboard/manageEvents"}
                  className="flex items-center gap-[10px] hover:opacity-[100]"
                >
                  <CalenderIcon /> <span>Manage Events</span>
                </NavLink>
                <NavLink
                  href={"/dashboard/liveTranslation"}
                  className="flex items-center gap-[10px] hover:opacity-[100]"
                >
                  <MicIcon /> <span>Live Translation</span>
                </NavLink>
                <NavLink
                  href={"/dashboard/pastTranslations"}
                  className="flex items-center gap-[10px] hover:opacity-[100]"
                >
                  <PastIcon /> <span>Past Translations</span>
                </NavLink>
                <NavLink
                  href={"/dashboard/attendeeManagement"}
                  className="flex items-center gap-[10px] hover:opacity-[100]"
                >
                  <PeopleIcon /> <span>Attendee Management </span>
                </NavLink>
                <NavLink
                  href={"/dashboard/subscription"}
                  className="flex items-center gap-[10px] hover:opacity-[100]"
                >
                  <SubscriptionIcon /> <span>Subscription & Billing</span>
                </NavLink>
                <NavLink
                  href={"/dashboard/settings"}
                  className="flex items-center gap-[10px] hover:opacity-[100]"
                >
                  <SettingsIcon /> <span>Settings</span>
                </NavLink>
              </div>
            </div>

            <NavLink href="/login" className="flex items-center gap-[10px]">
              <span className="opacity-[100]">
                <ExitIcon />{" "}
              </span>
              <span className="opacity-50 hover:opacity-[100]">Log out</span>
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
}
