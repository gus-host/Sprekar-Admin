"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { ActionMeta, SingleValue } from "react-select";

import { Event } from "@/app/[lng]/dashboard/liveTranslation/[eventId]/EventGetter";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import ModalMUI from "@/components/ModalMUI";
import Spinner from "@/components/ui/Spinner";
import TranscriptionsPortal from "@/components/TranscriptionsPortal";
import MobileTranscriptionPortal from "@/components/MobileTranscriptionPortal";
import ButtonRed from "@/app/[lng]/dashboard/_partials/ButtonRed";
import ButtonBlue from "@/app/[lng]/dashboard/_partials/ButtonBlue";
import ErrorSetter from "@/app/[lng]/dashboard/_partials/ErrorSetter";
import { truncateText } from "@/utils/helper/general/truncateText";
import { useTour } from "@/app/[lng]/context/TourContextVisitors";

import useWebsocketPoCAligned, {
  ChatMessage,
} from "@/lib/websocket/useWebsocketPoCAligned";

const SupportedLangaugesTranslation = dynamic(
  () =>
    import(
      "@/app/[lng]/dashboard/manageEvents/_partials/SupportedLanguagesSelect"
    ).then((m) => m.SupportedLangaugesTranslation),
  { ssr: false }
);

import {
  languageMap,
  LanguageOption,
} from "@/app/[lng]/dashboard/manageEvents/_partials/SupportedLanguagesSelect";

// prettier-ignore
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Simple browser language → LangCode best-effort map
const guessLang = () => {
  const nav = (typeof navigator !== "undefined" && navigator.language) || "";
  if (nav.startsWith("en-GB")) return "EN_GB";
  if (nav.startsWith("en")) return "EN_US";
  if (nav.startsWith("nl")) return "NL";
  if (nav.startsWith("es")) return "ES";
  if (nav.startsWith("fr")) return "FR";
  if (nav.startsWith("de")) return "de-DE";
  if (nav.startsWith("sv")) return "sv-SE";
  if (nav.startsWith("zh")) return "ZH_HANS";
  if (nav.startsWith("ru")) return "RU";
  return "EN_GB";
};

function getOrMakeParticipantId(): string {
  if (typeof window === "undefined") return "";
  const sp = new URLSearchParams(window.location.search);
  const fromUrl = sp.get("pid");
  if (fromUrl) {
    localStorage.setItem("spk_pid", fromUrl);
    return fromUrl;
  }
  const fromLs = localStorage.getItem("spk_pid");
  if (fromLs) return fromLs;
  const pid = `p_${Math.random().toString(36).slice(2)}${Date.now()}`;
  localStorage.setItem("spk_pid", pid);
  return pid;
}

export default function EventTranslationVisitorAligned({
  event,
  error,
}: {
  event?: Event;
  error?: string;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const { hasCompletedTourVisitor } = useTour();
  const { clientHeight, clientWidth } = useResponsiveSizes();
  const handleFullScreen = useFullScreenHandle();
  const [isShowFullScreen, setIsShowFullScreen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  // Participant identity
  const participantId = useMemo(getOrMakeParticipantId, []);
  const defaultTrans = useMemo(() => guessLang(), []);

  // Hook in participant mode (read-only, no mic)
  const {
    transcription,
    translationLanguage,
    chatMessages,
    participantCount,

    // refs/scroll
    chatContainerRef,
    chatEndRef,
    topSentinelRef,

    // actions
    joinEvent,
    rejoinEvent,

    // language handler for native <select/> signature that our adapter will call
    handleTranslationLanguageChange,
  } = useWebsocketPoCAligned({
    user: null,
    adminUserId: "",      // still needed for server join payload shape
    defaultEvent: event?.eventCode || "",
    defaultTranslationLang: defaultTrans,
    defaultStreamingLang: defaultTrans,       // not used for visitors (no mic), but safe to align
    participantMode: true,
    presetParticipantId: participantId,
    debug: true,
  });

  // react-select → hook handler adapter (translation language)
  const formattedLanguages: LanguageOption[] =
    event?.supportedLanguages?.map((code) => ({
      value: code,
      label: languageMap[code] || code,
    })) || [];

  const onTranslationLangChange = (
    option: SingleValue<LanguageOption>,
    _meta: ActionMeta<LanguageOption>
  ) => {
    const value = (option?.value) || "EN_GB";
    // The hook expects a native event-like object
    handleTranslationLanguageChange({
      // @ts-expect-error adapter object
      target: { value },
    });
  };

  // Auto-join when live
  const hasTriedJoinRef = useRef(false);
  useEffect(() => {
    if (!event?.eventIsOngoing || event.status === "ended") return;
    if (!hasCompletedTourVisitor) return;
    if (hasTriedJoinRef.current) return;

    (async () => {
      try {
        await joinEvent();
      } catch (e) {
        console.error("visitor join failed:", e);
      } finally {
        hasTriedJoinRef.current = true;
      }
    })();
  }, [event?.eventIsOngoing, event?.status, hasCompletedTourVisitor, joinEvent]);

  // Title & autoscroll
  useEffect(() => {
    if (!event?.eventIsOngoing || event?.status === "ended") return;
    if (event?.name) document.title = `${event.name} | Join Event | Sprekar`;
  }, [event?.name, event?.eventIsOngoing, event?.status]);

  useEffect(() => {
    if (!event?.eventIsOngoing || event?.status === "ended") return;
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, event?.eventIsOngoing, event?.status, chatEndRef]);

  function handleChangeFullScreen(state: boolean) {
    setIsShowFullScreen(state);
  }

  if (error) return ErrorSetter({ error });

  if (!event?.eventIsOngoing || event?.status === "ended") {
    return (
      <div className="flex flex-col gap-5 text-center justify-center items-center mt-[80px] text-gray-600">
        <p>
          This event is currently <strong>not on going</strong> or{" "}
          <strong>has ended</strong>. If the event hasn&apos;t reached its start
          time, come back later.
        </p>
        <Link href={"/join-event"} className="cursor-pointer">
          <ButtonBlue>Go back</ButtonBlue>
        </Link>
      </div>
    );
  }

  const endDate = new Date(event?.endDate || "");
  const endDateString = `${months[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;

  return (
    <div className="text-[#323232] relative">
      <FullScreen handle={handleFullScreen} onChange={handleChangeFullScreen}>
        <div
          style={{
            padding: `${isShowFullScreen ? "30px 40px" : ""}`,
            height: `${isShowFullScreen ? "100%" : "dvh"}`,
            backgroundColor: `${isShowFullScreen ? "#fff" : "transparent"}`,
          }}
        >
          <HeaderForVisitors
            event={event}
            endDateString={endDateString}
            formattedLanguages={formattedLanguages}
            translationLanguage={{
              value: translationLanguage,
              label: languageMap[translationLanguage] || translationLanguage,
            }}
            handleTranslationLanguageChange={onTranslationLangChange}
            participantCount={participantCount}
            isShowFullScreen={isShowFullScreen}
            enterFullscreen={handleFullScreen.enter}
            exitFullscreen={handleFullScreen.exit}
            onLeave={() => setIsLeaveOpen(true)}
          />

          <div
            className="overflow-y-auto overflow-hidden view-translations mt-[10px]"
            style={{
              height: `${
                (clientWidth as number) > 915
                  ? (clientHeight as number) - (!isShowFullScreen ? 280.34 : 233.34)
                  : (clientHeight as number) - (!isShowFullScreen ? 354.34 : 334.34)
              }px`,
            }}
            ref={chatContainerRef}
            // onScroll={handleScroll}
          >
            <div ref={topSentinelRef} style={{ height: 1 }} />
            <div className="target-el">
              {chatMessages.length === 0 ? (
                <p className="text-center mt-8 text-[#676767]">No translations yet.</p>
              ) : (
                <ul className="flex flex-col gap-1 w-[95%]">
                  {chatMessages.map((msg, index) => (
                    <li  key={msg.id} className="w-full">
                      <div
                        style={{
                          background: "#fff",
                          padding: "0.5rem 1rem",
                          borderRadius: "10px",
                          margin: "0.5rem 0",
                          boxShadow: "0px 7px 20.8px 0px #0000000D",
                        }}
                      >
                        <div style={{ fontSize: "16px", color: "#5E5D5D" }}>
                          {(msg as ChatMessage)?.translation}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#999",
                            textAlign: "right",
                          }}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString() === "Invalid Date"
                            ? ""
                            : new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </li>
                  ))}
                  <div ref={chatEndRef} />
                </ul>
              )}
            </div>
          </div>

          {/* Leave modal */}
          {isLeaveOpen && (
            <ModalMUI isModalOpen={isLeaveOpen} setIsModalOpen={setIsLeaveOpen}>
              <div className="flex flex-col px-[30px] py-[20px] items-center justify-center text-center">
                <h2 className="text-[20px] text-[#000] font-medium">Leave Event</h2>
                <p className="mt-4 text-[#404040] text-center leading-[1.5]">
                  Are you sure you want to leave this event?
                </p>
                <div className="mt-7 flex gap-3 items-center w-full">
                  <button
                    type="button"
                    className="focus-visible:outline-none px-3 py-2 bg-white border border-[#858585] text-[14px] rounded-sm w-full hover:bg-gray-100"
                    onClick={() => setIsLeaveOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#FF0000] font-bold tracking-[-1px] rounded-sm w-full hover:shadow-red"
                    style={{ fontFamily: "Helvetica Compressed, sans-serif" }}
                    onClick={() => router.push("/join-event")}
                  >
                    Leave
                  </button>
                </div>
              </div>
            </ModalMUI>
          )}
        </div>
      </FullScreen>

      {(clientWidth as number) > 915 ? (
        <TranscriptionsPortal isShowTranscriptions transcriptions={transcription}>
          {transcription ? (
            <p className="text-[12px]">{transcription}</p>
          ) : (
            <p className="text-[12px] text-center">No Transcriptions</p>
          )}
        </TranscriptionsPortal>
      ) : (
        <MobileTranscriptionPortal transcriptions={transcription} />
      )}
    </div>
  );
}

function HeaderForVisitors({
  event,
  endDateString,
  formattedLanguages,
  translationLanguage,
  handleTranslationLanguageChange,
  participantCount,
  isShowFullScreen,
  enterFullscreen,
  exitFullscreen,
  onLeave,
}: {
  event?: Event;
  endDateString: string;
  formattedLanguages?: LanguageOption[];
  translationLanguage: LanguageOption;
  handleTranslationLanguageChange: (
    option: SingleValue<LanguageOption>,
    actionMeta: ActionMeta<LanguageOption>
  ) => void;
  participantCount?: number;
  isShowFullScreen: boolean;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  onLeave: () => void;
}) {
  const { clientWidth } = useResponsiveSizes();
  return (
    <div className="flex justify-between items-end max-[915px]:flex-col max-[915px]:items-start max-[915px]:gap-3">
      <div>
        <p className="text-[#676767] text-[12px] mb-1">
          Supported Languages ({event?.supportedLanguages?.length})
        </p>
        <div className="max-w-[300px] translation-lang-select min-h-[37px]">
          <SupportedLangaugesTranslation
            options={formattedLanguages}
            translationLanguage={translationLanguage}
            handleTranslationLanguageChange={handleTranslationLanguageChange}
          />
        </div>
      </div>

      <div className="flex gap-[40px] items-end">
        <div>
          <h4 className="mb-0.5 max-[470px]:hidden">
            {truncateText(event?.name as string, 36)}
          </h4>
          <p className="text-[12px] mb-3">
            <span className="text-[#7F7F7F] max-[470px]:hidden">End time: </span>
            <span>
              {(clientWidth as number) > 470 ? endDateString : dayjs(event?.endDate).format("DD/MM/YYYY")}{" "}
              {dayjs(event?.endTime).format("hh:mma")}
            </span>
          </p>
        </div>

        <div className="flex items-end gap-3">
          {/* Optional attendee count (hide if backend doesn’t send it reliably) */}
          {/* <div>
            <h4 className="text-[12px] text-[#7F7F7F] max-[470px]:hidden">Attendees connected:</h4>
            <p className="text-[20px] font-semibold mb-3">{participantCount ?? "-"}</p>
          </div> */}
          {!isShowFullScreen ? (
            <div
              onClick={enterFullscreen}
              className="text-[12px] py-1 px-2 bg-gray-50 border border-gray-100 cursor-pointer rounded hover:bg-gray-100 view-full-screen"
            >
              Full screen mode
            </div>
          ) : (
            <div
              onClick={exitFullscreen}
              className="text-[12px] py-1 px-2 bg-gray-50 border border-gray-100 cursor-pointer rounded hover:bg-gray-100"
            >
              Exit full screen mode
            </div>
          )}
          <ButtonRed onClick={onLeave} classNames="leave-event">
            Leave Event
          </ButtonRed>
        </div>
      </div>
    </div>
  );
}
