import { ReactNode } from "react";
import authImg from "@/../public/Auth-bg-img.png";
import Image from "next/image";
import Logo from "../Logo";
import { Roboto_Serif } from "next/font/google";
import Link from "next/link";

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  display: "swap",
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh ">
      <div className="flex-1 bg-[#D9D9D9] py-[30px] pl-[40px] relative max-[1200px]:hidden">
        <div className="absolute z-[99]">
          <Link href={"/"} className="inline-block">
            <Logo />
          </Link>
          <div className="mt-[120px]">
            <h1
              className={`${robotoSerif.className} text-[#000] mb-1 text-[20px]`}
            >
              Welcome to Sprekar for Organizations!
            </h1>
            <p className="text-[#747474] text-[16px]">
              Seamlessly host multilingual events with real-time translations
            </p>

            <ul className="mt-17 text-[#424242] flex flex-col gap-1 text-[14px] list-disc pl-3">
              <li>Manage live events with instant language translation.</li>
              <li>Engage a global audience effortlessly.</li>
              <li>Get AI-powered summaries for every session.</li>
            </ul>
          </div>
        </div>
        <Image
          src={authImg}
          alt="Background Image"
          fill
          placeholder="blur"
          quality={100}
          className="object-cover object-center"
        />
      </div>

      <div className="min-w-[650px] pl-[50px] mt-[90px] mb-[110px] max-[1200px]:min-w-full max-[1200px]:px-[30px]">
        <div className="max-[1200px]:flex hidden mb-7 max-[1200px]:justify-center max-[540px]:justify-start">
          <Logo />
        </div>
        <div className="flex flex-col max-w-[500px] max-[1200px]:mx-auto ">
          {children}
        </div>
      </div>
      {/* <div></div> */}
    </div>
  );
}
