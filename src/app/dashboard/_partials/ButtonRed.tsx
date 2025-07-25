import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function ButtonRed({
  onClick,
  classNames,
  children,
}: {
  onClick?: () => void;
  classNames?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "focus:border-none focus-visible:outline-none px-6 py-2 text-[12px] text-white bg-[#FF0000] font-bold tracking-[-.5px] rounded-sm flex justify-center items-center gap-2 hover:shadow-red cursor-pointer",
        classNames
      )}
      style={{
        fontFamily: "Helvetica Compressed, sans-serif",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
