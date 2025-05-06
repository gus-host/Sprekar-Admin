"use client";

import { ReactNode } from "react";
import Logo from "../Logo";
import Link from "next/link";
import TwitterIcon from "@/app/_svgs/TwitterIcon";
import HistagramIcon from "@/app/_svgs/HistagramIcon";
import FacebookIcon from "@/app/_svgs/FacebookIcon";
import LinkedIn from "@/app/_svgs/LinkedIn";
import { cn } from "@/lib/utils";
import Header from "../Header";

export default function HomePageLayout({
  showedHeroBg = true,
  children,
}: {
  showedHeroBg?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative h-dvh flex flex-col justify-between">
      {/* Header */}
      <div className={cn("", `${showedHeroBg ? "hidden" : "block"}`)}>
        <Header />
      </div>
      <div>{children}</div>
      <footer className="px-[20px] bg-[#010E24] py-[40px]">
        <div className="mx-auto max-w-[1300px] flex items-center justify-between pb-[30px] border-b border-b-[#BABABAA3] max-[680px]:flex-col max-[680px]:items-start max-[680px]:gap-[40px]">
          <Link
            href={"/"}
            className="max-[680px]:mx-auto max-[680px]:min-w-[139.09px]"
          >
            <Logo color="text-white" type="home-logo" />
          </Link>
          <ul className="text-[#DDDDDD] flex gap-3 items-center text-[14px] max-[680px]:flex-col max-[680px]:items-start max-[680px]:mx-auto max-[680px]:max-w-[160px]">
            <li className="hover:text-white">
              <Link href={"/#"}>Pricing</Link>
            </li>
            <li className="hover:text-white">
              <Link href={"/terms-and-conditions"}>Terms and conditions</Link>
            </li>
            <li className="hover:text-white">
              <Link href={"/privacy-policy"}>Privacy policy</Link>
            </li>
          </ul>
          <ul className="flex gap-3 items-center max-[680px]:mx-auto max-[680px]:min-w-[139.09px]">
            <li>
              <Link href={"/#"}>
                <TwitterIcon />
              </Link>
            </li>
            <li>
              <Link href={"/#"}>
                <HistagramIcon />
              </Link>
            </li>
            <li>
              <Link href={"/#"}>
                <FacebookIcon />
              </Link>
            </li>
            <li>
              <Link href={"/#"}>
                <LinkedIn />
              </Link>
            </li>
          </ul>
        </div>
        <p className="mt-6 text-[#B1B1B161] text-center text-[12px]">
          © {new Date().getFullYear()} Sprekar. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
