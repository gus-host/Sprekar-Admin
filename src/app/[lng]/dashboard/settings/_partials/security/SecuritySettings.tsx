"use client";

import React, { useState } from "react";
import SecuritySettingsBox from "./SecuritySettingsBox";
import SettingsToggle from "@/components/ui/SettingsToggle";
import SettingsChevronDown from "@/app/[lng]/_svgs/SettingsChevronDown";
import SettingsChevronUp from "@/app/[lng]/_svgs/SettingsChevronUp";

export default function SecuritySettings() {
  const [toggle2fa, setToggle2fa] = useState<boolean>(false);
  const [isOpenLogs, setIsOpenLogs] = useState(false);
  function authToggler() {
    setToggle2fa((active) => !active);
  }
  function logToggler() {
    setIsOpenLogs((active) => !active);
  }

  return (
    <div className="flex flex-col gap-5">
      <SecuritySettingsBox
        isOpen2faOptions={toggle2fa}
        title="2-Factor Authentication"
        onClick={authToggler}
      >
        <SettingsToggle isActive={toggle2fa} />
      </SecuritySettingsBox>
      <SecuritySettingsBox
        isOpenLogs={isOpenLogs}
        title="Login activities"
        onClick={logToggler}
      >
        {isOpenLogs ? (
          <span className="cursor-pointer">
            <SettingsChevronDown />
          </span>
        ) : (
          <span className="cursor-pointer">
            <SettingsChevronUp />
          </span>
        )}
      </SecuritySettingsBox>
    </div>
  );
}
