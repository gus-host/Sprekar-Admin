"use client";

import { User } from "@/app/[lng]/dashboard/_partials/ProfileImgGetter";

import {
  getSavedParticipantId,
  saveJoinRecord,
} from "@/utils/helper/general/joinRecords";
import React, { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { ActionMeta, SingleValue } from "react-select";
import useSound from "./useSound";

// Define an interface for our custom media recorder state
interface MediaRecorderState {
  stream: MediaStream;
  audioContext: AudioContext;
  processor: ScriptProcessorNode;
  muteGain?: GainNode;
}

export interface ChatMessage {
  id?: string;
  text: string;
  translation: string;
  timestamp: Date;
  source?: string;
}
interface ChatMessageOptimized {
  messageId?: string;
  _id?: string;
  text: string;
  translation: string | { text: string };
  createdAt?: string;
  timestamp?: string;
  source?: string;
}

export interface AudioUrls {
  timestamp: Date;
  url: string;
}

export type OptionType = {
  value: string;
  label: string;
};

function dedupeMessages(existing: ChatMessage[], incoming: ChatMessage[]) {
  const seen = new Set(existing.map((m) => m.id));
  const deduped = [...existing, ...incoming.filter((m) => !seen.has(m.id))];
  return uniqueByLastWithContainment(deduped, "translation");
}

function downsampleFloat32ToInt16(
  float32: Float32Array,
  inRate = 48000,
  outRate = 16000
) {
  if (inRate === outRate) {
    const out = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      out[i] = Math.max(-32768, Math.min(32767, float32[i] * 32768));
    }
    return out;
  }
  const ratio = inRate / outRate;
  const newLen = Math.floor(float32.length / ratio);
  const out = new Int16Array(newLen);
  let idx = 0;
  for (let o = 0; o < newLen; o++) {
    out[o] = Math.max(
      -32768,
      Math.min(32767, float32[Math.floor(idx)] * 32768)
    );
    idx += ratio;
  }
  return out;
}

type UniqueOptions = {
  /** Normalize strings before comparison. Default: trim, collapse spaces, lowercase. */
  normalize?: (s: string) => string;
  /** If true, only consider whole-word containment. Default: true. */
  matchWholeWords?: boolean;
};

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Keep last occurrences, and remove any object whose prop string is fully contained
 * inside another object's prop string.
 *
 * Example:
 *  [{s:"A boy"}, {s:"A boy is good"}] -> keeps only {s:"A boy is good"}
 */
function uniqueByLastWithContainment<T extends Record<string, any>>(
  arr: T[],
  prop: keyof T,
  opts?: UniqueOptions
): T[] {
  const { normalize, matchWholeWords = true } = opts ?? {};

  const _normalize =
    normalize ?? ((s: string) => s.trim().replace(/\s+/g, " ").toLowerCase());

  // 1) Collect last occurrences (right -> left), like your original function
  const seen = new Map<string, { item: T; idx: number }>();
  for (let i = arr.length - 1; i >= 0; i--) {
    const rawKey = String(arr[i][prop]);
    if (!seen.has(rawKey)) {
      seen.set(rawKey, { item: arr[i], idx: i });
    }
  }

  // Convert to array in the order of last occurrences (left->right)
  const entries = Array.from(seen.values()).reverse();

  // 2) Precompute normalized strings to check containment
  const normalized = entries.map((e) => _normalize(String(e.item[prop])));

  // 3) Decide containment: an entry at i is removed if there exists j !== i
  //    such that normalized[j] contains normalized[i] (and j can be any).
  //    If matchWholeWords, we test word boundary containment.
  const keepMask: boolean[] = new Array(entries.length).fill(true);

  for (let i = 0; i < entries.length; i++) {
    if (!keepMask[i]) continue; // already planned removal
    const a = normalized[i];

    for (let j = 0; j < entries.length; j++) {
      if (i === j) continue;
      const b = normalized[j];

      // If equal normalized strings, we keep the later (but equal normalized shouldn't exist
      // because we deduped by rawKey earlier unless normalization changed things).
      if (a === b) {
        // Prefer to keep the one that occurs later in the original array.
        // entries are already in last-occurrence order; since we reversed, the later in
        // original (rightmost) appears later in the entries array.
        // So if we encounter equality and j > i then i is a previous occurrence and should be removed.
        if (j > i) {
          keepMask[i] = false;
        }
        continue;
      }

      // check containment: is a (shorter) contained inside b (longer)?
      let contains = false;
      if (matchWholeWords) {
        // build regex that matches the exact phrase a as whole words inside b
        const re = new RegExp("\\b" + escapeRegExp(a) + "\\b", "u");
        contains = re.test(b);
      } else {
        contains = b.includes(a);
      }

      if (contains) {
        // if b contains a, we prefer the container b => drop a
        keepMask[i] = false;
        break;
      }
    }
  }

  // 4) return filtered items preserving order of entries
  const result: T[] = [];
  for (let i = 0; i < entries.length; i++) {
    if (keepMask[i]) result.push(entries[i].item);
  }
  return result;
}

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
    "EN_GB" | "NL" | "ES" | "EN_US" | "FR" | "ZH_HANS" | "sv-SE" | "de-DE"
  >("EN_GB");
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState({ level: "idle", msg: "" });
  const reconnectWsToastIdRef = useRef("");
  const { playSound } = useSound("/sounds/notification.mp3");

  const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL;
  const restApi = process.env.NEXT_PUBLIC_API_BASE_URL;

  const adminUserId: string = adminId;
  const DEBUG = false;

  /** Timers (ms) */
  const HEARTBEAT_MS = 10_000;
  const STALE_RECONNECT_MS = 40_000;
  const WATCHDOG_TICK_MS = 5_000;

  /** Outgoing WS buffer high-water mark */
  const HIGH_WATER = 512 * 1024;

  // at the top of your hook, before any functions:
  const wsRef = useRef<WebSocket | null>(null);

  const recorderRef = useRef<MediaRecorderState | null>(null); // { stream, audioContext, processor, muteGain }
  const connectingRef = useRef(false);

  const reconnectRef = useRef({ tries: 0 });
  const lastRxRef = useRef(Date.now());
  const lastPongRef = useRef(Date.now());

  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );
  const watchdogTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );

  const isRecordingRef = useRef(false);
  const serverAudioReadyRef = useRef(false); // gate for PCM sending
  const lastResumeCheckRef = useRef(0);
  const bytesSentRef = useRef(0);
  const lastTickRef = useRef(Date.now());

  // what action should run right after socket opens?
  const nextActionRef = useRef<"join" | "start" | null>(null); // 'join' | 'start' | null

  // session snapshot for reconnect/rehandshake
  const sessionRef = useRef({
    eventCode: eventCode,
    translationLanguage: translationLanguage?.value || "EN_GB",
    streamingLanguage: streamingLanguage,
    participantId: "",
    isParticipant: false,
    adminUserId: adminUserId,
  });
  const rejoinAfterWsClosesRef = useRef(false);

  useEffect(() => {
    sessionRef.current = {
      eventCode,
      translationLanguage: translationLanguage?.value || "EN_GB",
      streamingLanguage,
      participantId,
      isParticipant: false,
      adminUserId: adminUserId,
    };
  }, [eventCode, translationLanguage, streamingLanguage, participantId]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  function backoff(msMin = 500, msMax = 8000) {
    const n = reconnectRef.current.tries++;
    const jitter = Math.random() * 300;
    return Math.min(msMax, msMin * 2 ** n) + jitter;
  }

  /** ------- SAFE SEND HELPERS ------- */
  const safeSend = (obj: {}) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    try {
      ws.send(JSON.stringify(obj));
      return true;
    } catch {
      return false;
    }
  };

  const sendJoin = () => {
    const s = sessionRef.current;
    if (DEBUG)
      console.info("[FE] sendJoin", {
        eventCode: s.eventCode,
        isParticipant: s.isParticipant,
        participantId: s.participantId,
        adminUserId: s.adminUserId,
        translationLanguage: s.translationLanguage,
      });

    const payload = {
      type: "join",
      eventCode: s.eventCode,
      language: s.translationLanguage,
      participantId: s.isParticipant ? "" : null,
      userId: s.isParticipant ? null : s.adminUserId,
      conversationPage: 1,
      conversationLimit: 10,
    };
    return safeSend(payload);
  };

  const sendAudioStop = () => {
    const s = sessionRef.current;
    serverAudioReadyRef.current = false;
    return safeSend({ type: "audio-stop", eventCode: s.eventCode });
  };

  const sendAudioStart = () => {
    const s = sessionRef.current;
    serverAudioReadyRef.current = false;
    const ok = safeSend({
      type: "audio-start",
      eventCode: s.eventCode,
      streamingLanguage: s.streamingLanguage,
    });
    if (ok) setTimeout(() => (serverAudioReadyRef.current = true), 150);
    return ok;
  };

  /** Rehandshake after server error (does NOT stop mic) */
  const rehandshake = async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (DEBUG) console.warn("[WS] rehandshake (error recovery)");
    sendAudioStop();
    setTimeout(() => {
      sendJoin();
      setTimeout(() => {
        sendAudioStart();
      }, 50);
    }, 30);
  };

  /** --------- CONNECT & TIMERS --------- */
  function connect(mode: "start" | "join" | null /* 'join' | 'start' */) {
    if (!hasCompletedTour && user?._id) return;

    if (connectingRef.current) {
      if (DEBUG) console.info("[WS] connect skipped (already connecting)");
      nextActionRef.current = mode || null;
      return;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      if (DEBUG) console.info("[WS] already open; executing action:", mode);
      if (mode === "join") {
        sendJoin();
        if (isRecordingRef.current) sendAudioStart();
      } else if (mode === "start") {
        safeSend({
          type: "event-start",
          eventCode: sessionRef.current.eventCode,
          userId: adminUserId,
          conversationPage: 1,
          conversationLimit: 10,
        });
      }
      return;
    }

    nextActionRef.current = mode || null;

    connectingRef.current = true;
    if (DEBUG) console.info("[WS] connecting →", websocketUrl, "mode:", mode);
    const socket = new WebSocket(websocketUrl as string);
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      if (DEBUG) console.log("[WS] open");
      wsRef.current = socket;
      connectingRef.current = false;
      reconnectRef.current.tries = 0;
      lastRxRef.current = Date.now();
      lastPongRef.current = Date.now();

      // Only perform the requested action after open:
      const action = nextActionRef.current;
      nextActionRef.current = null;

      if (reconnectWsToastIdRef.current)
        toast.dismiss(reconnectWsToastIdRef.current);
      reconnectWsToastIdRef.current = "";

      if (action === "join") {
        sendJoin();
        if (isRecordingRef.current) sendAudioStart();
      } else if (action === "start") {
        safeSend({
          type: "event-start",
          eventCode: sessionRef.current.eventCode,
          userId: adminUserId,
          conversationPage: 1,
          conversationLimit: 10,
        });
      }

      // Heartbeat + watchdog
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = setInterval(() => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        if (Date.now() - lastRxRef.current >= HEARTBEAT_MS) {
          safeSend({ type: "ping" });
          if (DEBUG) console.log("[WS] ping");
        }
      }, HEARTBEAT_MS);

      clearInterval(watchdogTimerRef.current);
      watchdogTimerRef.current = setInterval(() => {
        const now = Date.now();
        const silentFor =
          now - Math.max(lastRxRef.current, lastPongRef.current);
        if (silentFor > STALE_RECONNECT_MS) {
          if (DEBUG) console.warn("[WS] stale; reconnecting");
          if (!reconnectWsToastIdRef.current) {
            const toastId = toast.loading("Lost connection. Reconnecting..", {
              position: "bottom-left",
            });
            reconnectWsToastIdRef.current = toastId;
          }

          try {
            wsRef.current && wsRef.current.close(4000, "stale");
          } catch {}
        }
      }, WATCHDOG_TICK_MS);
    };

    socket.onmessage = (event) => {
      lastRxRef.current = Date.now();
      if (typeof event.data !== "string") return;
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      setMessage(data.message);

      // console.log("Message from server: ", data);

      switch (data.type) {
        case "pong":
          lastPongRef.current = Date.now();
          if (DEBUG) console.log("[WS] pong");
          return;

        case "transcription":
          setTranscription(data.text || "");
          return;

        case "translation": {
          // setTranscription(data.text || "");
          setTranslation(data.translation || "");
          const msg = {
            id: data.messageId || data._id || `${Date.now()}-${Math.random()}`,
            text: data.text || "",
            translation: data.translation || "",
            timestamp: data.timestamp || new Date().toISOString(),
            source: "socket",
          };
          setChatMessages((prev) => dedupeMessages(prev, [msg]));

          playSound();

          return;
        }

        case "translation-audio": {
          const {
            audioBase64,
            audioUrl,
            mime,
            messageId,
            tgtLang,
            eventCode: ev,
          } = data;
          const len = (audioBase64 && audioBase64.length) || 0;
          console.info("[FE] translation-audio", {
            messageId,
            eventCode: ev,
            tgtLang,
            hasUrl: !!audioUrl,
            b64Len: len,
            mime,
          });
          if (!messageId) return;
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === messageId
                ? audioUrl
                  ? { ...m, audioUrl, mime: mime || "audio/wav" }
                  : audioBase64
                  ? { ...m, audioBase64, mime: mime || "audio/wav" }
                  : m
                : m
            )
          );
          return;
        }

        case "participant-count":
          setParticipantCount(data.count || 0);
          if (data.count > 0) setIsLoading((prev) => prev === true && false);
          setServerStatus({
            level: "ok",
            msg: `Participants: ${data.count || 0}`,
          });
          return;

        case "success":
          if (data.message === "Successfully joined event") {
            setHasJoinedEvent(true);
            if (!user?._id) {
              setParticipantId(data.participantId as string);
            }
            setServerStatus({ level: "ok", msg: data.message || "OK" });
          } else if (data.message === "Event has started") {
            setIsEventStarted(true);
            setServerStatus({ level: "ok", msg: data.message || "OK" });
          }
          return;

        case "info":
          setServerStatus({ level: "info", msg: data.message || "Info" });
          if (data.message === "audio-started") {
            serverAudioReadyRef.current = true;
          }
          return;

        case "error": {
          if (DEBUG) console.warn("[WS] error:", data);
          setServerStatus({
            level: "error",
            msg: data.message || "Server error",
          });
          const msg = (data.message || "").toLowerCase();
          if (
            msg.includes("unknown message type") ||
            msg.includes("you must start audio recognition first") ||
            msg.includes("not in a room") ||
            msg.includes("no audio session") ||
            msg.includes("Already live")
          ) {
            serverAudioReadyRef.current = false;
            rehandshake();
          }

          return;
        }

        default:
          setServerStatus({ level: "info", msg: `Unknown: ${data.type}` });
          return;
      }
    };

    socket.onclose = () => {
      if (DEBUG) console.warn("[WS] closed");
      clearInterval(heartbeatTimerRef.current);
      clearInterval(watchdogTimerRef.current);
      // stopRecording(); // mic off if socket dies
      // Auto-reconnect only if we had a session (joined or started)
      setTimeout(() => connect("join"), backoff());
    };

    socket.onerror = () => {
      if (DEBUG) console.error("[WS] error (socket)");
    };
  }

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
          id: c.messageId || c._id || `${Date.now()}-${Math.random()}`,
          text: c.text || "",
          translation:
            typeof c.translation === "string"
              ? c.translation
              : c.translation?.text || "",
          timestamp: c.createdAt || new Date().toISOString(),
          source: "pagination",
        })
      );
      const olderConvFilter = uniqueByLastWithContainment(
        olderConversations,
        "translation"
      );
      if (olderConversations.length < 10) {
        setHasMore(false);
      }

      setCurrentPage((prev) => prev + 1);
      setChatMessages((prev) => dedupeMessages(olderConvFilter, prev));
    } catch (error) {
      console.error("Error loading older messages", error);
    } finally {
      setLoadingMore(false);
    }
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
        id: c.messageId || c._id || `${Date.now()}-${Math.random()}`,
        text: c.text || "",
        translation:
          typeof c.translation === "string"
            ? c.translation
            : c.translation?.text || "",
        timestamp: c.createdAt || new Date().toISOString(),
      }));

      setChatMessages(mapped);
      setCurrentPage(1);
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

  /** Devices */
  useEffect(() => {
    (async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const inputs = devices.filter((d) => d.kind === "audioinput");
        setAudioDevices(inputs);
        if (inputs.length > 0) setSelectedDeviceId(inputs[0].deviceId);
      } catch (e) {
        console.error("enumerateDevices error:", e);
      }
    })();
  }, []);

  // Message senders
  const joinEvent = () => {
    // make sure sessionRef reflects latest toggles
    sessionRef.current.participantId = participantId || adminUserId;
    connect("join");
  };

  const rejoinEvent = async () => {
    sessionRef.current.participantId = participantId || "";
    // sessionRef.current.participantId = participantId || ADMIN_USER_ID;
    // if socket is already open, this just sends JOIN; otherwise connects then joins
    connect("join");
  };

  const startEvent = () => {
    // Admin path — connects and then sends event-start
    connect("start");
  };

  const stopEvent = () => {
    // will no-op if not connected
    safeSend({ type: "event-end", eventCode, userId: adminUserId });
  };

  /** Audio */
  async function ensureAudioContext(ctx: {
    state: string;
    resume: () => Promise<void>;
  }) {
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {}
    }
  }

  const startRecording = async () => {
    try {
      const constraints = {
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          volume: 1.0,
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // AC is the AudioContext *constructor* or undefined (safe for SSR)
      const AC: typeof AudioContext | undefined =
        typeof window !== "undefined"
          ? window.AudioContext ?? (window as any).webkitAudioContext
          : undefined;

      // usage guard
      if (!AC)
        throw new Error("AudioContext is not supported in this environment");
      const audioContext = new AC({ sampleRate: 16000 });
      await ensureAudioContext(audioContext);

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      // keep graph alive but no feedback
      const mute = audioContext.createGain();
      mute.gain.value = 0;

      source.connect(processor);
      processor.connect(mute);
      mute.connect(audioContext.destination);

      recorderRef.current = { stream, audioContext, processor, muteGain: mute };

      // arm server recognizer
      sendAudioStart();

      processor.onaudioprocess = (e) => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        if (!serverAudioReadyRef.current) return;

        const now = Date.now();
        if (
          now - lastResumeCheckRef.current > 5000 &&
          recorderRef.current?.audioContext
        ) {
          ensureAudioContext(recorderRef.current.audioContext);
          lastResumeCheckRef.current = now;
        }

        if (ws.bufferedAmount > HIGH_WATER) {
          if (DEBUG)
            console.warn("[WS] skip frame (backpressure)", ws.bufferedAmount);
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        const inRate = e.inputBuffer.sampleRate;
        const pcm16 = downsampleFloat32ToInt16(inputData, inRate, 16000);

        try {
          ws.send(pcm16.buffer);
          if (DEBUG) {
            bytesSentRef.current += pcm16.byteLength;
            if (now - lastTickRef.current > 1000) {
              console.log(
                `[FE] audio: inRate=${inRate}, chunk=${pcm16.byteLength}B, sent=${bytesSentRef.current}B/s`
              );
              bytesSentRef.current = 0;
              lastTickRef.current = now;
            }
          }
        } catch {}
      };

      setIsRecording(true);
    } catch (err) {
      console.error("Audio access error:", err);
    }
  };

  const stopRecording = () => {
    const rec = recorderRef.current;
    try {
      rec?.processor?.disconnect();
      rec?.muteGain?.disconnect?.();
      rec?.audioContext?.close?.();
      rec?.stream?.getTracks()?.forEach((t) => t.stop());
      sendAudioStop();
    } finally {
      recorderRef.current = null;
      setIsRecording(false);
    }
  };

  const handleTranslationLanguageChange = (
    option: SingleValue<OptionType>,
    actionMeta?: ActionMeta<OptionType>
  ) => {
    setTranslationLanguage(option);
    if (!hasCompletedTour) return;
    sessionRef.current.translationLanguage = option?.value as string;
    safeSend({
      type: "change-language",
      language: option?.value || "EN_GB",
      participantId: user?._id ? null : participantId,
      userId: user?._id ? user?._id : null,
    });
  };
  // NEW: handler for streaming language change
  const handleStreamingLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = e.target.value;
    setStreamingLanguage(
      newLang as
        | "EN_GB"
        | "NL"
        | "ES"
        | "EN_US"
        | "FR"
        | "ZH_HANS"
        | "sv-SE"
        | "de-DE"
    );
    if (!hasCompletedTour) return;
    sessionRef.current.streamingLanguage = newLang as
      | "EN_GB"
      | "NL"
      | "ES"
      | "EN_US"
      | "FR"
      | "ZH_HANS"
      | "sv-SE"
      | "de-DE";
    safeSend({
      type: "change-streaming-language",
      streamingLanguage: newLang,
      userId: user?._id ? user?._id : null,
      participantId: user?._id ? null : user?._id,
    });
    if (isRecordingRef.current) {
      rehandshake();
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
