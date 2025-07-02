"use client";

import React from "react";
import ToggleActive from "@/app/_svgs/ToggleActive";
import ToggleInactive from "@/app/_svgs/ToggleInactive";

export default function SettingsToggle({
  isActive = false,
  setIsActive,
}: {
  isActive: Boolean;
  setIsActive?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      {isActive ? (
        <span
          className="cursor-pointer"
          onClick={() => {
            if (!setIsActive) return;
            setIsActive((active) => !active);
          }}
        >
          <ToggleActive />{" "}
        </span>
      ) : (
        <span
          className="cursor-pointer"
          onClick={() => {
            if (!setIsActive) return;
            setIsActive((active) => !active);
          }}
        >
          <ToggleInactive />
        </span>
      )}
    </>
  );
}
