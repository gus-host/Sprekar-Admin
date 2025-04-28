"use client";

import { cn } from "@/lib/utils";
import MenuIcon from "../_svgs/MenuIcon";
import Logo from "./Logo";
import NavLinkHomeLayout from "./NavLinkHomeLayout";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import { useState } from "react";

export default function Header() {
  const { clientWidth } = useResponsiveSizes();
  const [isShowMobNav, setIsShowMobileNav] = useState(false);
  return (
    <div
      className={cn(
        "max-w-[1000px] p-[20px] mx-auto",
        "max-[750px]:fixed max-[750px]:w-full max-[750px]:z-9999 max-[750px]:top-0"
      )}
    >
      <header className="flex gap-3 justify-between items-center px-[30px] py-[15px] bg-[#1D1D1D] rounded-[15px] max-[750px]:flex-col max-[750px]:items-start max-[750px]:justify-center transition-all relative">
        <div className="max-[750px]:flex max-[750px]:justify-between max-[750px]:items-center max-[750px]:w-full">
          <Logo color="text-white" type="home-logo" />
          <span
            className="hidden max-[750px]:inline-block cursor-pointer"
            onClick={() => setIsShowMobileNav((show) => !show)}
          >
            <MenuIcon />
          </span>
        </div>
        {(clientWidth as number) >= 750 && (
          <nav className={cn("text-white")}>
            <ul className="flex items-center gap-[20px] text-[14px]">
              <NavLinks />
            </ul>
          </nav>
        )}
        {(clientWidth as number) < 750 && isShowMobNav && <MobileNav />}
      </header>
    </div>
  );
}

function MobileNav() {
  return (
    <nav className={cn("text-white mt-6")}>
      <ul className="flex gap-[20px] text-[14px] flex-col items-start">
        <NavLinks />
      </ul>
    </nav>
  );
}

function NavLinks() {
  return (
    <>
      <li>
        <NavLinkHomeLayout className="hover:opacity-[100]" href="#">
          Features
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="/join-event">
          Join event
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
          Host an event
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
          About Us
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
          FAQs
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
          Contact
        </NavLinkHomeLayout>
      </li>
    </>
  );
}
