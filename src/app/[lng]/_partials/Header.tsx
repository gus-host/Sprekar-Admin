"use client";

import { cn } from "@/lib/utils";
import MenuIcon from "@/app/[lng]/_svgs/MenuIcon";
import Logo from "./Logo";
import NavLinkHomeLayout from "./NavLinkHomeLayout";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import { I18params } from "./I18lngParams";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Header({ lng }: { lng: string }) {
  const { clientWidth } = useResponsiveSizes();
  const [isShowMobNav, setIsShowMobileNav] = useState(false);
  return (
    <div
      className={cn(
        "max-w-[1069px] p-[20px] mx-auto",
        "max-[1025px]:fixed max-[1025px]:w-full max-[1025px]:z-9999 max-[1025px]:top-0"
      )}
    >
      <header className="flex gap-3 justify-between items-center px-[30px] py-[15px] bg-[#1D1D1D] rounded-[15px] max-[1025px]:flex-col max-[1025px]:items-start max-[1025px]:justify-center transition-all relative">
        <div className="max-[1025px]:flex max-[1025px]:justify-between max-[1025px]:items-center max-[1025px]:w-full">
          <Link href={"/"}>
            <Logo color="text-white" type="home-logo" />
          </Link>
          <div className="hidden max-[1025px]:flex items-center gap-2">
            <span
              className="hidden max-[1025px]:inline-block cursor-pointer"
              onClick={() => setIsShowMobileNav((show) => !show)}
            >
              <MenuIcon />
            </span>
            <SelectLang lng={lng} />
          </div>
        </div>
        {(clientWidth as number) >= 1025 && (
          <nav className={cn("text-white flex items-center gap-4")}>
            <ul className="flex items-center gap-[20px] text-[14px]">
              <NavLinks lng={lng} />
            </ul>
            <SelectLang lng={lng} />
          </nav>
        )}
        {(clientWidth as number) < 1025 && isShowMobNav && (
          <>
            <MobileNav lng={lng} />
          </>
        )}
      </header>
    </div>
  );
}

function SelectLang({ lng }: I18params) {
  const [isShowPopOver, setIsShowPopOver] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu.Root
      open={isShowPopOver}
      onOpenChange={() => {
        setIsShowPopOver((show) => !show);
      }}
      modal={false}
    >
      <DropdownMenu.Trigger asChild>
        <li className="bg-white text-[12px] py-[2px] px-1 text-black rounded-sm flex items-center gap-1 cursor-pointer">
          <span>{lng === "en" ? "English" : "Dutch"}</span>{" "}
          <ChevronDown size={12} />
        </li>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side="bottom"
        align="start"
        sideOffset={6}
        className="bg-white p-1.5 rounded-sm overflow-hidden"
      >
        <ul className="flex flex-col text-black text-[12px] p-[0.5px]">
          <li
            className={cn(
              "hover:bg-gray-50 cursor-pointer p-[2px] rounded flex gap-1.5 items-center",
              lng === "en" ? "bg-gray-50" : ""
            )}
            onClick={() => {
              if (lng === "en") return;
              const newPath = pathname.replace("nl", "en");
              router.push(newPath);
            }}
          >
            <span>English</span>
            {lng === "en" && <Check size={10} />}
          </li>
          <li
            className={cn(
              "hover:bg-gray-50 cursor-pointer p-[2px] rounded flex gap-1.5 items-center",
              lng === "nl" ? "bg-gray-50" : ""
            )}
            onClick={() => {
              if (lng === "nl") return;
              const newPath = pathname.replace("en", "nl");
              router.push(newPath);
            }}
          >
            <span>Dutch</span>
            {lng === "nl" && <Check size={10} />}
          </li>
        </ul>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function MobileNav({ lng }: I18params) {
  return (
    <nav className={cn("text-white mt-6")}>
      <ul className="flex gap-[20px] text-[14px] flex-col items-start">
        <NavLinks lng={lng} />
      </ul>
    </nav>
  );
}

function NavLinks({ lng }: I18params) {
  const { t } = useTranslation(lng);
  return (
    <>
      <li>
        <NavLinkHomeLayout className="hover:opacity-[100]" href="#">
          {t("navlinks.features")}
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="/join-event">
          {t("navlinks.joinEvent")}
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="/dashboard">
          {t("navlinks.hostEvent")}
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
          {t("navlinks.aboutUs")}
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="#">
          {t("navlinks.faqs")}
        </NavLinkHomeLayout>
      </li>
      <li>
        <NavLinkHomeLayout className={"hover:opacity-[100]"} href="/contact-us">
          {t("navlinks.contact")}
        </NavLinkHomeLayout>
      </li>
    </>
  );
}
