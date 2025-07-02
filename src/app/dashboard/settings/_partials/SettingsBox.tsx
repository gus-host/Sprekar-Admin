"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { settingsHeading } from "./data";
import SettingsDisplay from "./SettingsDisplay";
import { useRouter } from "next/navigation";
import { Bell, FileText, Lock, MessageCircle, Settings } from "lucide-react";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";

export default function SettingsBox({ settings }: { settings?: string }) {
  const [activeSetting, setActiveSetting] = useState<number>(0);
  const router = useRouter();
  const { clientWidth } = useResponsiveSizes();

  useEffect(() => {
    if (settings === undefined) return setActiveSetting(0);
    setActiveSetting(settingsHeading.indexOf(settings as string));
  }, [settings]);

  const mobileSettingIcons = [
    <Settings size={24} />,
    <Bell size={24} />,
    <Lock size={24} />,
    <MessageCircle size={24} />,
    <FileText size={24} />,
  ];

  return (
    <div>
      <div
        className={cn(
          "mb-6",
          (clientWidth as number) > 710 ? "inline-block" : "block"
        )}
      >
        <ul
          className={cn(
            "p-2 bg-white rounded flex gap-3",
            (clientWidth as number) > 710 ? "w-auto" : "w-full justify-between"
          )}
        >
          {(clientWidth as number) > 710
            ? settingsHeading.map((heading, i) => (
                <li
                  key={i}
                  className={cn(
                    "inline-block py-[5px] px-[10px] text-[13px] rounded cursor-pointer",
                    activeSetting === i
                      ? "bg-[#0255DA]"
                      : "bg-transparent hover:bg-gray-50",
                    activeSetting === i ? "text-white" : "text-black"
                  )}
                  onClick={() => {
                    router.push(
                      `/dashboard/settings?setting=${settingsHeading[i]}`
                    );
                  }}
                >
                  {heading}
                </li>
              ))
            : mobileSettingIcons.map((heading, i) => (
                <li
                  key={i}
                  className={cn(
                    "cursor-pointer",
                    activeSetting === i
                      ? "bg-[#0255DA]"
                      : "bg-transparent hover:bg-gray-50",
                    activeSetting === i ? "text-white" : "text-black"
                  )}
                  onClick={() => {
                    router.push(
                      `/dashboard/settings?setting=${settingsHeading[i]}`
                    );
                  }}
                >
                  {heading}
                </li>
              ))}
        </ul>
      </div>

      <SettingsDisplay activeSetting={activeSetting} />
    </div>
  );
}
