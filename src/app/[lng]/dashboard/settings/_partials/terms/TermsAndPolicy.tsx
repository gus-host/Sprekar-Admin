"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import TermsAndPolicyDisplay from "./TermsAndPolicyDisplay";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";

export default function TermsAndPolicy() {
  const [policyIndex, setPolicyIndex] = useState<number>(0);
  const { clientWidth } = useResponsiveSizes();
  return (
    <div>
      <div
        className={cn(
          "flex justify-between text-[12px] gap-2",
          (clientWidth as number) > 645 ? "w-[60%]" : "w-full"
        )}
      >
        {["Terms of Service (TOS)", "Privacy Policy", "Cookies policy"].map(
          (policy, i) => (
            <h3
              className={cn(
                "inline-block pb-1 border-b-[1.5px] cursor-pointer",
                i === policyIndex
                  ? "text-[#1D1D1D] border-b-[#0255DA]"
                  : "text-[#929292] border-b-transparent hover:text-[#1D1D1D]"
              )}
              key={i}
              onClick={() => setPolicyIndex(i)}
            >
              {policy}
            </h3>
          )
        )}
      </div>
      <div className="my-[50px]">
        <TermsAndPolicyDisplay policyIndex={policyIndex} />
      </div>
    </div>
  );
}
