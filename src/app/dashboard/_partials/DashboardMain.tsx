"use client";

import { ReactNode, useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import MobileSidebar from "./MobileSidebar";
import ChevronLeftRounded from "@/app/_svgs/ChevronLeftRounded";

export default function DashboardMain({ children }: { children: ReactNode }) {
  const [isShowNav, setIsShowNav] = useState(true);
  const { height, width } = useWindowSize();
  const [clientHeight, setClientHeight] = useState<number | null>(null);
  const [clientWidth, setClientWidth] = useState<number | null>(null);

  // Set height only after mounting to avoid hydration errors
  useEffect(() => {
    setClientHeight(height);
    setClientWidth(width);
  }, [height, width]);
  return (
    <>
      <div
        className={`flex-1 relative transition-all duration-400 pl-0 min-[1200px]:pl-[262.32px]`}
        style={{
          height: clientHeight ? `${clientHeight - 60.67}px` : "80vh",
          overflowY: "auto",
        }}
      >
        {clientWidth && clientWidth <= 1200 && (
          <MobileSidebar
            setIsShowNav={setIsShowNav}
            classNames={`${
              isShowNav ? "translate-x-[-100%]" : "translate-x-[0]"
            }`}
          />
        )}

        {clientWidth && clientWidth <= 1200 && (
          <span
            className={`fixed top-[100px] w-[24px] h-[24px] rounded-full bg-[#FCFCFC] flex justify-center items-center border-gray-400 border-solid border-[1px] cursor-pointer hover:bg-gray-300 max-[1200px]:top-[15px] max-[1200px]:left-[190px] z-[999]`}
            onClick={() => setIsShowNav((show) => !show)}
            style={{
              left:
                isShowNav && clientWidth && clientWidth <= 1200
                  ? "15px"
                  : "190px",
            }}
          >
            <ChevronLeftRounded />
          </span>
        )}
        <div className="max-w-[1000px] mx-auto px-[30px] py-[20px]">
          {children}
        </div>
      </div>
      {!isShowNav && clientWidth && clientWidth <= 1200 && (
        <div
          className="fixed top-0 left-0 w-dvw h-dvh bg-black opacity-30 z-[998]"
          onClick={() => setIsShowNav((show) => !show)}
        ></div>
      )}
    </>
  );
}
