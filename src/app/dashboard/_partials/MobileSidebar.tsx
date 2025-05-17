"use client";

import DashboardIcon from "@/app/_svgs/DashboardIcon";
import CalenderIcon from "@/app/_svgs/CalenderIcon";
import MicIcon from "@/app/_svgs/MicIcon";
import PastIcon from "@/app/_svgs/PastIcon";
import PeopleIcon from "@/app/_svgs/PeopleIcon";
import SubscriptionIcon from "@/app/_svgs/SubscriptionIcon";
import SettingsIcon from "@/app/_svgs/SettingsIcon";
import ExitIcon from "@/app/_svgs/ExitIcon";
import NavLink from "./NavLink";
import React, { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import { cn } from "@/lib/utils";
import ReloadBtn from "./ReloadBtn";
import Link from "next/link";

export default function MobileSidebar({
  classNames,
  setIsShowNav,
  plan,
  error,
}: {
  classNames?: string;
  setIsShowNav: React.Dispatch<React.SetStateAction<boolean>>;
  plan: "free" | "monthly pro" | "none" | undefined;
  error: string;
}) {
  const { height, width } = useWindowSize();
  const [clientHeight, setClientHeight] = useState<number | null>(null);
  const [clientWidth, setClientWidth] = useState<number | null>(null);

  // Set height only after mounting to avoid hydration errors
  useEffect(() => {
    setClientHeight(height);
    setClientWidth(width);
  }, [height, width]);
  return (
    <div
      className={cn(
        `fixed bg-[#1E1E1E] left-[15px] top-[80.67px] px-[15px] pt-[30px] pb-[50px] text-[#fff] text-[16px] max-[1200px]:top-0 max-[1200px]:left-0 z-[999] transition-all flex flex-col`,
        classNames,
        error ? "min-w-[233px]" : ""
      )}
      style={{
        height:
          clientHeight && clientWidth && clientWidth > 1200
            ? `${clientHeight - 110.67}px`
            : clientWidth && clientWidth < 1200
            ? "100dvh"
            : "82%",
        borderRadius:
          clientWidth && clientWidth >= 1200
            ? "10px"
            : clientWidth && clientWidth < 1200
            ? "0"
            : "10px",
      }}
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
          <div className="flex flex-col justify-between gap-[35px] h-full relative">
            <div className="flex flex-col gap-[20px] overflow-y-auto h-[288px] scrollbar-thin scrollbar-thumb-white scrollbar-track-[transparent]">
              <NavLink
                href={"/dashboard"}
                className="flex items-center gap-[10px] hover:opacity-[100]"
                onClick={() => setIsShowNav((show) => !show)}
              >
                <DashboardIcon /> <span>Dashboard</span>
              </NavLink>
              <NavLink
                href={"/dashboard/manageEvents"}
                className="flex items-center gap-[10px] hover:opacity-[100]"
                onClick={() => setIsShowNav((show) => !show)}
              >
                <CalenderIcon /> <span>Manage Events</span>
              </NavLink>
              <NavLink
                href={"/dashboard/liveTranslation"}
                className="flex items-center gap-[10px] hover:opacity-[100]"
                onClick={() => setIsShowNav((show) => !show)}
              >
                <MicIcon /> <span>Live Translation</span>
              </NavLink>
              <NavLink
                href={"/dashboard/pastTranslations"}
                className="flex items-center gap-[10px] hover:opacity-[100]"
                onClick={() => setIsShowNav((show) => !show)}
              >
                <PastIcon /> <span>Past Translations</span>
              </NavLink>
              <NavLink
                href={"/dashboard/attendeeMangement"}
                className="flex items-center gap-[10px] hover:opacity-[100]"
                onClick={() => setIsShowNav((show) => !show)}
              >
                <PeopleIcon /> <span>Attendee Management </span>
              </NavLink>
              <NavLink
                href={"/dashboard/subscription"}
                className="flex items-center gap-[10px] hover:opacity-[100]"
                onClick={() => setIsShowNav((show) => !show)}
              >
                <SubscriptionIcon /> <span>Subscription & Billing</span>
              </NavLink>
              <NavLink
                href={"/dashboard/settings"}
                className="flex items-center gap-[10px] hover:opacity-[100]"
                onClick={() => setIsShowNav((show) => !show)}
              >
                <SettingsIcon /> <span>Settings</span>
              </NavLink>
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
