"use client";

import { ReactNode } from "react";
import { nunitoSans, robotoSerif } from "./fontFamilies";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import { cn } from "@/lib/utils";

export default function H1({ children }: { children: ReactNode }) {
  const { clientWidth } = useResponsiveSizes();
  return (
    <h1
      className={cn(
        `mt-[60px] text-[44px] text-center font-black max-[820px]:text-[26px]`,
        `${
          (clientWidth as number) >= 820
            ? robotoSerif.className
            : nunitoSans.className
        } `
      )}
    >
      {children}
    </h1>
  );
}
