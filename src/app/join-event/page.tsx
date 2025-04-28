import Image from "next/image";
import HomePageLayout from "../_partials/_layout/HomePageLayout";
import bgImg from "@/../public/bgImg.png";
import Header from "../_partials/Header";
import H1 from "../_partials/H1";
import Link from "next/link";

export const metadata = {
  title: "Join Event",
};

export default function page() {
  return (
    <HomePageLayout>
      <div className="min-h-[80vh] relative max-[750px]:pt-[80px]">
        <div className="relative z-10">
          <Header />
          <div className="mx-auto px-[20px]">
            <H1>Join a Live Event Instantly!</H1>
            <p className="text-[#323232B2] text-[16px] text-center max-w-[550px] mx-auto mt-1">
              No signup needed. Just scan the QR code or enter the event code to
              join.
            </p>
            <div className="flex px-[20px] pl-[10px] bg-white rounded-[10px] relative">
              <input type="text" className="h-[40px]" />
              <Link
                href={"#"}
                type="submit"
                className="absolute right-0 bg-[#0255DA]"
              >
                Join now
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
