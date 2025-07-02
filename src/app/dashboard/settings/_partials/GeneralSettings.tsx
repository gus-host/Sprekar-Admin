"use client";
import { useState } from "react";
import GeneralSettingBox from "./GeneralSettingBox";
import { cn } from "@/lib/utils";
import SettingDark from "@/app/_svgs/SettingDark";
import SettingLight from "@/app/_svgs/SettingLight";

export default function GeneralSettings() {
  const [selectedLang, setSelectedLang] = useState("English");
  return (
    <div>
      <GeneralSettingBox
        title={"locale"}
        description="Preferred language settings"
      >
        <div className="inline-block bg-[#F5F5F5] px-2 rounded cursor-pointer">
          <select
            name="language"
            id="select-language"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="border-0 active:border-0 focus-visible:border-0 focus-visible:border-none focus:border-0 text-[12px] pr-6 py-2 inline-block"
          >
            <option value={"Engilsh"}>English</option>
            <option value={"Dutch"}>Dutch</option>
          </select>
        </div>
      </GeneralSettingBox>
      <GeneralSettingBox
        title="Time Zone"
        description="Update automatically based on local timezone"
      >
        <p className="text-[12px]">America/New York</p>
      </GeneralSettingBox>
      <GeneralSettingBox title="Time Format">
        <TimeSwitch />
      </GeneralSettingBox>
      <GeneralSettingBox title="Color Theme">
        <ThemeSwitch />
      </GeneralSettingBox>
    </div>
  );
}

function TimeSwitch() {
  const [activeTime, setActiveTime] = useState<"12" | "24">("24");
  return (
    <ul className="flex p-0.5 bg-[#F0F0F0E3] rounded text-[10px] cursor-pointer">
      {["12", "24"].map((hour, i) => (
        <li
          key={i}
          className={cn(
            "py-1 px-2 rounded",
            activeTime === hour ? "bg-white" : "bg-auto"
          )}
          onClick={() => setActiveTime((time) => (time === "12" ? "24" : "12"))}
        >
          {hour} hours
        </li>
      ))}
    </ul>
  );
}
function ThemeSwitch() {
  const [activeTheme, setActiveTheme] = useState<"system" | "light" | "dark">(
    "system"
  );
  return (
    <ul className="flex p-0.5 bg-[#F0F0F0E3] rounded text-[12px] cursor-pointer">
      {["system", "light", "dark"].map((theme, i) => (
        <li
          key={i}
          className={cn(
            "py-1 px-2 rounded flex gap-1 items-center capitalize",
            activeTheme === theme ? "bg-white" : "bg-auto"
          )}
          onClick={() => setActiveTheme(theme as "system" | "light" | "dark")}
        >
          {theme}{" "}
          {theme === "dark" ? (
            <SettingDark />
          ) : theme === "light" ? (
            <SettingLight />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
