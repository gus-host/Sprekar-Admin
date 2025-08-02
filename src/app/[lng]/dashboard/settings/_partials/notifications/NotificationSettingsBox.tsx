import SettingsToggle from "@/components/ui/SettingsToggle";
import React from "react";

export default function NotificationSettingsBox({
  type,
  isToggle,
}: {
  type: string;
  isToggle: boolean;
}) {
  return (
    <div className="flex justify-between border-b-[#E3E3E3] border-b py-3 items-center">
      <h4 className="text-[14px]">{type}</h4>
      <SettingsToggle isActive={isToggle} />
    </div>
  );
}
