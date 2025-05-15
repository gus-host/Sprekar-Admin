// components/EventDetail.tsx
"use client";

import React, { useState } from "react";
import {
  languageMap,
  LanguageOption,
  languageOptions,
  SupportedLangaugesTranslation,
} from "@/app/dashboard/manageEvents/_partials/SupportedLanguagesSelect";
import { OptionType } from "@/lib/websocket/useWebsocketTranslation";
import { ActionMeta, SingleValue } from "react-select";
import USA from "@/app/_svgs/USA";
import SPAIN from "@/app/_svgs/SPAIN";
import ChevronDownFull from "@/app/_svgs/ChevronDownFull";
import Link from "next/link";
import CopyIcon from "@/app/_svgs/CopyIcon";
import SummaryIcon from "@/app/_svgs/SummaryIcon";
import DownloadIcon2 from "@/app/_svgs/DownloadIcon2";
import PlayIcon from "@/app/_svgs/PlayIcon";
import Audiowaves from "@/assets/Audiowaves.png";
import Image from "next/image";

// Simple hover tooltip wrapper
function HoverIcon({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="relative group inline-block cursor-pointer">
      <Icon className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

const transcriptBlocks = [
  `Lörem ipsum polymert göde sedan gäl: till krovutrad eller vinepp amir: teler. Sakrorat ogönade mymesamma till könskonträr. Tredysånde presm i astrost. Onde nysade heminas, rumåse. Pore tipöns gypögöpskapet i elektroik om än televinas såväl som spement berat. Por här. Os otång vimegisk sar men täde. Doktigt gps-väst esalogi om megalig och tregyra, och hodide fast intrakär.`,
  `Lörem ipsum polymert göde sedan gäl: till krovutrad eller vinepp amir: teler. Sakrorat ogönade mymesamma till könskonträr. Tredysånde presm i astrost. Onde nysade heminas, rumåse. Pore tipöns gypögöpskapet i elektroik om än televinas såväl som spement berat. Por här. Os otång vimegisk sar men täde. Doktigt gps-väst esalogi om megalig och tregyra, och hodide fast intrakär. Lörem ipsum polymert göde sedan gäl: till krovutrad eller vinepp amir: teler. Sakrorat ogönade mymesamma till könskonträr. Tredysånde presm i astrost. Onde nysade heminas, rumåse. Pore tipöns gypögöpskapet i elektroik om än televinas såväl som spement berat. Por här. Os otång vimegisk sar men täde. Doktigt gps-väst esalogi om megalig och tregyra, och hodide fast intrakär.`,
  `Lörem ipsum polymert göde sedan gäl: till krovutrad eller vinepp amir: teler. Sakrorat ogönade mymesamma till könskonträr. Tredysånde presm i astrost. Onde nysade heminas, rumåse. Pore tipöns gypögöpskapet i elektroik om än televinas såväl som spement berat. Por här. Os otång vimegisk sar men täde. Doktigt gps-väst esalogi om megalig och tregyra, och hodide fast intrakär.
  `,
];

const supportedLanguages = languageOptions.map((lang) => lang.value);
export default function PastTranslationDetails() {
  const selectedLanguages = supportedLanguages; // Example selected languages
  const formattedLanguages = selectedLanguages?.map((code) => ({
    value: code,
    label: languageMap[code] || code, // Fallback to code if label isn't found
  }));
  const [translationLanguage, setTranslationLanguage] =
    useState<OptionType | null>({ value: "FR", label: "French" });
  const handleTranslationLanguageChange = (
    option: SingleValue<OptionType>,
    actionMeta?: ActionMeta<OptionType>
  ) => {
    setTranslationLanguage(option);
  };

  return (
    <div className="w-full mx-auto py-6 space-y-12 max-[790px]:pt-0">
      {/* Header: Title, Date, Languages, Stats, Actions, Audio */}
      <div className="flex gap-8 items-end w-full mb-[60px] max-[790px]:flex-col max-[790px]:items-start">
        {/* Left: Title & Date */}
        <div className="">
          <h1 className="text-[18px] text-[#323232] mb-3">
            AI business technology
          </h1>
          <p className="text-[12px] text-[#323232]">
            <span className="text-[#7F7F7F]">Date and time:</span> March 10,
            2025 - 08:00am
          </p>
          <div>
            <p className="text-[#676767] text-[14px] mb-1 mt-5">
              Supported Languages
            </p>
            <div className="max-w-[300px]">
              <SupportedLangaugesTranslation
                options={formattedLanguages}
                translationLanguage={translationLanguage as LanguageOption}
                handleTranslationLanguageChange={
                  handleTranslationLanguageChange
                }
              />
            </div>
          </div>
        </div>

        {/* Right: Stats and controls */}
        <div className="justify-between flex grow-1 items-end mb-2 max-[790px]:w-full max-[790px]:gap-5 max-[515px]:gap-7 max-[515px]:justify-start ">
          <div>
            {/* Attendees */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1 max-[790px]:hidden">
                Total attendees connected:
              </p>
              <span className="text-2xl font-semibold text-[#323232]">325</span>
              <Link
                href={"/dashboard/attendeeManagement"}
                className="text-[12px] text-blue-600 hover:font-medium pl-2"
              >
                View attendees
              </Link>
            </div>

            {/* Language selection / flags / icons */}
            <div className="flex items-center">
              {/* Supported Languages Dropdown */}

              {/* Flags & language pair with dropdown arrow */}
              <div className="flex items-center">
                <div className="rounded-full overflow-hidden">
                  <USA />
                </div>
                <div className="rounded-full overflow-hidden ml-2 mr-4">
                  <SPAIN />
                </div>
                <span className="text-[12px] text-[#808080] max-[940px]:hidden">
                  English (USA)-Spanish (Spain)
                </span>
                <span className="ml-1">
                  <ChevronDownFull />
                </span>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2 ml-4">
                <HoverIcon icon={CopyIcon} label="Share" />
                <HoverIcon icon={SummaryIcon} label="Summarize" />
                <HoverIcon icon={DownloadIcon2} label="Download" />
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="flex items-center space-x-4">
            <PlayIcon />
            <div className="w-[150px] max-[515px]:hidden">
              <Image src={Audiowaves} alt="Audio waves" className="w-full" />
            </div>
            <span className="text-sm text-gray-600 max-[515px]:hidden">
              04:03:09
            </span>
          </div>
        </div>
      </div>

      {/* Transcript cards */}
      <div className="space-y-4">
        {transcriptBlocks.map((text, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow border-gray-100 p-4 text-sm text-[#5E5D5D] max-w-[800px]"
            style={{ boxShadow: "0px 7px 20.8px 0px #0000000D" }}
          >
            <p className="whitespace-pre-line leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
