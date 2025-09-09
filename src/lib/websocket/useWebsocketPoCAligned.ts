"use client";

import { User } from "@/app/[lng]/dashboard/_partials/ProfileImgGetter";
import { useCallback, useEffect, useRef, useState } from "react";

const HEARTBEAT_MS = 10_000;
const STALE_RECONNECT_MS = 40_000;
const WATCHDOG_TICK_MS = 5_000;
const HIGH_WATER = 512 * 1024;

export type ChatMessage = {
  id: string;
  text: string;
  translation: string;
  timestamp: string;
  source: "socket" | "pagination";
  audioUrl?: string;
  audioBase64?: string;
  mime?: string;
};

type ServerStatus = { level: "idle" | "ok" | "info" | "error"; msg: string };

type RecorderBundle = {
  stream: MediaStream;
  audioContext: AudioContext;
  processor: ScriptProcessorNode;
  muteGain: GainNode;
};

type Options = Partial<{
  user: User | null;
  wsUrl: string;
  restApi: string;
  adminUserId: string;
  defaultEvent: string;
  defaultTranslationLang: string;
  defaultStreamingLang: string;
  participantMode: boolean; // if true, userId=null and participantId used
  presetParticipantId: string; // used when participantMode=true
  debug: boolean;
}>;

function getOrCreateGuestId() {
  try {
    let pid = localStorage.getItem("spk_pid");
    if (!pid) {
      pid = `p_${crypto.randomUUID()}`;
      localStorage.setItem("spk_pid", pid);
    }
    return pid;
  } catch {
    // SSR / private mode fallback
    return `p_${Math.random().toString(36).slice(2, 10)}`;
  }
}

const dedupeMessages = (existing: ChatMessage[], incoming: ChatMessage[]) => {
  const seen = new Set(existing.map((m) => m.id));
  return [...existing, ...incoming.filter((m) => !seen.has(m.id))];
};

const downsampleFloat32ToInt16 = (
  float32: Float32Array,
  inRate = 48000,
  outRate = 16000
) => {
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
};

export default function useWebsocketPoCAligned({
  user,
  wsUrl,
  restApi,
  adminUserId = "",
  defaultEvent = "",
  defaultTranslationLang = "EN_GB",
  defaultStreamingLang = defaultTranslationLang,
  participantMode = false,
  presetParticipantId = "",
  debug = true,
}: Options = {}) {
  const WS_URL = wsUrl ?? process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL;
  const REST_API = restApi ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  /** UI state */
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [translation, setTranslation] = useState("");
  const [participantCount, setParticipantCount] = useState(0);
  const hasLoadedInitialRef = useRef(false);

  const [translationLanguage, setTranslationLanguage] = useState<string>(
    defaultTranslationLang
  );
  const [streamingLanguage, setStreamingLanguage] =
    useState<string>(defaultStreamingLang);

  const [eventCode, setEventCode] = useState(defaultEvent);
  const [isEventStarted, setIsEventStarted] = useState(false);
  const [hasJoinedEvent, setHasJoinedEvent] = useState(false);

  const [participantId, setParticipantId] = useState(
    participantMode ? presetParticipantId : adminUserId
  );
  const [isParticipant, setIsParticipant] = useState(participantMode);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    level: "idle",
    msg: "",
  });

  /** refs */
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const recorderRef = useRef<RecorderBundle | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const connectingRef = useRef(false);

  const reconnectRef = useRef({ tries: 0 });
  const lastRxRef = useRef(Date.now());
  const lastPongRef = useRef(Date.now());
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchdogTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRecordingRef = useRef(false);
  const serverAudioReadyRef = useRef(false);
  const lastResumeCheckRef = useRef(0);
  const bytesSentRef = useRef(0);
  const lastTickRef = useRef(Date.now());

  const nextActionRef = useRef<null | "join" | "start">(null);

  const sessionRef = useRef({
    eventCode: defaultEvent,
    translationLanguage: defaultTranslationLang,
    streamingLanguage: defaultStreamingLang,
    participantId: participantMode ? presetParticipantId : adminUserId,
    isParticipant: participantMode,
    adminUserId,
  });

  /** keep snapshot current */
  useEffect(() => {
    sessionRef.current = {
      eventCode,
      translationLanguage,
      streamingLanguage,
      participantId,
      isParticipant,
      adminUserId,
    };
  }, [
    eventCode,
    translationLanguage,
    streamingLanguage,
    participantId,
    isParticipant,
    adminUserId,
  ]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // 👇 REPLACE the URL-based participant effect with this:
  useEffect(() => {
    const authed = Boolean(user?._id);
    const pid = authed ? "" : getOrCreateGuestId();

    setIsParticipant(!authed);
    setParticipantId(pid);

    sessionRef.current.isParticipant = !authed;
    sessionRef.current.participantId = pid; // used when participant
    sessionRef.current.adminUserId = adminUserId; // owner id for admin path
  }, [user?._id, adminUserId]);

  /** mirror PoC: set participantId based on isParticipant */
  useEffect(() => {
    setParticipantId(isParticipant ? "" : adminUserId);
    sessionRef.current.isParticipant = isParticipant;
    sessionRef.current.participantId = isParticipant ? "" : adminUserId;
  }, [isParticipant, adminUserId]);

  /** backoff */
  const backoff = (msMin = 500, msMax = 8000) => {
    const n = reconnectRef.current.tries++;
    const jitter = Math.random() * 300;
    return Math.min(msMax, msMin * 2 ** n) + jitter;
  };

  /** safe send (stringified JSON) */
  const safeSend = useCallback((obj: unknown) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    try {
      ws.send(JSON.stringify(obj));
      return true;
    } catch {
      return false;
    }
  }, []);

  const sendJoin = useCallback(() => {
    const s = sessionRef.current;
    if (debug) {
      console.info("[FE] sendJoin", {
        eventCode: s.eventCode,
        isParticipant: s.isParticipant,
        participantId: s.participantId,
        adminUserId: s.adminUserId,
        translationLanguage: s.translationLanguage,
      });
    }

    return safeSend({
      type: "join",
      eventCode: s.eventCode,
      language: s.translationLanguage,
      participantId: s.isParticipant ? s.participantId || "" : null,
      userId: s.isParticipant ? null : s.adminUserId,
      conversationPage: 1,
      conversationLimit: 10,
    });
  }, [debug, safeSend]);

  const sendAudioStop = useCallback(() => {
    const s = sessionRef.current;
    serverAudioReadyRef.current = false;
    return safeSend({ type: "audio-stop", eventCode: s.eventCode });
  }, [safeSend]);

  const sendAudioStart = useCallback(() => {
    const s = sessionRef.current;
    serverAudioReadyRef.current = false;
    return safeSend({
      type: "audio-start",
      eventCode: s.eventCode,
      streamingLanguage: s.streamingLanguage,
    });
  }, [safeSend]);

  /** rehandshake (PoC) */
  const rehandshake = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (debug) console.warn("[WS] rehandshake");
    sendAudioStop();
    setTimeout(() => {
      sendJoin();
      setTimeout(() => sendAudioStart(), 50);
    }, 30);
  }, [debug, sendAudioStop, sendJoin, sendAudioStart]);

  /** internal mic teardown to avoid “used before declared” */
  const teardownMic = useCallback(() => {
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
  }, [sendAudioStop]);

  /** connect (PoC) */
  const connect = useCallback(
    (mode?: "join" | "start" | null) => {
      if (!WS_URL) {
        console.error("Missing WS URL");
        return;
      }
      if (connectingRef.current) {
        if (debug) console.info("[WS] connect skipped (already connecting)");
        nextActionRef.current = mode || null;
        return;
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        if (debug) console.info("[WS] already open; execute:", mode);
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

      if (debug) console.info("[WS] connecting →", WS_URL, "mode:", mode);
      const socket = new WebSocket(WS_URL);
      socket.binaryType = "arraybuffer";

      socket.onopen = () => {
        if (debug) console.log("[WS] open");
        wsRef.current = socket;
        connectingRef.current = false;
        reconnectRef.current.tries = 0;
        lastRxRef.current = Date.now();
        lastPongRef.current = Date.now();

        const action = nextActionRef.current;
        nextActionRef.current = null;
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

        // Heartbeat
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = setInterval(() => {
          const ws = wsRef.current;
          if (!ws || ws.readyState !== WebSocket.OPEN) return;
          if (Date.now() - lastRxRef.current >= HEARTBEAT_MS) {
            safeSend({ type: "ping" });
            if (debug) console.log("[WS] ping");
          }
        }, HEARTBEAT_MS);

        // Watchdog
        if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);
        watchdogTimerRef.current = setInterval(() => {
          const now = Date.now();
          const silent = now - Math.max(lastRxRef.current, lastPongRef.current);
          if (silent > STALE_RECONNECT_MS) {
            if (debug) console.warn("[WS] stale; reconnecting");
            try {
              wsRef.current?.close(4000, "stale");
            } catch {}
          }
        }, WATCHDOG_TICK_MS);
      };

      socket.onmessage = (event) => {
        lastRxRef.current = Date.now();
        if (typeof event.data !== "string") return;

        let data: any;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        switch (data.type) {
          case "pong":
            lastPongRef.current = Date.now();
            if (debug) console.log("[WS] pong");
            return;

          case "transcription":
            setTranscription(data.text || "");
            return;

          case "translation": {
            setTranslation(data.translation || "");
            const msg: ChatMessage = {
              id:
                data.messageId || data._id || `${Date.now()}-${Math.random()}`,
              text: data.text || "",
              translation: data.translation || "",
              timestamp: data.timestamp || new Date().toISOString(),
              source: "socket",
            };
            setChatMessages((prev) => dedupeMessages(prev, [msg]));
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            return;
          }

          case "translation-audio": {
            const { audioBase64, audioUrl, mime, messageId } = data;
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
            setServerStatus({
              level: "ok",
              msg: `Participants: ${data.count || 0}`,
            });
            return;

          case "success":
            if (data.message === "Successfully joined event") {
              setHasJoinedEvent(true);
              setServerStatus({ level: "ok", msg: data.message || "OK" });
            } else if (data.message === "Event has started") {
              setIsEventStarted(true);
              setServerStatus({ level: "ok", msg: data.message || "OK" });
            } else if (data.message === "Recognition started") {
              serverAudioReadyRef.current = true;
              setServerStatus({ level: "ok", msg: data.message || "OK" });
            }
            return;

          case "error": {
            const msg = (data.message || "").toLowerCase();
            if (
              msg.includes("audio timeout error") ||
              msg.includes("unknown message type") ||
              msg.includes("you must start audio recognition first") ||
              msg.includes("not in a room") ||
              msg.includes("no audio session") ||
              msg.includes("already live")
            ) {
              serverAudioReadyRef.current = false;
              rehandshake();
            } else {
              setServerStatus({ level: "error", msg: data.message || "Error" });
            }
            return;
          }

          case "info":
            setServerStatus({ level: "info", msg: data.message || "Info" });
            if (data.message === "audio-started") {
              serverAudioReadyRef.current = true;
            }
            return;

          default:
            setServerStatus({ level: "info", msg: `Unknown: ${data.type}` });
            return;
        }
      };

      socket.onclose = () => {
        if (debug) console.warn("[WS] closed");
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
        if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);

        teardownMic();

        const hadSession = hasJoinedEvent || isEventStarted;
        setTimeout(() => connect(hadSession ? "join" : null), backoff());
      };

      socket.onerror = () => {
        if (debug) console.error("[WS] error (socket)");
      };
    },
    [
      WS_URL,
      adminUserId,
      debug,
      hasJoinedEvent,
      isEventStarted,
      rehandshake,
      safeSend,
      sendAudioStart,
      sendJoin,
      teardownMic,
    ]
  );

  /** cleanup */
  useEffect(() => {
    return () => {
      try {
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
        if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);
        wsRef.current?.close();
      } catch {}
      teardownMic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /** Paginated history — PoC path (note: /api/v1/ in PoC) */
  // replace your current fetchMessages with this
  const fetchMessages = useCallback(
    async ({
      page,
      isInitial = false,
    }: {
      page: number;
      isInitial?: boolean;
    }) => {
      if (!eventCode) return;

      // For initial load, don’t reload if we already have data
      if (isInitial && chatMessages.length > 0) return;

      // const container = chatContainerRef.current;
      // const prevH = container?.scrollHeight || 0;

      setLoadingMore(true);
      try {
        const qs = new URLSearchParams({
          page: String(page),
          limit: "10",
          language: sessionRef.current.translationLanguage || "EN_GB",
        });

        // match PoC: admins send userId, participants send participantId
        if (isParticipant) {
          const pid = sessionRef.current.participantId || "";
          if (pid) qs.set("participantId", pid);
        } else {
          qs.set("userId", adminUserId);
        }

        // NOTE: path matches PoC (no /api/v1)
        const url = `${REST_API}/conversations/${encodeURIComponent(
          eventCode
        )}?${qs.toString()}`;
        const res = await fetch(url, {
          headers: { "Cache-Control": "no-cache" },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error(
            "[fetchMessages] HTTP",
            res.status,
            res.statusText,
            text || "<no body>"
          );
          setLoadingMore(false);
          return;
        }

        const data = await res.json();

        const older: ChatMessage[] = (data?.data?.conversations || []).map(
          (c: any, i: number) => ({
            id:
              c.messageId ||
              c._id ||
              `${c.createdAt || ""}-${i}-${Math.random()}`,
            text: c?.text || "",
            translation:
              typeof c?.translation === "string"
                ? c.translation
                : c?.translation?.text || "",
            timestamp: c?.createdAt || new Date().toISOString(),
            source: "pagination",
          })
        );

        if (older.length < 10) setHasMore(false);

        if (isInitial) {
          // initial load behaves like PoC (append + scroll to bottom)
          setChatMessages((prev) => dedupeMessages(prev, older));
          setCurrentPage(1);
          setTimeout(
            () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            0
          );
        } else {
          // reverse infinite scroll: prepend older, keep scroll position
          setCurrentPage((p) => p + 1);
          setChatMessages((prev) => dedupeMessages(older, prev));
          // setTimeout(() => {
          //   const newH = container?.scrollHeight || 0;
          //   if (container) container.scrollTop = newH - prevH;
          // }, 0);
        }
      } catch (e) {
        console.error("[fetchMessages] exception:", e);
      } finally {
        setLoadingMore(false);
      }
    },
    [REST_API, adminUserId, eventCode, isParticipant]
  );

  // const handleScroll = useCallback(
  //   (e: React.UIEvent<HTMLDivElement>) => {
  //     const el = e.currentTarget;
  //     if (el.scrollTop < 10 && hasMore && !loadingMore) {
  //       setLoadingMore(true);
  //       fetchMessages({ page: currentPage + 1 });
  //     }
  //   },
  //   [currentPage, fetchMessages, hasMore, loadingMore]
  // );

  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const lastLoadedPageRef = useRef(currentPage); // start from your current page

  useEffect(() => {
    const root = chatContainerRef.current;
    const target = topSentinelRef.current;
    if (!root || !target) return;

    const obs = new IntersectionObserver(
      async ([entry]) => {
        // fire only when visible, not already fetching, and there are more pages
        if (!entry.isIntersecting || isFetchingRef.current || !hasMore) return;

        isFetchingRef.current = true;

        // keep visual position after we prepend older messages
        const prevH = root.scrollHeight;
        const nextPage = (lastLoadedPageRef.current ?? 1) + 1;

        try {
          await fetchMessages({ page: nextPage }); // your existing function
          lastLoadedPageRef.current = nextPage;

          // restore scroll position so content doesn't jump
          requestAnimationFrame(() => {
            const newH = root.scrollHeight;
            root.scrollTop = newH - prevH + root.scrollTop;
          });
        } finally {
          // release after layout settles to avoid instant retrigger
          requestAnimationFrame(() => {
            isFetchingRef.current = false;
          });
        }
      },
      {
        root, // the scrollable container
        threshold: 0,
        rootMargin: "200px 0px 0px 0px", // start a bit before the exact top (nice prefetch)
      }
    );

    obs.observe(target);
    return () => obs.disconnect();
  }, [chatContainerRef, hasMore, fetchMessages]);

  useEffect(() => {
    setChatMessages([]);
    setCurrentPage(1);
    setHasMore(true);
    lastLoadedPageRef.current = 1;
    hasLoadedInitialRef.current = false;
    if (hasJoinedEvent && eventCode) {
      fetchMessages({ page: 1, isInitial: true });
    }
  }, [eventCode, translationLanguage]);

  // useEffect(() => {
  //   if (hasJoinedEvent && eventCode) {
  //     fetchMessages({ page: 1, isInitial: true });
  //   }
  // }, [fetchMessages, hasJoinedEvent, eventCode]);

  /** soft rehandshake while recording (PoC) */
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const idle = now - Math.max(lastRxRef.current, lastPongRef.current);
      if (isRecordingRef.current && idle > 10_000) {
        serverAudioReadyRef.current = false;
        sendAudioStop();
        setTimeout(() => {
          sendJoin();
          setTimeout(() => sendAudioStart(), 50);
        }, 20);
      }
    }, 5_000);
    return () => clearInterval(id);
  }, [sendAudioStart, sendAudioStop, sendJoin]);

  /** Audio */
  const ensureAudioContext = async (ctx: AudioContext) => {
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {}
    }
  };

  const startRecording = useCallback(async () => {
    if (
      !hasJoinedEvent ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      alert("Join the event first.");
      return;
    }
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          channelCount: 1,
          sampleRate: 16000 as any, // (some browsers don’t narrow this)
          sampleSize: 16 as any,
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        } as MediaTrackConstraints,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // @ts-ignore - allow webkit fallback in Safari
      const AC = (window.AudioContext ||
        (window as any).webkitAudioContext) as {
        new (opts?: AudioContextOptions): AudioContext;
      };

      let audioContext: AudioContext;
      try {
        audioContext = new AC({ sampleRate: 16000 });
      } catch {
        audioContext = new AC();
      }

      // const AC: typeof AudioContext =
      //   window.AudioContext || (window as any).webkitAudioContext;
      // const audioContext: AudioContext = new AC({ sampleRate: 16000 });
      await ensureAudioContext(audioContext);

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

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
          if (debug)
            console.warn("[WS] skip frame (backpressure)", ws.bufferedAmount);
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        const inRate = e.inputBuffer.sampleRate;
        const pcm16 = downsampleFloat32ToInt16(inputData, inRate, 16000);

        try {
          ws.send(JSON.stringify({ type: "audio", audio: Array.from(pcm16) }));
          if (debug) {
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
  }, [debug, hasJoinedEvent, selectedDeviceId, sendAudioStart]);

  const stopRecording = useCallback(() => {
    teardownMic();
  }, [teardownMic]);

  /** Public API */
  const joinEvent = useCallback(() => {
    if (!translationLanguage) {
      alert("Pick a translation language first.");
      return;
    }
    sessionRef.current.isParticipant = isParticipant;
    sessionRef.current.participantId = isParticipant
      ? participantId || ""
      : adminUserId;
    connect("join");
  }, [adminUserId, connect, isParticipant, participantId, translationLanguage]);

  const rejoinEvent = useCallback(() => {
    if (!translationLanguage) {
      alert("Pick a translation language first.");
      return;
    }
    sessionRef.current.isParticipant = isParticipant;
    sessionRef.current.participantId = isParticipant ? participantId || "" : "";
    connect("join");
  }, [connect, isParticipant, participantId, translationLanguage]);

  const startEvent = useCallback(() => {
    connect("start");
  }, [connect]);

  const endEvent = useCallback(() => {
    safeSend({ type: "event-end", eventCode, userId: adminUserId });
  }, [adminUserId, eventCode, safeSend]);

  const handleTranslationLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLang = e.target.value;
      setTranslationLanguage(newLang);
      sessionRef.current.translationLanguage = newLang;
      safeSend({
        type: "change-language",
        language: newLang,
        participantId: isParticipant ? participantId : null,
        userId: isParticipant ? null : adminUserId,
      });
    },
    [adminUserId, isParticipant, participantId, safeSend]
  );

  const handleStreamingLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLang = e.target.value;
      setStreamingLanguage(newLang);
      sessionRef.current.streamingLanguage = newLang;
      safeSend({
        type: "change-streaming-language",
        streamingLanguage: newLang,
        userId: isParticipant ? null : adminUserId,
        participantId: isParticipant ? participantId : null,
      });
      if (isRecordingRef.current) rehandshake();
    },
    [adminUserId, isParticipant, participantId, rehandshake, safeSend]
  );

  return {
    /** state */
    audioDevices,
    selectedDeviceId,
    isRecording,
    transcription,
    translation,
    participantCount,
    translationLanguage,
    streamingLanguage,
    eventCode,
    isEventStarted,
    hasJoinedEvent,
    participantId,
    isParticipant,
    chatMessages,
    currentPage,
    hasMore,
    loadingMore,
    serverStatus,

    /** setters */
    setSelectedDeviceId,
    setEventCode,
    setParticipantId,
    setIsParticipant,

    /** refs for scroll containers */
    chatContainerRef,
    chatEndRef,

    /** actions */
    joinEvent,
    rejoinEvent,
    startEvent,
    endEvent,
    startRecording,
    stopRecording,

    /** UI handlers */
    // handleScroll,
    topSentinelRef,
    handleTranslationLanguageChange,
    handleStreamingLanguageChange,

    /** debug helpers */
    connect,
    rehandshake,
  };
}
