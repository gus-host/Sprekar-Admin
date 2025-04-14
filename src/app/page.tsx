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

export default function Home() {
  return (
    <div className="bg-[#F8F8F8]">
      <HomePageLayout>
        <div>
          <section className="relative">
            {/* HERO SECTION */}

            <div className="relative z-10">
              <Header />
              <div className="mx-auto px-[20px]">
                <h1
                  className={`mt-[60px] ${robotoSerif.className} text-[44px] text-center font-black`}
                >
                  Speak. Understand. Connect.
                </h1>
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
              <div className="px-[30px] max-w-[1300px] mx-auto rounded-[30px] overflow-hidden">
                <HeroVideo />
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
                className={`${robotoSerif.className} text-[32px] font-black leading-[1.3] max-w-[600px] mb-[30px]`}
              >
                understand the world in real time—seamlessly and effortlessly.
              </h2>
              <JoinOrHostEventSteps />
            </div>
          </section>
          <section className="px-[20px]">
            {/* FEATURES SECTION */}
            <Swiper />
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
                className={`${robotoSerif.className} text-[32px] font-black leading-[1.3] max-w-[400px] mb-[30px]`}
              >
                Choose the plan that best fits your needs
              </h2>
              <div>
                <div className="backdrop-blur-[11.800000190734863px] bg-[#FFFFFF21] py-[25px] px-[20px] rounded-[10px] relative">
                  {/* Pricing card */}
                  <h3>Free</h3>
                  <p>Perfect for casual use & trave</p>
                  <div>
                    <span>$0</span> <span>/ month</span>
                  </div>
                  <ul>
                    <li>1-on-1 voice translation</li>
                    <li>Join events as a guest</li>
                    <li>Limited daily usage</li>
                    <li>Text translation only</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <section>
            {/* CTA SECTION */}
            <div>
              <div>
                <h2>Start Translating Today!</h2>
                <p>
                  Get real-time translations, AI-powered summaries, and seamless
                  communication at live events or one-on-one conversations. Try
                  Sprekar today!
                </p>
              </div>
              <Image
                src={phoneWithLanguages}
                alt="Phone with english and french translation of the greeting - hello, on screen"
                quality={100}
              />
            </div>
          </section>
        </div>
      </HomePageLayout>
    </div>
  );
}
