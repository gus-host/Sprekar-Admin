import Image from "next/image";
import HomePageLayout from "../_partials/_layout/HomePageLayout";
import bgImg from "@/../public/bgImg.png";
import Header from "../_partials/Header";
import H1 from "../_partials/H1";
import Link from "next/link";
import GooglePlayHome from "../_svgs/GooglePlayHome";
import AppleHome from "../_svgs/AppleHome";

export const metadata = {
  title: "Join Event",
};

export default function page() {
  return (
    <HomePageLayout>
      <div className="min-h-[80vh] relative max-[750px]:pt-[80px] pb-[100px]">
        <div className="relative z-10">
          <Header />
          <div className="mx-auto px-[20px]">
            <H1>Join a Live Event Instantly!</H1>
            <p className="text-[#323232B2] text-[16px] text-center max-w-[550px] mx-auto mt-1">
              No signup needed. Just scan the QR code or enter the event code to
              join.
            </p>
            <div className="flex px-[20px] pl-[10px] bg-white rounded-[10px] relative max-w-[500px] mx-auto mt-[30px]">
              <input
                type="text"
                className="h-[60px] w-full border-none focus-within:border-none outline-none focus-visible:border-none focus-visible:border-b-0 active:border-none placeholder-[#7E7E7E78] pl-[20px]"
                placeholder="Enter event code to join an event"
              />
              <Link
                href={"#"}
                type="submit"
                className="absolute right-[-35px] bg-[#0255DA] top-[50%] -translate-1/2 py-[12px] flex justify-center items-center rounded text-white text-[12px] font-semibold px-[20px]"
              >
                <span className="">Join now</span>
              </Link>
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
  );
}
