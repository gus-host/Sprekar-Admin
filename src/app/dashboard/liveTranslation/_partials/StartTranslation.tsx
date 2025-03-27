"use client";

import Spinner from "@/components/ui/Spinner";
import { useState } from "react";

export default function StartTranslation() {
  const [isStartingTranslation, setIsStartingTranslation] = useState(false);
  console.log(setIsStartingTranslation);
  return (
    <button
      type="submit"
      className="focus:border-none focus-visible:outline-none px-2 py-2 text-[12px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm hover:bg-[#024dc4] flex justify-center items-center gap-2"
      style={{
        fontFamily: "Helvetica Compressed, sans-serif",
        boxShadow: "0px 0px 6.4px 4px #0255DA57",
        opacity: isStartingTranslation ? "0.5" : "1",
        cursor: isStartingTranslation ? "not-allowed" : "pointer",
      }}
      disabled={isStartingTranslation}
    >
      {isStartingTranslation ? (
        <Spinner size={12} color="#fff" strokeWidth={2} />
      ) : (
        ""
      )}
      <span>
        {isStartingTranslation ? "Generating" : "Generate"} Event Code
      </span>
    </button>
  );
}
