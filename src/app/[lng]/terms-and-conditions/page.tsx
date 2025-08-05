import HomePageLayout from "@/app/[lng]/_partials/_layout/HomePageLayout";
import {
  nunitoSans,
  openSans,
  robotoSerif,
} from "@/app/[lng]/_partials/fontFamilies";
import Header from "@/app/[lng]/_partials/Header";
import { useTranslation } from "@/app/i18n";
import { notFound } from "next/navigation";

interface I18nParams {
  lng: string;
}

export const metadata = {
  title: "Terms Of Service",
};

export default async function page({
  params,
}: {
  params: Promise<I18nParams>;
}) {
  const paramsTest = await params;

  const lng = paramsTest?.lng;

  if (!lng) {
    notFound();
  }
  const { t } = await useTranslation(lng, "terms");
  const terms = t("termsOfService", { returnObjects: true }) as {
    pageTitle: string;
    intro: string;
    sections: { id: string; title: string; items: string[]; text: string }[];
  };
  return (
    <HomePageLayout lng={lng}>
      <div style={{ overflowX: "hidden" }}>
        <section className="relative w-full max-w-[1075px] mx-auto  max-[750px]:pt-[80px]">
          <div className="relative z-10">
            <Header lng={lng} />
            <div className="mx-auto px-[20px]">
              <h1
                className={`mt-[60px] md:mt-[82px] ${robotoSerif.className} text-[44px] text-center font-black max-[820px]:text-[26px] max-[820px]:${nunitoSans.className}`}
              >
                {terms.pageTitle}
              </h1>
              <p className="text-[#323232B2] text-[16px] md:text-[18px] text-center max-w-[806px] mb-[30px] md:mb-[60px] mx-auto mt-[37px]">
                {terms.intro}
              </p>
            </div>
          </div>
          <section className="w-full min-h-[100px] flex flex-col gap-[30px] md:gap-[60px] pb-[100px] md:pb-[162px] px-5">
            {terms.sections.map(({ id, title, items, text }) => (
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
