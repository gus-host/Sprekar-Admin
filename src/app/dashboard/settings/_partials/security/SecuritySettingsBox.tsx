"use client";

import ToggleActiveRounded from "@/app/_svgs/ToggleActiveRounded";
import ToogleInactiveRounded from "@/app/_svgs/ToogleInactiveRounded";
import React, { ReactNode, useState } from "react";

export default function SecuritySettingsBox({
  title,
  isOpen2faOptions,
  onClick,
  isOpenLogs,
  children,
}: {
  title: string;
  isOpenLogs?: boolean;
  isOpen2faOptions?: boolean;
  onClick(): void;
  children: ReactNode;
}) {
  const [active2fa, setActive2fa] = useState<"email" | "sms">("sms");
  return (
    <div className="bg-[#E1E1E1] border border-[#e1e1e1ec] rounded py-2.5 px-2">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onClick}
      >
        <h3 className="text-[12px]">{title}</h3>
        {children}
      </div>
      {isOpenLogs && (
        <div className={"flex flex-col gap-4 my-6"}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <h4 className="text-[14px] text-[#3C3838] mb-2">
                  Your Sprekar password was changed
                </h4>
                <p className="text-[12px] text-[#747474]">
                  Sent to johndoe89@outlook.com
                </p>
              </div>
              <p className="text-[12px] text-[#747474]">Jan 23, 2025 22:03PM</p>
            </div>
          ))}
        </div>
      )}
      {isOpen2faOptions && (
        <div className="flex flex-col gap-3 my-4" onClick={() => {}}>
          {["SMS", "Email"].map((authType, i) => (
            <div
              key={i}
              className="flex gap-3 items-center cursor-pointer"
              onClick={() => setActive2fa(authType === "SMS" ? "sms" : "email")}
            >
              {(authType === "SMS" && active2fa === "sms") ||
              (authType === "Email" && active2fa === "email") ? (
                <ToggleActiveRounded />
              ) : (
                <ToogleInactiveRounded />
              )}
              <p className="text-[12px] text-[#747474]">
                {authType} Verification.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
