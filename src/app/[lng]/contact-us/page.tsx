import { useTranslation as useTranslationServer } from "@/app/i18n";

import Image from "next/image";
import Header from "@/app/[lng]/_partials/Header";
import HomePageLayout from "@/app/[lng]/_partials/_layout/HomePageLayout";
import bgImg from "@/../public/bgImg.png";
import H1 from "@/app/[lng]/_partials/H1";
import ContactForm from "./_partials/ContactForm";
import { fallbackLng, languages } from "@/app/i18n/settings";
import { notFound } from "next/navigation";

interface I18nParams {
  lng: string;
}

export const metadata = {
  title: "Contact us",
};

export default async function page({
  params,
}: {
  params: Promise<I18nParams>;
}) {
  const paramTest = await params;
  let lng = paramTest?.lng;

  if (!lng) {
    notFound(); // This will render your not-found.tsx page
  }
  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const { t: tServer } = await useTranslationServer(lng, "contact");
  return (
    <div className="bg-[#F8F8F8]">
      <HomePageLayout lng={lng}>
        <div style={{ overflowX: "hidden" }}>
          <section className="relative max-[750px]:pt-[80px] min-h-[1051px]">
            <div className="relative z-10">
              <Header lng={lng} />
              <div className="mx-auto px-[20px]">
                <H1>{tServer("contact.title")}</H1>
                <p className="text-[#323232B2] text-[16px] text-center max-w-[520px] mx-auto mb-[60px]">
                  {tServer("contact.subtitle")}
                </p>
              </div>
              <div className="px-[30px]">
                <ContactForm lng={lng} />
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
        </div>
      </HomePageLayout>
    </div>
  );
}
