import ExportIcon from "@/app/_svgs/ExportIcon";
import React from "react";

export default function ExportBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="mt-2 sm:mt-0 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md flex items-center gap-3 max-[450px]:w-full max-[450px]:justify-center cursor-pointer"
      onClick={() => onClick?.()}
    >
      <ExportIcon />
      <span>Export</span>
    </button>
  );
}
