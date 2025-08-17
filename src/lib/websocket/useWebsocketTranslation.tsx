"use client";

import { User } from "@/app/[lng]/dashboard/_partials/ProfileImgGetter";

import {
  getSavedParticipantId,
  saveJoinRecord,
} from "@/utils/helper/general/joinRecords";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ActionMeta, SingleValue } from "react-select";

// Define an interface for our custom media recorder state
interface MediaRecorderState {
  stream: MediaStream;
  audioContext: AudioContext;
  processor: ScriptProcessorNode;
}

export interface ChatMessage {
  text: string;
  translation: string;
  timestamp: Date;
}
interface ChatMessageOptimized {
  text: string;
  translation: string | { text: string };
  createdAt?: string;
  timestamp?: string;
}

export interface AudioUrls {
  timestamp: Date;
  url: string;
}

export type OptionType = {
  value: string;
  label: string;
};

/**
 * Custom hook for real-time translation via WebSocket.
 */
export default function useWebsocketTranslation(
  user: User | null,
  adminId: string,
  eventCodeServer: string,
  hasCompletedTour: string | boolean | null
) {
  const [participantId, setParticipantId] = useState<string>(() => {
    if (typeof window === "undefined" || user?._id) return "";
    return getSavedParticipantId(eventCodeServer) || "";
  });

  useEffect(() => {
    if (user?._id) return;

    if (participantId) {
      saveJoinRecord(eventCodeServer, participantId);
    }
  }, [participantId, user?._id]);

  // Real-time message histories:
  const [transcription, setTranscription] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  // Basic event & user states:
  const eventCode = eventCodeServer;
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [translationLanguage, setTranslationLanguage] =
    useState<OptionType | null>(null);

  const [isEventStarted, setIsEventStarted] = useState<boolean>(false);
  const [isEventStopped, setIsEventStopped] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isScrollToBottom, setIsScrollToBottom] = useState<boolean>(true);
  const [hasJoinedEvent, setHasJoinedEvent] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [genIsLoading, setGenIsLoading] = useState(false);
  const [fetchingInitConv, setFetchingIntConv] = useState(false);
  const [error, setError] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorderState | null>(
    null
  );
  const [ws, setWs] = useState<WebSocket | null>(null);

  // State for conversation history pagination
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [streamingLanguage, setStreamingLanguage] = useState<
    "EN_GB" | "NL" | "ES" | "EN_US" | "FR" | "ZH_HANS"
  >("EN_GB");
  const [isLoading, setIsLoading] = useState(false);

  const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL;
  const restApi = process.env.NEXT_PUBLIC_API_BASE_URL;

  const adminUserId: string = adminId;

  // at the top of your hook, before any functions:
  const wsRef = useRef<WebSocket | null>(null);
  const rejoinAfterWsClosesRef = useRef(false);

  // keep it in sync whenever `ws` changes:
  useEffect(() => {
    wsRef.current = ws;
  }, [ws]);

  // Load older messages (reverse infinite scroll)
  const loadOlderMessages = async () => {
    if (!eventCode) return;
    setLoadingMore(true);
    try {
      const response = await fetch(
        `${restApi}/conversations/${eventCode}?page=${
          currentPage + 1
        }&limit=10&userId=${user?._id ? user?._id : ""}&language=${
          translationLanguage?.value || "EN_GB"
        }`
      );
      if (!response.ok) {
        // console.error("Error loading older messages", response.statusText);
        setLoadingMore(false);
        return;
      }
      const data = await response.json();
      const olderConversations: ChatMessage[] = data.data.conversations.map(
        (c: ChatMessageOptimized) => ({
          text: c.text || "",
          translation:
            typeof c.translation === "string"
              ? c.translation
              : c.translation?.text || "",
          timestamp: c.createdAt || new Date().toISOString(),
        })
      );
      if (olderConversations.length < 10) {
        setHasMore(false);
      }

      setCurrentPage((prev) => prev + 1);
      setChatMessages((prev) => [...olderConversations, ...prev]);
    } catch (error) {
      console.error("Error loading older messages", error);
    }
    setLoadingMore(false);
  };

  // Scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const target = container.querySelector(".target-el");

    if (container.scrollTop < 10 && hasMore && !loadingMore) {
      loadOlderMessages();
    }

    if (!target) return;

    // distance from top of container to top of target
    const offsetTop = (target as HTMLDivElement).offsetTop;
    const targetBottom = offsetTop + (target as HTMLDivElement).offsetHeight;

    // how far the container has scrolled + its visible height
    const visibleBottom = container.scrollTop + container.clientHeight;
    container;

    const hiddenBelow = Math.max(0, targetBottom - visibleBottom);
    if (hiddenBelow >= 155.3333282470703 + 200) {
      setIsScrollToBottom(false);
    } else setIsScrollToBottom(true);
  };

  // Initial load of conversation history
  const fetchInitialConversations = async () => {
    if (!eventCode) return;
    setFetchingIntConv(true);
    try {
      // console.log(eventCode, user?._id);

      const response = await fetch(
        `${restApi}/conversations/${eventCode}?page=1&limit=10&userId=${
          user?._id ? user?._id : ""
        }&language=${translationLanguage?.value || "EN_GB"}`
      );
      if (!response.ok) {
        console.error(
          "Error fetching conversation history:",
          response.statusText
        );
        return;
      }
      const data = await response.json();

      const mapped = data.data.conversations.map((c: ChatMessageOptimized) => ({
        text: c.text || "",
        translation:
          typeof c.translation === "string"
            ? c.translation
            : c.translation?.text || "",
        timestamp: c.createdAt || new Date().toISOString(),
      }));

      setChatMessages(mapped);
      setCurrentPage(1);
      setHasMore(mapped.length === 10);
    } catch (error) {
      console.error("Error fetching conversation history:", error);
    } finally {
      setFetchingIntConv(false);
    }
  };

  useEffect(() => {
    if (hasJoinedEvent && eventCode) {
      fetchInitialConversations();
    }
  }, [hasJoinedEvent, eventCode, translationLanguage?.value]);

  // Connect to WebSocket
  const connectWebSocket = useCallback((): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(websocketUrl || "");
      socket.onopen = () => {
        console.log("Connected to server");
        setGenIsLoading(false);
        async function eventJoiner() {
          await joinEvent();
        }
        if (participantId && rejoinAfterWsClosesRef.current) eventJoiner();
        rejoinAfterWsClosesRef.current = false;
        setWs(socket);
        setMessage("reconnected");
        resolve(socket);
      };
      socket.onerror = (err) => {
        console.error("WebSocket connection error:", err);
        setGenIsLoading(true);
        rejoinAfterWsClosesRef.current = true;
        reject(err);
      };
      socket.onclose = () => {
        console.warn("WebSocket closed.");
        setGenIsLoading(true);
        rejoinAfterWsClosesRef.current = true;
        setMessage("websocket-closed");
        setWs(null);
      };
    });
  }, [websocketUrl]);

  // Send message helper with reconnect
  const sendWsMessage = async (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      setGenIsLoading(true);
      try {
        const socket = await connectWebSocket();
        socket.send(message);
      } catch (error) {
        console.error("Failed to reconnect and send message:", error);
      } finally {
        setGenIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!hasCompletedTour && user?._id) return;

    // Attempt a reconnect every minute if socket is not open
    const interval = setInterval(() => {
      const socket = wsRef.current;
      const isOpen = socket && socket.readyState === WebSocket.OPEN;

      if (!isOpen) {
        setGenIsLoading(true);
        console.warn("WebSocket not open. Reconnecting...");
        // You can also throttle retries or add a backoff here
        connectWebSocket().catch((err) =>
          console.error("Reconnection attempt failed:", err)
        );
        setMessage("ws-reconnecting");
      } else {
        setGenIsLoading(false);
      }
    }, 5000); // 30 seconds

    return () => clearInterval(interval);
  }, [connectWebSocket, hasCompletedTour]);

  // Load audio devices
  useEffect(() => {
    async function getAudioDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setAudioDevices(audioInputs);
        if (audioInputs.length > 0) {
          setSelectedDeviceId(audioInputs[0].deviceId);
        }
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    }
    getAudioDevices();
  }, []);

  // Open WebSocket on mount
  useEffect(() => {
    if (!hasCompletedTour && user?._id) return;
    connectWebSocket().catch((err) => {
      console.error("Initial WebSocket connection failed:", err);
    });
  }, [connectWebSocket, hasCompletedTour]);

  // Handle incoming messages
  useEffect(() => {
    if (!ws) return;
    ws.onmessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      // console.log("Received from server:", data);
      setIsLoading(false);
      setMessage(data.message);
      setError("");

      // participantId: prefer stored value

      // console.log("Message from server: ", data);

      // Error handling
      if (
        data.type === "error" &&
        (data.message === "You must join an event first" ||
          data.message === "Event is not live; audio will not be processed" ||
          data.message === "Join event first")
      ) {
        setMessage("needs-to-rejoin");
      } else if (data.type === "participant-count") {
        setParticipantCount(data.count);
      } else if (data.type === "transcription") {
        setTranscription(data.text);
      } else if (data.type === "translation") {
        setTranscription(data.text);
        setTranslation(
          data.translation.text ? data.translation.text : data.translation
        );
        // const url = synthes
        setChatMessages((prev) => [
          ...prev,
          {
            text: data.text,
            translation: data.translation.text
              ? prev[prev.length - 1].translation !== data.translation.text &&
                data.translation.text
              : prev[prev.length - 1].translation !== data.translation &&
                data.translation,
            timestamp: new Date(),
          },
        ]);

        // event started
      } else if (
        (data.type === "info" && data.message === "The event has started") ||
        (data.type === "success" && data.message === "Event has started")
      ) {
        setIsEventStarted(true);

        // joined event
      } else if (
        data.type === "success" &&
        data.message === "Successfully joined event"
      ) {
        setHasJoinedEvent(true);

        if (user?._id) return;
        setParticipantId(data.participantId as string);
      } else if (
        data.type === "error" &&
        ((data.message as string).toLowerCase().includes("audio") ||
          (data.message as string).toLowerCase().includes("speech"))
      ) {
        setMessage("Needs-to-pause-and-play");
      }
    };
  }, [ws]);

  // Message senders
  const joinEvent = async () => {
    if (!eventCode) return console.error("Missing event code.");
    const messageObj: any = {
      type: "join",
      eventCode,
      language: translationLanguage?.value || "EN_GB",
      // participantId,
      conversationPage: 1,
      conversationLimit: 10,
    };

    if (user?._id) {
      messageObj.userId = user?._id;
    } else if (participantId) {
      messageObj.participantId = participantId;
    }

    setIsLoading(true);
    await sendWsMessage(JSON.stringify(messageObj));
  };

  const rejoinEvent = async () => {
    if (!eventCode)
      return console.error("Missing event code or participantId.");
    const payload: any = {
      type: "join",
      eventCode,
      language: translationLanguage?.value || "EN_GB",
      conversationPage: 1,
      conversationLimit: 10,
    };
    if (user?._id) payload.userId = user?._id;
    else payload.participantId = participantId;

    setIsLoading(true);
    await sendWsMessage(JSON.stringify(payload));
  };

  const startEvent = async () => {
    if (!eventCode) return console.error("Missing event code.");
    setIsLoading(true);
    await sendWsMessage(
      JSON.stringify({
        type: "event-start",
        eventCode,
        userId: user?._id,
        language: translationLanguage?.value || "EN_GB",
        conversationPage: 1,
        conversationLimit: 10,
      })
    );
  };

  const stopEvent = async () => {
    if (!eventCode) return console.error("Missing event code.");
    await sendWsMessage(
      JSON.stringify({ type: "event-end", eventCode, userId: user?._id })
    );
  };

  const startRecording = async () => {
    if (!hasJoinedEvent || wsRef.current?.readyState !== WebSocket.OPEN) {
      await joinEvent();
    }
    // 2) Immediately ask for the mic and hook up onaudioprocess
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
        channelCount: 1,
        sampleRate: 16000,
        sampleSize: 16,
      },
    });

    const audioContext = new AudioContext({ sampleRate: 16000 });
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);
    // 1) Fire off your audio‐start
    const sock = wsRef.current!;
    if (sock.readyState === WebSocket.OPEN) {
      // console.log(streamingLanguage);
      sock.send(
        JSON.stringify({ type: "audio-start", eventCode, streamingLanguage })
      );
    } else {
      await sendWsMessage(
        JSON.stringify({
          type: "audio-start",
          eventCode,
          streamingLanguage,
        })
      );
    }
    processor.onaudioprocess = async (e) => {
      const s = wsRef.current;
      const inData = e.inputBuffer.getChannelData(0);
      const out16 = new Int16Array(inData.length);
      for (let i = 0; i < inData.length; i++) {
        out16[i] = Math.max(-32768, Math.min(32767, inData[i] * 32768));
      }
      if (s?.readyState === WebSocket.OPEN) {
        s.send(JSON.stringify({ type: "audio", audio: Array.from(out16) }));
      } else {
        await sendWsMessage(
          JSON.stringify({ type: "audio", audio: Array.from(out16) })
        );
      }
    };

    setMediaRecorder({ stream, audioContext, processor });
    setIsRecording(true);
  };

  async function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.processor.disconnect();
      mediaRecorder.audioContext.close();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "audio-stop", eventCode }));
    } else {
      await sendWsMessage(JSON.stringify({ type: "audio-stop", eventCode }));
    }
    setIsRecording(false);
    setMediaRecorder(null);
  }

  const handleTranslationLanguageChange = (
    option: SingleValue<OptionType>,
    actionMeta?: ActionMeta<OptionType>
  ) => {
    setTranslationLanguage(option);
    if (!hasCompletedTour) return;
    if (isEventStarted || hasJoinedEvent) {
      const msg: any = {
        type: "change-language",
        language: option?.value || "EN_GB",
        eventCode,
      };
      if (user?._id) msg.userId = user?._id;
      else msg.participantId = participantId;
      sendWsMessage(JSON.stringify(msg));
    }
  };
  // NEW: handler for streaming language change
  const handleStreamingLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = e.target.value;
    setStreamingLanguage(
      newLang as "EN_GB" | "NL" | "ES" | "EN_US" | "FR" | "ZH_HANS"
    );
    if (!hasCompletedTour) return;
    if (isEventStarted || hasJoinedEvent) {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "change-streaming-language",
            streamingLanguage: newLang,
            userId: adminUserId,
          })
        );
      } else {
        sendWsMessage(
          JSON.stringify({
            type: "change-streaming-language",
            streamingLanguage: newLang,
            userId: adminUserId,
          })
        );
      }
    }
  };

  return {
    transcription,
    translation,
    translationLanguage,
    setTranslationLanguage,
    isEventStarted,
    setIsEventStarted,
    isEventStopped,
    setIsEventStopped,
    isRecording,
    joinEvent,
    rejoinEvent,
    startEvent,
    stopEvent,
    startRecording,
    stopRecording,
    handleTranslationLanguageChange,
    isLoading,
    message,
    error,
    handleScroll,
    chatMessages,
    hasJoinedEvent,
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
    hasCompletedTour,
  };
}
