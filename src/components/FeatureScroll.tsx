// app/components/ScrollamaFeatureShowcase.tsx
"use client";

import { robotoSerif } from "@/app/_partials/fontFamilies";
import { features } from "@/app/_partials/homePageData";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Scrollama, Step } from "react-scrollama";

export default function FeatureScroll() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phoneImg, setPhoneImg] = useState(features[0].img);
  const [isImageFixed, setIsImageFixed] = useState(false);
  const [keepBottom, setKeepBottom] = useState(false);

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
      const matched = features.find((f) => f.id === data);

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
          {features.map((feature) => (
            <Step key={feature.id} data={feature.id}>
              <div
                id={feature.id}
                className="min-[744px]:h-screen min-[744px]:flex min-[744px]:justify-center min-[744px]:items-center"
              >
                {/* …feature content… */}
                <div>
                  <h3 className="text-[16px] font-medium text-[#01388F] mb-2 max-[744px]:mt-6">
                    Features
                  </h3>
                  <h2
                    className={`${robotoSerif.className} text-[30px] max-[744px]:text-[20px] font-black max-w-[400px] leading-[1.3] mb-[20px]`}
                  >
                    Your Language. Your World. No Barriers.
                  </h2>
                  <div className="flex gap-[20px] items-center">
                    {feature.ident}
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
                            feature.btn === "Join an event"
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
                  src={feature.img}
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
          "min-[744px]:flex-none min-[744px]:w-[60%] flex justify-center items-center h-dvh max-[744px]:hidden right-0 top-0",
          isImageFixed ? "fixed" : "static"
        )}
      >
        <Image
          src={phoneImg}
          alt={
            features[features.findIndex((feature) => feature.img === phoneImg)]
              .alt
          }
          quality={100}
          className="max-[744px]:hidden w-[70%]"
          placeholder="blur"
        />
      </div>
    </div>
  );
}
