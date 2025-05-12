"use client";

import { hostEventSteps, joinEventSteps } from "@/app/_partials/homePageData";
import { cn } from "@/lib/utils";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import Image from "next/image";
import { useState } from "react";

export default function JoinOrHostEventSteps() {
  const [stepType, setStepType] = useState<"join" | "host">("join");
  const { clientWidth } = useResponsiveSizes();
  return (
    <>
      <div className="flex items-center mb-[45px]">
        <p
          className={cn(
            `py-[3px] px-[10px] rounded-[3px]  text-[12px] font-normal cursor-pointer`,
            stepType === "join" && "bg-[#025FF3]"
          )}
          onClick={() =>
            setStepType((step) => (step === "host" ? "join" : "join"))
          }
        >
          Join an event / conversation
        </p>
        <p
          className={cn(
            `py-[3px] px-[10px] rounded-[3px] text-[12px] font-normal cursor-pointer`,
            stepType === "host" && "bg-[#025FF3]"
          )}
          onClick={() =>
            setStepType((step) => (step === "join" ? "host" : "host"))
          }
        >
          Host an event
        </p>
      </div>
      <div className="grid grid-cols-6 gap-x-[30px] gap-y-[40px] max-[892px]:grid-cols-4 max-[603px]:grid-cols-2">
        {/* Event Card */}
        {(stepType === "join" ? joinEventSteps : hostEventSteps).map(
          (step, i) => (
            <div
              key={i}
              className={cn(
                "backdrop-blur-[11.800000190734863px] bg-[#FFFFFF21] py-[25px] px-[20px] rounded-[10px] relative",

                `${
                  i === 0
                    ? "min-[892px]:col-start-1 min-[892px]:col-end-3 max-[892px]:col-start-1 max-[892px]:col-end-3 max-[603px]:col-start-1 max-[603px]:col-end-3"
                    : i === 1
                    ? "min-[892px]:col-start-3 min-[892px]:col-end-5 max-[892px]:col-start-3 max-[892px]:col-end-5 max-[603px]:col-start-1 max-[603px]:col-end-3"
                    : i === 2
                    ? "min-[892px]:col-start-5 min-[892px]:col-end-7 max-[892px]:col-start-1 max-[892px]:col-end-3 max-[603px]:col-start-1 max-[603px]:col-end-3"
                    : i === 3
                    ? "min-[892px]:col-start-2 min-[892px]:col-end-4 max-[892px]:col-start-3 max-[892px]:col-end-5 max-[603px]:col-start-1 max-[603px]:col-end-3"
                    : "min-[892px]:col-start-4 min-[892px]:col-end-6 max-[892px]:col-start-1 max-[892px]:col-end-3 max-[603px]:col-start-1 max-[603px]:col-end-3"
                }`,
                (clientWidth as number) < 892 &&
                  (clientWidth as number) >= 603 &&
                  `${
                    i === 0
                      ? "col-start-1 col-end-3"
                      : i === 1
                      ? "col-start-3 col-end-5"
                      : i === 2
                      ? "col-start-1 col-end-3"
                      : i === 3
                      ? "col-start-3 col-end-5"
                      : "col-start-1 col-end-3"
                  }`,
                (clientWidth as number) < 603 && "col-start-1 col-end-3"
              )}
            >
              <span className="absolute right-0 top-0 -translate-y-1/2">
                {step.stepNum}
              </span>
              <h3 className="mb-[10px]">{step.title}</h3>
              <p className="text-[14px] text-[#E2E2E2] mb-[35px] leading-[1.5]">
                {step.desc}
              </p>
              <div className="bg-white flex justify-center items-center rounded-[10px] h-[177px] overflow-hidden">
                <Image
                  src={step.img}
                  alt={step.alt as string}
                  placeholder="blur"
                  quality={100}
                />
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
