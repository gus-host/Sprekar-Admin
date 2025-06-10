import Image from "next/image";
import HomePageLayout from "./_partials/_layout/HomePageLayout";
import AppleHome from "./_svgs/AppleHome";
import bgImg from "@/../public/bgImg.png";
import phoneWithLanguages from "@/../public/PhoneWithLanguages.png";
import Header from "./_partials/Header";
import { robotoSerif } from "./_partials/fontFamilies";
import GooglePlayHome from "./_svgs/GooglePlayHome";
import Link from "next/link";
import HeroVideo from "./_partials/HeroVideo";
import JoinOrHostEventSteps from "./_partials/JoinOrHostEventSteps";
import Swiper from "./_partials/Swiper";
import { cn } from "@/lib/utils";
import { subscriptionPlans } from "./_partials/homePageData";
import H1 from "./_partials/H1";
import FeatureScroll from "@/components/FeatureScroll";

export default function Home() {
  return (
    <div className="bg-[#F8F8F8]">
      <HomePageLayout>
        <div style={{ overflowX: "hidden" }}>
          <section className="relative max-[750px]:pt-[80px]">
            {/* HERO SECTION */}

            <div className="relative z-10">
              <Header />
              <div className="mx-auto px-[20px]">
                <H1>Speak. Understand. Connect.</H1>
                <p className="text-[#323232B2] text-[16px] text-center max-w-[520px] mx-auto mt-1">
                  Instantly translate speech, live events, and conversations in
                  real-time with AI-powered accuracy
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
              <div className="px-[30px] max-w-[1300px] mx-auto rounded-[30px] overflow-hidden max-h-[580px] mb-[40px]">
                <HeroVideo />
              </div>
            </div>
            <Image
              src={bgImg}
              alt="Hero background image"
              fill
              className="object-cover object-top"
              quality={100}
            />
          </section>
          <section
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, #025FF3 0%, #01378D 100%)",
              padding: "40px 20px",
              color: "#fff",
            }}
          >
            <div className="mx-auto max-w-[1100px]">
              {/* JOIN OR EVENT SECTION */}
              <h3 className="text-[12px] font-medium mb-1">
                Break Language Barriers Instantly
              </h3>
              <h2
                className={`${robotoSerif.className} text-[32px] font-black leading-[1.3] max-w-[600px] mb-[30px] max-[820px]:text-[20px]`}
              >
                understand the world in real time—seamlessly and effortlessly.
              </h2>
              <JoinOrHostEventSteps />
            </div>
          </section>
          <section className="px-[20px] relative">
            {/* FEATURES SECTION */}
            {/* <Swiper /> */}
            <FeatureScroll />
          </section>
          <section
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, #025FF3 0%, #01378D 100%)",
              padding: "40px 20px",
              color: "#fff",
            }}
          >
            {/* PRICING SECTION */}
            <div className="mx-auto max-w-[1100px]">
              <h3 className="text-[12px] font-medium mb-1">Pricing Plans</h3>
              <h2
                className={`${robotoSerif.className} text-[32px] font-black leading-[1.3] max-w-[400px] mb-[30px] max-[819px]:text-[20px]`}
              >
                Choose the plan that best fits your needs
              </h2>
              <div className="grid grid-cols-6 max-[819px]:grid-cols-2 max-[819px]:gap-y-[20px]">
                {subscriptionPlans.map((sub, i) => (
                  <div
                    key={i}
                    className={cn(
                      "backdrop-blur-[11.800000190734863px] bg-[#FFFFFF21] py-[25px] px-[20px] rounded-[10px] relative",
                      `${
                        i === 0
                          ? "min-[819px]:col-start-1 min-[819px]:col-end-3 max-[819px]:col-start-1 max-[819px]:col-end-3"
                          : i === 1
                          ? "min-[819px]:col-start-3 min-[819px]:col-end-5 max-[819px]:col-start-1 max-[819px]:col-end-3"
                          : "min-[819px]:col-start-5 min-[819px]:col-end-7 max-[819px]:col-start-1 max-[819px]:col-end-3"
                      } ${
                        sub.plan !== "Pro Plan"
                          ? "min-[819px]:scale-[0.8]"
                          : "scale-[1]"
                      }`
                    )}
                  >
                    {/* Pricing card */}
                    {sub.plan === "Pro Plan" && (
                      <span
                        className="border bg-[#1D1D1D] text-[14px] absolute top-[-5px] right-0 px-2 py-1"
                        style={{
                          borderImageSource:
                            "linear-gradient(90deg, #0827F6 0%, #FFFFFF 100%)",
                          borderImageSlice: "1",
                        }}
                      >
                        Recommended
                      </span>
                    )}
                    <h3 className="mb-2">{sub.plan}</h3>
                    <p className="text-[14px] text-[#E2E2E2] mb-[30px]">
                      {sub.desc}
                    </p>
                    <div className="mb-[40px] flex items-center gap-1">
                      <span className="text-[48px]">{sub.price}</span>{" "}
                      <span className="text-[#D5D5D5]">{sub.period}</span>
                    </div>
                    <ul className="flex flex-col gap-1 list-disc text-[14px] pl-4 mb-[60px]">
                      {sub.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="px-[20px]">
            {/* CTA SECTION */}
            <div className="mx-auto max-w-[1300px] min-[870px]:max-h-[777px] flex items-center justify-between max-[870px]:items-start max-[870px]:flex-col">
              <div className="max-w-[680px] min-[870px]:-mt-[300px] max-[870px]:mt-[40px]">
                <h2
                  className={`${robotoSerif.className} font-black text-[44px] max-[500px]:text-[22px] max-[500px]:max-w-[300px]`}
                >
                  Start Translating Today!
                </h2>
                <p className="text-[#323232B2] text-[16px] max-w-[520px] mt-3">
                  Get real-time translations, AI-powered summaries, and seamless
                  communication at live events or one-on-one conversations. Try
                  Sprekar today!
                </p>
                <div className="flex gap-[14px] items-center mt-[40px]">
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
              <Image
                src={phoneWithLanguages}
                alt="Phone with english and french translation of the greeting - hello, on screen"
                quality={100}
                className="min-[870px]:relative min-[870px]:mr-[-90px] min-[870px]:top-[-127px] min-[870px]:z-999 max-[870px]:mx-auto"
              />
            </div>
          </section>
        </div>
      </HomePageLayout>
    </div>
  );
}
