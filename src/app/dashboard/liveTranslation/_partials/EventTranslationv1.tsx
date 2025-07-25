"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActionMeta, SingleValue } from "react-select";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import dynamic from "next/dynamic";
import { Fullscreen, Minimize2, QrCodeIcon } from "lucide-react";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import { Event } from "../[eventId]/EventGetter";
import SpeakerIcon from "@/app/_svgs/SpeakerIcon";
import Speakermain from "@/app/_svgs/Speakermain";
import {
  languageMap,
  LanguageOption,
} from "../../manageEvents/_partials/SupportedLanguagesSelect";
const SupportedLangaugesTranslation = dynamic(
  () =>
    import(
      "@/app/dashboard/manageEvents/_partials/SupportedLanguagesSelect"
    ).then((mod) => mod.SupportedLangaugesTranslation),
  { ssr: false }
);
import ErrorSetter from "../../_partials/ErrorSetter";
import ButtonRed from "../../_partials/ButtonRed";
import ModalMUI from "@/components/ModalMUI";
import Spinner from "@/components/ui/Spinner";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import useWebsocketTranslation, {
  ChatMessage,
} from "@/lib/websocket/useWebsocketTranslation";
import RejoinEventModal from "./RejoinEventModal";
import ButtonBlue from "../../_partials/ButtonBlue";
import { truncateText } from "@/utils/helper/general/truncateText";
import { Skeleton } from "@mui/material";
import QrCode from "../../manageEvents/_partials/QrCode";
import { downloadQrcodeImage } from "../../manageEvents/_partials/CreateEventForm";

import SpeakerIconPause from "@/app/_svgs/SpeakerIconPause";
import SpeakerIconPlay from "@/app/_svgs/SpeakerIconPlay";
import { useUser } from "@/app/context/UserContext";
import LinearProgress from "@mui/material/LinearProgress";
import TranscriptionsPortal from "@/components/TranscriptionsPortal";
import MobileTranscriptionPortal from "@/components/MobileTranscriptionPortal";
import { useTour } from "@/app/context/TourContext";

// prettier-ignore
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function EventTranslation({
  event,
  error,
}: {
  event?: Event;
  error?: string;
}) {
  const { hasCompletedTour } = useTour();

  const user = useUser();
  const {
    transcription,
    translationLanguage,
    setTranslationLanguage,
    rejoinEvent,
    joinEvent,
    startEvent,
    stopEvent,
    startRecording,
    stopRecording,
    handleTranslationLanguageChange,
    isLoading,
    message,
    handleScroll,
    chatMessages,
    error: errorTranslation,
    participantCount,
    audioDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    streamingLanguage,
    handleStreamingLanguageChange,
    genIsLoading,
    loadingMore,
    isScrollToBottom,
    fetchingInitConv,
    // hasCompletedTour,
  } = useWebsocketTranslation(
    user,
    event?.createdBy || "",
    event?.eventCode || "",
    hasCompletedTour
  );
  const endDate = new Date(event?.endDate || "");
  const endDateString = `${
    months[endDate.getMonth()]
  } ${endDate.getDate()}, ${endDate.getFullYear()}`;

  const [speakerIcon, setSpeakerIcon] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOpenRejoinModal, setIsOpenRejoinModal] = useState(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  const selectedLanguages = event?.supportedLanguages; // Example selected languages
  const formattedLanguages = selectedLanguages?.map((code) => ({
    value: code,
    label: languageMap[code] || code, // Fallback to code if label isn't found
  }));
  const { clientHeight, clientWidth } = useResponsiveSizes();
  const rejoinAttemptRef = useRef<number>(0);
  // Refs for the chat container and end-of-chat marker
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const route = useRouter();
  const handleFullScreen = useFullScreenHandle();
  const [isShowFullScreen, setIsShowFullScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reconnectWsToastId, setReconectWsToastId] = useState("");

  // console.log("event code and userId", event?.eventCode, event?.createdBy);

  useEffect(() => {
    // Attempt a reconnect every minute if socket is not open
    const interval = setInterval(() => {
      if (message === "Needs-to-pause-and-play") {
        handleClickSpeakerPause();
        handleClickSpeaker();
      }
    }, 5000); // 30 seconds

    return () => clearInterval(interval);
  }, [message]);

  // Auto-scroll to bottom when new messages arrive.
  useEffect(() => {
    if (!event?.eventIsOngoing || event?.status === "ended") return;
    if (chatEndRef.current && isScrollToBottom) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, event?.eventIsOngoing, event?.status]);

  useEffect(() => {
    if (!event?.eventIsOngoing || event?.status === "ended") return;
    if (event.name) {
      document.title = `${event.name} | Event Translation | Sprekar`;
    }
  }, [event?.name, event?.eventIsOngoing, event?.status]);

  useEffect(function () {
    if (!event) return;

    if (event.status === "ended") return;

    if (event.status === "live") {
      async function eventJoiner() {
        await joinEvent();
      }
      handleClickSpeakerPause();
      setTranslationLanguage({
        value: "EN_GB",
        label: languageMap["EN_GB"] || "EN_GB",
      });
      eventJoiner();
    } else if (
      user._id === event?.createdBy &&
      message !== "Event has started"
    ) {
      handleClickSpeakerPause();
      setTranslationLanguage({
        value: "EN_GB",
        label: languageMap["EN_GB"] || "EN_GB",
      });
      async function eventStarter() {
        await startEvent();
      }
      eventStarter();
    }
  }, []);

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
          route.replace(`/dashboard/manageEvents`);
          setIsDeleteModalOpen(false);
        }
        if (message === "ws-reconnecting" && !reconnectWsToastId) {
          handleClickSpeakerPause();

          const toastId = toast.loading("Lost connection. Reconnecting..", {
            position: "bottom-left",
          });
          setReconectWsToastId(toastId);
        }
        if (message === "reconnected") {
          if (reconnectWsToastId) toast.dismiss(reconnectWsToastId);
          setReconectWsToastId("");
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
    await stopEvent();
  }

  async function handleRejoin() {
    stopRecording();
    // setTranslationLanguage((lang) => lang);
    await rejoinEvent();
    setSpeakerIcon("play");
    setIsOpenRejoinModal(false);
  }
  async function handleClickSpeaker() {
    await startRecording();
    // setTranslationLanguage((lang) => lang);
    if (errorTranslation) return toast.error(errorTranslation);
    return setSpeakerIcon("pause");
  }
  function handleClickSpeakerPause() {
    stopRecording();
    // setTranslationLanguage((lang) => lang);
    if (errorTranslation) return toast.error(errorTranslation);
    return setSpeakerIcon("play");
  }

  function handleChangeFullScreen(
    state: boolean
    // handle: FullScreenHandle
  ) {
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
        <Link href={"/dashboard/manageEvents"} className="cursor-pointer">
          <ButtonBlue>Check out events</ButtonBlue>
        </Link>
      </div>
    );

  return (
    <div className="text-[#323232] relative mobile-portal-container">
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
          <EventController
            speakerIcon={speakerIcon}
            handleClickSpeaker={handleClickSpeaker}
            handleClickSpeakerPause={handleClickSpeakerPause}
            isLoading={isLoading}
            error={error}
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
              <div className="flex gap-3 items-center ">
                <StreamingLanguageSelector
                  language={streamingLanguage}
                  setLanguage={handleStreamingLanguageChange}
                />
                <QrCodeIcon
                  className="cursor-pointer"
                  size={16}
                  onClick={() => setIsModalOpen(true)}
                />
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="border border-gray-50 bg-gray-50 rounded hover:bg-gray-100 text-[12px] py-1 px-2"
                >
                  {audioDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {(clientWidth as number) <= 620
                        ? truncateText(device.label || "Unknown Device", 15)
                        : device.label || "Unknown Device"}
                    </option>
                  ))}
                </select>
                <>
                  {!isShowFullScreen && (
                    <Fullscreen
                      onClick={handleFullScreen.enter}
                      size={16}
                      className="cursor-pointer"
                    />
                  )}
                  {isShowFullScreen && (
                    <Minimize2
                      onClick={handleFullScreen.exit}
                      size={16}
                      className="cursor-pointer"
                    />
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
                      (!isShowFullScreen ? 290.34 : 233.34)
                    : (clientHeight as number) -
                      (!isShowFullScreen ? 364.34 : 334.34)
                }px`,
              }}
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              {loadingMore && (
                <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                  Loading...
                </div>
              )}
              {fetchingInitConv && (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="flex items-center justify-between gap-3">
                    <Spinner size={25} color="#024dc4" strokeWidth={2.5} />
                    <p>Fetching translations...</p>
                  </div>
                </div>
              )}
              <div className="target-el">
                {chatMessages.length === 0 && !fetchingInitConv ? (
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
      {(clientWidth as number) > 915 ? (
        <TranscriptionsPortal
          isShowTranscriptions={true}
          transcriptions={transcription}
        >
          {transcription ? (
            <p className="text-[12px]">{transcription}</p>
          ) : (
            <p className="text-[12px] text-center"> No Transcriptions</p>
          )}
        </TranscriptionsPortal>
      ) : (
        <MobileTranscriptionPortal transcriptions={transcription} />
      )}
      {isModalOpen && (
        <ModalMUI isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <div className="flex flex-col items-center gap-6">
            <QrCode
              eventCode={event.eventCode}
              qrCode={event.qrCode}
              description={event.description}
            />
            <div className="flex gap-4">
              <button
                type="button"
                className="focus-visible:outline-none px-8 py-2 bg-white border border-[#858585] text-[12px] rounded-sm hover:bg-gray-100"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                {event.qrCode ? "Cancel" : "Back to events"}
              </button>
              {event.qrCode && (
                <button
                  type="button"
                  className="focus:border-none focus-visible:outline-none px-2 py-2 text-[12px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm hover:bg-[#024dc4]"
                  style={{
                    fontFamily: "Helvetica Compressed, sans-serif",
                    boxShadow: "0px 0px 6.4px 4px #0255DA57",
                  }}
                  onClick={() => downloadQrcodeImage(event?.qrCode)}
                >
                  Download QR code
                </button>
              )}
            </div>
          </div>
        </ModalMUI>
      )}
    </div>
  );
}

function EventController({
  speakerIcon,
  handleClickSpeaker,
  handleClickSpeakerPause,
  isLoading,
  error,
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
  speakerIcon: string;
  handleClickSpeaker: () => Promise<string | void>;
  handleClickSpeakerPause: () => string | void;
  isLoading: boolean;
  error?: string;
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

  return (
    <div className="flex justify-between items-end max-[915px]:flex-col max-[915px]:items-start max-[915px]:gap-3">
      <div className="flex gap-3 items-center">
        <div className="cursor-pointer">
          {speakerIcon === "" && !isLoading && !error ? (
            <span onClick={() => handleClickSpeaker()} className="mic-trigger">
              <SpeakerIcon />
            </span>
          ) : speakerIcon === "pause" && !isLoading && !error ? (
            <span onClick={() => handleClickSpeakerPause()}>
              <SpeakerIconPause />
            </span>
          ) : isLoading ? (
            <div className="h-[53px] w-[53px] flex justify-center items-center">
              <Spinner size={30} color="#024dc4" strokeWidth={3} />
            </div>
          ) : (
            <span onClick={() => handleClickSpeaker()}>
              <SpeakerIconPlay />
            </span>
          )}
        </div>

        <div className="py-[10px] px-[12px] border border-[#025FF34D] bg-[#E4EFFF] rounded flex gap-2 items-center min-w-[286.23px] max-[470px]:hidden">
          <Speakermain />
          <p className="text-[12px] text-[#575757]">
            {speakerIcon === ""
              ? "Tap the Mic to start the event translation!"
              : speakerIcon === "pause"
              ? "Pause to take a break"
              : "Play back to continue"}
          </p>
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
        <div>
          <h4 className="text-[12px] text-[#7F7F7F] max-[470px]:hidden">
            Total attendees connected:
          </h4>
          <p className="text-[20px] font-semibold mb-3">{participantCount}</p>
          <ButtonRed onClick={() => setIsDeleteModalOpen((open) => !open)}>
            End Event
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
                Are you sure you want to end this event? All translation of this
                event stops here.
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
                  onClick={() => handleDelete()}
                >
                  {isDeletingEvent ? (
                    <Spinner size={12} color="#fff" strokeWidth={2} />
                  ) : (
                    ""
                  )}
                  <span>{isDeletingEvent ? "Ending" : "End"}</span>
                </button>
              </div>
            </div>
          </ModalMUI>
        )}
      </div>
    </div>
  );
}

function StreamingLanguageSelector({
  language,
  setLanguage,
}: {
  language: "EN_GB" | "NL" | "ES" | "EN_US" | "FR" | "ZH_HANS";
  setLanguage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <select
        id="language-select"
        value={language}
        onChange={setLanguage}
        className="text-[12px] border border-gray-300 rounded p-0.5"
      >
        <option value="NL">Dutch</option>
        <option value="ES">Spanish</option>
        <option value="EN_US">English (US)</option>
        <option value="EN_GB">English (GB)</option>
        <option value="FR">French</option>
        <option value="ZH_HANS">Chinese (Simplified)</option>
      </select>
    </div>
  );
}
