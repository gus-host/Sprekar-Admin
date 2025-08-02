// app/components/ScrollamaFeatureShowcase.tsx
"use client";

import { robotoSerif } from "@/app/[lng]/_partials/fontFamilies";
import { features as featuresStatic } from "@/app/[lng]/_partials/homePageData";
import { useTranslation } from "@/app/i18n/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Scrollama, Step } from "react-scrollama";

export default function FeatureScroll({ lng }: { lng: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phoneImg, setPhoneImg] = useState(featuresStatic[0].img);
  const [isImageFixed, setIsImageFixed] = useState(false);
  const [keepBottom, setKeepBottom] = useState(false);
  const { t } = useTranslation(lng);

  const features = t("features.list", { returnObjects: true }) as Array<{
    id: string;
    title: string;
    desc: string;
    btn: string | null;
    alt: string;
  }>;

  const handleStepEnter = ({
    data,
    direction,
  }: {
    data: string;
    direction: "up" | "down";
  }) => {
    setActiveId(data);
    // Fade out, then swap, then fade in
    // setPhoneOpacity(0);

    if (
      direction === "down" &&
      (features[0].id === data || features[1].id === data)
    ) {
      setIsImageFixed(true);
    }
    if (direction === "up" && features[0].id === data) {
      setKeepBottom(false);
    }

    if (direction === "down" && features[2].id === data) {
      setKeepBottom(true);
      setIsImageFixed(false);
    }
    setTimeout(() => {
      const matched = featuresStatic.find((f) => f.id === data);

      if (matched) {
        setPhoneImg(matched.img);
        // setPhoneOpacity(1);
      }
    }, 300);
  };

  const handleStepExit = ({
    data,
    direction,
  }: {
    data: string;
    direction: "up" | "down";
  }) => {
    if (direction === "up" && features[0].id === data) {
      setIsImageFixed(false);
    }
    if (direction === "up" && features[2].id === data) {
      setKeepBottom(true);
      setIsImageFixed(true);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto max-w-[1300px] min-[744px]:flex max-[744px]:items-start max-[744px]:flex-col  max-[744px]:gap-0 relative transition-all",
        keepBottom ? "min-[744px]:items-end" : "min-[744px]:items-start"
      )}
    >
      {/* LEFT COLUMN: feature steps */}
      <div className="min-[744px]:w-[40%]">
        <Scrollama
          offset={0}
          threshold={8}
          onStepEnter={handleStepEnter}
          onStepExit={handleStepExit}
          debug={false}
        >
          {features.map((feature, i) => (
            <Step key={feature.id} data={feature.id}>
              <div
                id={feature.id}
                className="min-[744px]:h-screen min-[744px]:flex min-[744px]:justify-center min-[744px]:items-center"
              >
                {/* …feature content… */}
                <div>
                  <h3 className="text-[16px] font-medium text-[#01388F] mb-2 max-[744px]:mt-6">
                    {t("features.headings.main")}
                  </h3>
                  <h2
                    className={`${robotoSerif.className} text-[30px] max-[744px]:text-[20px] font-black max-w-[400px] leading-[1.3] mb-[20px]`}
                  >
                    {t("features.headings.sec")}
                  </h2>
                  <div className="flex gap-[20px] items-center">
                    {featuresStatic[i].ident}
                    <div>
                      <h4 className="text-[#323232] text-[16px] font-medium mb-1">
                        {feature.title}
                      </h4>
                      <p className="max-w-[400px] text-[#323232B2] text-[12px] leading-[1.6] mb-3">
                        {feature.desc}
                      </p>
                      {feature.btn && (
                        <Link
                          href={
                            feature.btn === `${t(`${features[1].btn}`)}`
                              ? "/join-event"
                              : "#"
                          }
                          className="py-[5px] px-[10px] rounded-[5px] text-[12px] font-normal cursor-pointer bg-[#025FF3] text-white"
                        >
                          {feature.btn}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <Image
                  src={featuresStatic[i].img}
                  alt={feature.alt}
                  quality={100}
                  className="min-[744px]:hidden"
                  placeholder="blur"
                />
              </div>
            </Step>
          ))}
        </Scrollama>
      </div>

      {/* RIGHT COLUMN: sticky phone mockup */}
      <div
        className={cn(
          "min-[744px]:flex-none min-[744px]:w-[60%] flex justify-center items-center h-dvh max-[744px]:hidden right-0 top-0 sticky",
          isImageFixed ? "fixed" : "static"
        )}
      >
        <Image
          src={phoneImg}
          alt={
            featuresStatic[
              featuresStatic.findIndex((feature) => feature.img === phoneImg)
            ].alt
          }
          quality={100}
          className="max-[744px]:hidden w-[70%]"
          placeholder="blur"
        />
      </div>
    </div>
  );
}
