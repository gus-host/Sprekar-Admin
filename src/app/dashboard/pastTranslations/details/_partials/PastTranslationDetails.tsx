// components/EventDetail.tsx
"use client";

import React, { useState } from "react";
import { Download, Share2, Play } from "lucide-react";
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

// Simple hover tooltip wrapper
function HoverIcon({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="relative group inline-block">
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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header: Title, Date, Languages, Stats, Actions, Audio */}
      <div className="flex gap-6 items-end w-full">
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
            <p className="text-[#676767] text-[14px] mb-1">
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
        <div className="justify-between flex grow-1 items-end">
          <div>
            {/* Attendees */}
            <div className="">
              <p className="text-sm text-gray-600 mb-3">
                Total attendees connected:
              </p>
              <span className="text-2xl font-semibold text-[#323232]">325</span>
              <Link
                href={"/"}
                className="text-[12px] text-blue-600 hover:font-medium pl-2"
              >
                View attendees
              </Link>
            </div>

            {/* Language selection / flags / icons */}
            <div className="flex items-end">
              {/* Supported Languages Dropdown */}

              {/* Flags & language pair with dropdown arrow */}
              <div className="flex items-center">
                <div className="rounded-full overflow-hidden">
                  <USA />
                </div>
                <div className="rounded-full overflow-hidden ml-2 mr-4">
                  <SPAIN />
                </div>
                <span className="text-[12px] text-[#808080]">
                  English (USA)-Spanish (Spain)
                </span>
                <span className="ml-1">
                  <ChevronDownFull />
                </span>
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-4 ml-4">
                <HoverIcon icon={Share2} label="Share" />
                <HoverIcon icon={Share2} label="Summarize" />
                <HoverIcon icon={Download} label="Download" />
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="flex items-center space-x-4">
            <button className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 focus:outline-none">
              <Play className="w-5 h-5" />
            </button>
            <div className="flex-1 h-8 bg-gray-200 rounded overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: "40%" }} />
            </div>
            <span className="text-sm text-gray-600">04:03:09</span>
          </div>
        </div>
      </div>

      {/* Transcript cards */}
      <div className="space-y-4">
        {transcriptBlocks.map((text, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow border border-gray-100 p-4 text-sm text-gray-800"
          >
            <p className="whitespace-pre-line leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
