"use client";

import React from "react";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";

// Import the necessary Swiper styles.
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Import the required modules.
import { EffectFade, Mousewheel, Pagination } from "swiper/modules";
import { robotoSerif } from "./fontFamilies";
import { features } from "./homePageData";
import Image from "next/image";
import Link from "next/link";

export default function Swiper() {
  return (
    <>
      <SwiperComponent
        direction="vertical" // Use vertical scrolling.
        effect="fade" // Apply the fade effect.
        fadeEffect={{ crossFade: true }} // Optional: smoother cross fade.
        mousewheel={{
          releaseOnEdges: true, // Allow page scrolling when on the edge.
          forceToAxis: true, // (Optional) Force wheel events on the vertical axis.
        }}
        // pagination={{
        //   clickable: true,
        // }}
        modules={[EffectFade, Mousewheel, Pagination]}
        className="mySwiper"
        style={{ height: "100vh" }} // Ensure the swiper fills the viewport if desired.
      >
        {features.map((feature, i) => (
          <SwiperSlide key={i}>
            <div
              className="flex items-center mx-auto max-w-[1300px] justify-between gap-[50px]
            "
            >
              <div>
                <h3 className="text-[16px] font-medium text-[#01388F] mb-2">
                  Features
                </h3>
                <h2
                  className={`${robotoSerif.className} text-[30px] font-black max-w-[400px] leading-[1.3] mb-[20px]`}
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
                        href={"#"}
                        className={`py-[5px] px-[10px] rounded-[5px] text-[12px] font-normal cursor-pointer bg-[#025FF3] text-white`}
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
                placeholder="blur"
                // width={100}
              />
            </div>
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </>
  );
}
