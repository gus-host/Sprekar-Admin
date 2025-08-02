import Link from "next/link";
import React from "react";

export default function ReloadBtn() {
  return (
    <Link
      href={"#"}
      className="hover hover:bg-gray-50 px-3 py-1 rounded-[12px] border border-[#000] text-[12px]"
      onClick={() => window.location.reload()}
    >
      Reload
    </Link>
  );
}
