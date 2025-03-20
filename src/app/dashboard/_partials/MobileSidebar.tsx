"use client";

import DashboardIcon from "@/public/svgs/DashboardIcon";
import CalenderIcon from "@/public/svgs/CalenderIcon";
import MicIcon from "@/public/svgs/MicIcon";
import PastIcon from "@/public/svgs/PastIcon";
import PeopleIcon from "@/public/svgs/PeopleIcon";
import SubscriptionIcon from "@/public/svgs/SubscriptionIcon";
import SettingsIcon from "@/public/svgs/SettingsIcon";
import ExitIcon from "@/public/svgs/ExitIcon";
import NavLink from "./NavLink";
import React, { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import { cn } from "@/lib/utils";

export default function MobileSidebar({
  classNames,
  setIsShowNav,
}: {
  classNames?: string;
  setIsShowNav: React.Dispatch<React.SetStateAction<boolean>>;
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
        `fixed bg-[#1E1E1E] left-[15px] top-[80.67px] px-[15px] pt-[30px] pb-[50px] text-[#fff] text-[16px] max-[1200px]:top-0 max-[1200px]:left-0 z-[999] transition-all`,
        classNames
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
        <div className="hover:opacity-[100]">
          <span className="flex items-center gap-[10px] cursor-pointer">
            <ExitIcon />{" "}
            <span className="opacity-50 hover:opacity-[100]">Log out</span>
          </span>
        </div>
      </div>
    </div>
  );
}
