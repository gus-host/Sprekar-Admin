import Image from "next/image";
import HomePageLayout from "../_partials/_layout/HomePageLayout";
import bgImg from "@/../public/bgImg.png";
import Header from "../_partials/Header";
import H1 from "../_partials/H1";
import Link from "next/link";
import GooglePlayHome from "../_svgs/GooglePlayHome";
import AppleHome from "../_svgs/AppleHome";
import JoinEventForm from "./_partials/JoinEventForm";

export const metadata = {
  title: "Join Event",
};
const VISITOR_TOKEN = process.env.VISITOR_ACCESS_TOKEN;

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
            <JoinEventForm token={VISITOR_TOKEN as string} />
          </div>
          <div className="hidden max-[675px]:block mt-[20px]">
            <p className="text-center text-[14px] text-[#01378D] font-semibold">
              Join with QR code
            </p>
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
