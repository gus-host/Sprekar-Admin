import { cn } from "@/lib/utils";
import React from "react";
import Spinner from "./ui/Spinner";

export default function Button({
  text,
  classNames,
  type,
  isLoading,
}: {
  text: string;
  classNames?: string;
  type?: "submit" | "reset" | "button";
  isLoading?: boolean;
}) {
  return (
    <button
      className={cn(
        `w-full bg-[#025FF3] hover:bg-[#024dc4] py-[12px] text-center text-white text-[14px] focus:outline-none focus:border-none flex justify-center items-center`,
        classNames
      )}
      style={{
        opacity: isLoading ? "0.5" : "1",
        cursor: isLoading ? "not-allowed" : "pointer",
      }}
      disabled={isLoading}
      type={type}
    >
      <span>
        {" "}
        {isLoading ? <Spinner size={24} color="#fff" strokeWidth={3} /> : text}
      </span>
    </button>
  );
}
