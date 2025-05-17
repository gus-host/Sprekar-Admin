"use client";

import ActiveCheckedSub from "@/app/_svgs/ActiveCheckedSub";
import UncheckedSub from "@/app/_svgs/UncheckedSub";
import React from "react";
import { useState } from "react";

export default function RadioInput({
  p,
  key,
}: {
  p: {
    id: string;
    label: string;
    price: string;
    period: string;
    discount: string | null;
  };
  key: string;
}) {
  const [plan, setPlan] = useState("yearly");
  console.log(p.id === plan);
  return (
    <label
      // key={key}
      className={`flex rounded-[8px] py-[20px] px-[15px] cursor-pointer transition-all border-[3px] gap-[30px] max-[932px]:relative
 ${plan === p.id ? "border-[#025FF3]" : "border-[#4C4C4C24]"} `}
      onClick={() => setPlan((plan) => (plan !== p.id ? p.id : plan))}
    >
      <div className="flex items-center gap-[30px]">
        {plan === p.id ? (
          <span>
            <ActiveCheckedSub />
          </span>
        ) : (
          <span
            onClick={() => setPlan((plan) => (plan !== p.id ? p.id : plan))}
          >
            <UncheckedSub />
          </span>
        )}

        <div className="text-[#323232]">
          <span className="">{p.label}</span>
          <div className="text-[20px] font-semibold">
            {p.price} / {p.period}
          </div>
        </div>
      </div>
      <div className="">
        {p.discount && (
          <div className="text-center text-[12px] text-[#025FF3] min-w-[100px] py-1 bg-[#025FF317] rounded-[8px] max-[932px]:absolute max-[932px]:right-0 max-[932px]:top-0">
            {p.discount}
          </div>
        )}
      </div>
    </label>
  );
}
