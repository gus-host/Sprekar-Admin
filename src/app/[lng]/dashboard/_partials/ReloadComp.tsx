"use client";

import React from "react";
import ReloadBtn from "./ReloadBtn";

export default function ReloadComp() {
  return (
    <div
      className="h-[60dvh] flex-col gap-3
     w-full justify-center items-center flex"
    >
      <p>An error occured</p>
      <ReloadBtn />
    </div>
  );
}
