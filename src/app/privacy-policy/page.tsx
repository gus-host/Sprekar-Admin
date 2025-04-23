import HomePageLayout from "../_partials/_layout/HomePageLayout";
import { nunitoSans, openSans, robotoSerif } from "../_partials/fontFamilies";
import Header from "../_partials/Header";
import { privacyPolicySections } from "./privacy-policy.data";

export const metadata = {
  title: "Privacy Policy",
};

export default function page() {
  return (
    <HomePageLayout>
      <div style={{ overflowX: "hidden" }}>
        <section className="relative w-full max-w-[1075px] mx-auto  max-[750px]:pt-[80px]">
          <div className="relative z-10">
            <Header />
            <div className="mx-auto px-[20px]">
              <h1
                className={`mt-[60px] md:mt-[82px] ${robotoSerif.className} text-[44px] text-center font-black max-[820px]:text-[26px] max-[820px]:${nunitoSans.className}`}
              >
                Privacy Policy
              </h1>
              <p className="text-[#323232B2] text-[16px] md:text-[18px] text-center max-w-[806px] mb-[30px] md:mb-[60px] mx-auto mt-[37px]">
                Sprekar ("we", "our", or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, and
                safeguard your information when you use our mobile app and web
                services.
              </p>
            </div>
          </div>
          <section className="w-full min-h-[100px] flex flex-col gap-[30px] md:gap-[60px] pb-[100px] md:pb-[162px] px-5">
            {privacyPolicySections.map(({ id, title, items, text }) => (
              <div key={id}>
                <h6
                  className={`text-[20px] mb-4 md:mb-[22px] md:text-[24px] leading-[150%] text-[#323232] ${openSans.className} font-bold tracking-[-2%]`}
                >{`${id}. ${title}`}</h6>
                {items ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {items.map((item, i) => (
                      <li
                        key={i}
                        className={`text-[20px] ${openSans.className} leading-[150%] tracking-[-2%] text-[#323232]`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className={`text-[20px] ${openSans.className} leading-[150%] tracking-[-2%] text-[#323232]`}
                    dangerouslySetInnerHTML={{ __html: text || "" }}
                  />
                )}
              </div>
            ))}
          </section>
        </section>
      </div>
    </HomePageLayout>
  );
}
