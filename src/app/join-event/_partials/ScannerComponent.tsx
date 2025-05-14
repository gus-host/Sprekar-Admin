"use client";

import Image from "next/image";
import bgImg from "@/../public/bgImg.png";
import Link from "next/link";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React, { useState } from "react";
import HomePageLayout from "@/app/_partials/_layout/HomePageLayout";
import Header from "@/app/_partials/Header";
import H1 from "@/app/_partials/H1";
import GooglePlayHome from "@/app/_svgs/GooglePlayHome";
import AppleHome from "@/app/_svgs/AppleHome";
import JoinEventForm from "./JoinEventForm";
import ScannerPage from "./ScannerPage";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";

export type Anchor = "right";

export default function ScannerComponent({ token }: { token: string }) {
  const [state, setState] = useState({
    right: false,
  });

  const { clientWidth } = useResponsiveSizes();

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <div
      className="w-dvw"
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <ScannerPage
        anchor={anchor}
        toggleDrawer={toggleDrawer}
        eventName="Morning Service"
        token={token as string}
      />
    </div>
  );
  return (
    <div>
      {(["right"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <HomePageLayout>
            <div className="min-h-[80vh] relative max-[750px]:pt-[80px] pb-[100px]">
              <div className="relative z-10">
                <Header />
                <div className="mx-auto px-[20px]">
                  <H1>Join a Live Event Instantly!</H1>
                  <p className="text-[#323232B2] text-[16px] text-center max-w-[550px] mx-auto mt-1">
                    No signup needed. Just scan the QR code or enter the event
                    code to join.
                  </p>
                  <JoinEventForm token={token as string} />
                </div>
                <div className="hidden max-[675px]:block mt-[20px]">
                  <div className="flex justify-center">
                    <Button onClick={toggleDrawer(anchor, true)}>
                      <span
                        className="text-center text-[14px] text-[#01378D] font-semibold cursor-pointer"
                        style={{
                          textTransform: "none",
                        }}
                      >
                        Join with QR code
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center mt-[40px] mx-auto px-[20px]">
                  <div className="flex gap-[14px] items-center">
                    {/* Apple and Google */}
                    <Link
                      href="#"
                      className={
                        "px-[10px] py-[3px] inline-block rounded cursor-pointer"
                      }
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 50%, #025FF3 0%, #01378D 100%)",
                      }}
                    >
                      <AppleHome />
                    </Link>
                    <Link
                      href="#"
                      className={
                        "px-[10px] py-[3px] inline-block rounded cursor-pointer"
                      }
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 50%, #025FF3 0%, #01378D 100%)",
                      }}
                    >
                      <GooglePlayHome />
                    </Link>
                  </div>
                </div>
              </div>
              <Image
                src={bgImg}
                alt="Hero background image"
                placeholder="blur"
                fill
                className="object-cover object-top"
                quality={100}
              />
            </div>
          </HomePageLayout>
          {(clientWidth as number) < 675 && (
            <SwipeableDrawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              {list(anchor)}
            </SwipeableDrawer>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
