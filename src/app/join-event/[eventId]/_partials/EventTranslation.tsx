"use client";

import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActionMeta, SingleValue } from "react-select";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { truncateText } from "@/utils/helper/general/truncateText";
import {
  FullScreen,
  // FullScreenHandle,
  useFullScreenHandle,
} from "react-full-screen";
import dynamic from "next/dynamic";
import ErrorSetter from "@/app/dashboard/_partials/ErrorSetter";
import ButtonRed from "@/app/dashboard/_partials/ButtonRed";
import RejoinEventModal from "@/app/dashboard/liveTranslation/_partials/RejoinEventModal";
import ButtonBlue from "@/app/dashboard/_partials/ButtonBlue";
import ModalMUI from "@/components/ModalMUI";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import useWebsocketTranslation, {
  AudioUrls,
  ChatMessage,
} from "@/lib/websocket/useWebsocketTranslation";
import { LinearProgress, Skeleton } from "@mui/material";
import { Event } from "@/app/dashboard/liveTranslation/[eventId]/EventGetter";
import {
  languageMap,
  LanguageOption,
} from "@/app/dashboard/manageEvents/_partials/SupportedLanguagesSelect";
import { cn } from "@/lib/utils";
const SupportedLangaugesTranslation = dynamic(
  () =>
    import(
      "@/app/dashboard/manageEvents/_partials/SupportedLanguagesSelect"
    ).then((mod) => mod.SupportedLangaugesTranslation),
  { ssr: false }
);

// prettier-ignore
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function EventTranslation({
  event,
  error,
}: {
  event?: Event;
  error?: string;
}) {
  const {
    translationLanguage,
    setTranslationLanguage,
    rejoinEvent,
    stopRecording,
    handleTranslationLanguageChange,
    message,
    handleScroll,
    chatMessages,
    participantCount,
    joinEvent,
    loadingMore,
    genIsLoading,
  } = useWebsocketTranslation(
    null,
    event?.createdBy || "",
    event?.eventCode || ""
  );
  const endDate = new Date(event?.endDate || "");
  const endDateString = `${
    months[endDate.getMonth()]
  } ${endDate.getDate()}, ${endDate.getFullYear()}`;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOpenRejoinModal, setIsOpenRejoinModal] = useState(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  const selectedLanguages = event?.supportedLanguages; // Example selected languages
  const formattedLanguages = selectedLanguages?.map((code) => ({
    value: code,
    label: languageMap[code] || code, // Fallback to code if label isn't found
  }));
  const { clientHeight, clientWidth } = useResponsiveSizes();
  // const hasRunDefaultTransLangRef = useRef<boolean>(false);
  const rejoinAttemptRef = useRef<number>(0);
  // Refs for the chat container and end-of-chat marker
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const route = useRouter();
  const handleFullScreen = useFullScreenHandle();
  const [isShowFullScreen, setIsShowFullScreen] = useState(false);

  const hasTriedJoinRef = useRef(false);

  useEffect(() => {
    if (event?.eventIsOngoing && !hasTriedJoinRef.current) {
      joinEvent();
      function defaultLangSetter() {
        const defaultCode = event?.supportedLanguages?.at(0);
        handleTranslationLanguageChange({
          value: defaultCode || "AR",
          label: languageMap[defaultCode || "AR"] || defaultCode || "AR", // Fallback to code if label isn't found
        });
      }
      defaultLangSetter();
      hasTriedJoinRef.current = true;
    }
  }, [event?.eventIsOngoing, joinEvent]);

  // Auto-scroll to bottom when new messages arrive.
  useEffect(() => {
    if (!event?.eventIsOngoing || event?.status === "ended") return;
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!event?.eventIsOngoing || event?.status === "ended") return;
    if (event.name) {
      document.title = `${event.name} | Join Event | Sprekar`;
    }
  }, [event?.name, event?.eventIsOngoing, event?.status]);

  useEffect(
    function () {
      if (!event?.eventIsOngoing || event?.status === "ended") return;
      function messageSetter() {
        if (
          message === "Event has ended" ||
          message === "Event ended. Translations stopped."
        ) {
          setIsDeletingEvent(false);
          stopRecording();
          route.replace(`/`);
          setIsDeleteModalOpen(false);
        }
        if (message === "needs-to-rejoin" && rejoinAttemptRef.current > 0)
          setIsOpenRejoinModal(true);
        rejoinAttemptRef.current += 1;
      }
      messageSetter();
    },
    [message]
  );

  async function handleDelete() {
    setIsDeletingEvent(true);
  }

  async function handleRejoin() {
    stopRecording();
    setTranslationLanguage((lang) => lang);
    await rejoinEvent();
    setIsOpenRejoinModal(false);
  }

  function handleChangeFullScreen(
    state: boolean
    // handle: FullScreenHandle
  ) {
    console.log(state, isShowFullScreen);
    setIsShowFullScreen(state);
  }
  if (error) return ErrorSetter({ error });

  if (!event?.eventIsOngoing || event?.status === "ended")
    return (
      <div className="flex flex-col gap-5 text-center justify-center items-center mt-[80px] text-gray-600">
        <p>
          This event is currently <strong>not on going</strong> or{" "}
          <strong>has ended</strong>. If the event hasn&apos;t reach its start
          time come back later
        </p>
        <Link href={"/join-event"} className="cursor-pointer">
          <ButtonBlue>Go back</ButtonBlue>
        </Link>
      </div>
    );

  return (
    <div className="text-[#323232] relative">
      {loadingMore || genIsLoading ? (
        <LinearProgress />
      ) : (
        <div className="h-[4px]"></div>
      )}
      <FullScreen handle={handleFullScreen} onChange={handleChangeFullScreen}>
        <div
          style={{
            padding: `${isShowFullScreen ? "30px 40px" : ""}`,
            height: `${isShowFullScreen ? "100%" : "dvh"}`,
            backgroundColor: `${isShowFullScreen ? "#fff" : "transparent"}`,
          }}
        >
          <EventControllerForVistors
            event={event}
            endDateString={endDateString}
            formattedLanguages={formattedLanguages}
            translationLanguage={translationLanguage as LanguageOption}
            handleTranslationLanguageChange={handleTranslationLanguageChange}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            isDeleteModalOpen={isDeleteModalOpen}
            isDeletingEvent={isDeletingEvent}
            handleDelete={handleDelete}
            participantCount={participantCount}
          />

          <div className="mt-[10px]">
            <div className="flex justify-end">
              <div className="flex gap-3 items-end ">
                <>
                  {!isShowFullScreen && (
                    <div
                      onClick={handleFullScreen.enter}
                      className="text-[12px] py-1 px-2 bg-gray-50 border border-gray-100 cursor-pointer rounded hover:bg-gray-100"
                    >
                      Full screen mode
                    </div>
                  )}
                  {isShowFullScreen && (
                    <div
                      onClick={handleFullScreen.exit}
                      className="text-[12px] py-1 px-2 bg-gray-50 border border-gray-100 cursor-pointer rounded hover:bg-gray-100"
                    >
                      Exit full screen mode
                    </div>
                  )}
                </>
              </div>
            </div>
            <div
              className="overflow-y-auto overflow-hidden"
              style={{
                height: `${
                  (clientWidth as number) > 915
                    ? (clientHeight as number) -
                      (!isShowFullScreen ? 280.34 : 233.34)
                    : (clientHeight as number) -
                      (!isShowFullScreen ? 354.34 : 334.34)
                }px`,
              }}
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              <div>
                {chatMessages.length === 0 ? (
                  <p className="text-center mt-8 text-[#676767]">
                    No translations yet.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1 w-[95%]">
                    {chatMessages?.map((msg, index) => (
                      <div key={index} className="w-[100%]">
                        <div
                          style={{
                            background: "#fff",
                            padding: "0.5rem 1rem",
                            borderRadius: "10px",
                            margin: "0.5rem 0",
                            boxShadow: " 0px 7px 20.8px 0px #0000000D",
                          }}
                        >
                          {
                            <div
                              style={{
                                fontSize: "16px",
                                color: "#5E5D5D",
                              }}
                            >
                              {(
                                (msg as ChatMessage)?.translation as {
                                  text?: string;
                                }
                              ).text
                                ? (
                                    (msg as ChatMessage)?.translation as {
                                      text?: string;
                                    }
                                  ).text
                                : (msg as ChatMessage)?.translation}
                            </div>
                          }
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#999",
                              textAlign: "right",
                            }}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString() ===
                            "Invalid Date"
                              ? ""
                              : new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </ul>
                )}
              </div>
            </div>
          </div>
          {isOpenRejoinModal && (
            <RejoinEventModal
              isOpen={isOpenRejoinModal}
              setIsOpen={setIsOpenRejoinModal}
              onClick={handleRejoin}
            />
          )}
        </div>
      </FullScreen>
    </div>
  );
}

function EventControllerForVistors({
  event,
  endDateString,
  formattedLanguages,
  translationLanguage,
  handleTranslationLanguageChange,
  setIsDeleteModalOpen,
  isDeleteModalOpen,
  isDeletingEvent,
  handleDelete,
  participantCount,
}: {
  event?: Event;
  endDateString: string;
  formattedLanguages?: LanguageOption[];
  translationLanguage: LanguageOption;
  handleTranslationLanguageChange: (
    option: SingleValue<LanguageOption>,
    actionMeta: ActionMeta<LanguageOption>
  ) => void;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteModalOpen: boolean;
  isDeletingEvent: boolean;
  handleDelete: () => Promise<void>;
  participantCount?: number;
}) {
  const { clientWidth } = useResponsiveSizes();
  const router = useRouter();

  return (
    <div className="flex justify-between items-end max-[915px]:flex-col max-[915px]:items-start max-[915px]:gap-3">
      <div>
        <p className="text-[#676767] text-[12px] mb-1">
          Supported Languages ({event?.supportedLanguages?.length})
        </p>
        <div className="max-w-[300px]">
          <SupportedLangaugesTranslation
            options={formattedLanguages}
            translationLanguage={translationLanguage as LanguageOption}
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
            <span className="text-[#7F7F7F] max-[470px]:hidden">
              End time:{" "}
            </span>{" "}
            <span>
              {`${
                (clientWidth as number) > 470
                  ? endDateString
                  : dayjs(event?.endDate).format("DD/MM/YYYY")
              }`}{" "}
              {`${dayjs(event?.endTime).format("hh:mma")}`}
            </span>
          </p>
        </div>
        <div>
          <h4 className="text-[12px] text-[#7F7F7F] max-[470px]:hidden">
            Total attendees connected:
          </h4>
          <p className="text-[20px] font-semibold mb-3">
            {participantCount || (
              <Skeleton variant="circular" width={20} height={20} />
            )}
          </p>
          <ButtonRed onClick={() => setIsDeleteModalOpen((open) => !open)}>
            Leave Event
          </ButtonRed>
        </div>
        {isDeleteModalOpen && (
          <ModalMUI
            isModalOpen={isDeleteModalOpen}
            setIsModalOpen={setIsDeleteModalOpen}
          >
            <div className="flex flex-col px-[30px] py-[20px] items-center justify-center text-center">
              <h2 className="text-[20px] text-[#000] font-medium">End Event</h2>
              <p className="mt-4 text-[#404040] text-center leading-[1.5]">
                Are you sure you want to leave this event?
              </p>
              <div className="mt-7 flex gap-3 items-center w-full">
                <button
                  type="button"
                  className="focus-visible:outline-none px-3 py-2 bg-white border border-[#858585] text-[14px] rounded-sm hover:bg-gray-100flex justify-center items-center w-full hover:bg-gray-100"
                  disabled={isDeletingEvent}
                  style={{
                    cursor: isDeletingEvent ? "not-allowed" : "pointer",
                  }}
                  onClick={() => setIsDeleteModalOpen((open) => !open)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#FF0000] font-bold tracking-[-1px] rounded-sm flex justify-center items-center gap-3 w-full hover:shadow-red"
                  style={{
                    fontFamily: "Helvetica Compressed, sans-serif",

                    cursor: isDeletingEvent ? "not-allowed" : "pointer",
                    opacity: isDeletingEvent ? "0.5" : "1",
                  }}
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  Leave
                </button>
              </div>
            </div>
          </ModalMUI>
        )}
      </div>
    </div>
  );
}
