"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ActionMeta, SingleValue } from "react-select";

// Define an interface for our custom media recorder state
interface MediaRecorderState {
  stream: MediaStream;
  audioContext: AudioContext;
  processor: ScriptProcessorNode;
}

interface ChatMessage {
  text: string;
  translation: string;
  timestamp: Date;
}

export type OptionType = {
  value: string;
  label: string;
};

export default function useWebsocketTranslation(
  adminId: string,
  eventCodeServer: string
  // translationLang?: string
) {
  // Real-time message histories:
  const [transcription, setTranscription] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  // Basic event & user states:
  const eventCode = eventCodeServer;
  const [participantId, setParticipantId] = useState<string>("");
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [translationLanguage, setTranslationLanguage] =
    useState<OptionType | null>(null);

  const [isEventStarted, setIsEventStarted] = useState<boolean>(false);
  const [isEventStopped, setIsEventStopped] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasJoinedEvent, setHasJoinedEvent] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL;
  const restApi = process.env.NEXT_PUBLIC_API_BASE_URL;

  const adminUserId: string = adminId;

  // Function to load older messages (reverse infinite scroll)
  const loadOlderMessages = async () => {
    if (!eventCode) return;
    setLoadingMore(true);
    try {
      const response = await fetch(
        `${restApi}/conversations/${eventCode}?page=${currentPage + 1}&limit=10`
      );
      if (!response.ok) {
        console.error("Error loading older messages", response.statusText);
        setLoadingMore(false);
        return;
      }
      const data = await response.json();
      const olderConversations: ChatMessage[] = data.data.conversations || [];
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

  // Handler for scrolling on the chat container
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.scrollTop < 10 && hasMore && !loadingMore) {
      loadOlderMessages();
    }
  };

  // Fetch conversation history when user joins (initial load)
  const fetchInitialConversations = useCallback(async () => {
    if (!eventCode) return;
    try {
      const response = await fetch(
        `${restApi}/conversations/${eventCode}?page=1&limit=10`
      );
      if (!response.ok) {
        console.error(
          "Error fetching conversation history:",
          response.statusText
        );
        return;
      }
      const data = await response.json();
      setChatMessages(data.data.conversations || []);
      setCurrentPage(1);
      setHasMore((data.data.conversations || []).length === 10);
    } catch (error) {
      console.error("Error fetching conversation history:", error);
    }
  }, [eventCode, restApi]);

  useEffect(() => {
    if (hasJoinedEvent && eventCode) {
      fetchInitialConversations();
    }
  }, [hasJoinedEvent, eventCode, fetchInitialConversations]);

  // Function to connect (or reconnect) to the WebSocket
  const connectWebSocket = useCallback((): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(websocketUrl || "");
      socket.onopen = () => {
        console.log("Connected to server");
        setWs(socket);
        resolve(socket);
      };
      socket.onerror = (err) => {
        console.error("WebSocket connection error:", err);
        reject(err);
      };
      socket.onclose = () => {
        console.warn("WebSocket closed.");
        setMessage("websocket-closed");
        setWs(null);
      };
    });
  }, [websocketUrl]);

  // Helper function to send a message over WebSocket.
  // If ws is not open, it will try to reconnect and then send.
  const sendWsMessage = async (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      try {
        const socket = await connectWebSocket();
        socket.send(message);
      } catch (error) {
        console.error("Failed to reconnect and send message:", error);
      }
    }
  };

  // List available audio input devices when the component mounts
  useEffect(() => {
    async function getAudioDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setAudioDevices(audioInputs);
        // Optionally select the first device by default
        if (audioInputs.length > 0) {
          setSelectedDeviceId(audioInputs[0].deviceId);
        }
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    }
    getAudioDevices();
  }, []);

  // On mount: check for participant query and establish WebSocket connection.
  useEffect(() => {
    connectWebSocket().catch((err) => {
      console.error("Initial WebSocket connection failed:", err);
    });
  }, [connectWebSocket]);

  // Whenever ws changes, attach the onmessage handler.
  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log("Received from server:", data);
      setIsLoading(false);
      setMessage(data.message);
      setError("");
      if (!participantId && data.participantId) {
        console.log("Setting participantId from server:", data.participantId);
        setParticipantId(data.participantId);
      }
      if (
        data.type === "error" &&
        (data.message === "You must join an event first" ||
          data.message === "Event is not live; audio will not be processed")
      ) {
        setMessage("needs-to-rejoin");
      }
      if (data.type === "participant-count") {
        // Update the participant count from the server
        setParticipantCount(data.count);
      }
      if (data.type === "transcription") {
        setTranscription(data.text);
      } else if (data.type === "translation") {
        setTranscription(data.text);
        setTranslation(
          data.translation.text ? data.translation.text : data.translation
        );
        setChatMessages((prev) => [
          ...prev,
          {
            text: data.text,
            translation: data.translation.text
              ? data.translation.text
              : data.translation,
            timestamp: new Date(),
          },
        ]);
      } else if (
        (data.type === "info" && data.message === "The event has started") ||
        (data.type === "success" && data.message === "Event has started")
      ) {
        setIsEventStarted(true);
        if (data.conversations) {
          setChatMessages(data.conversations);
        }
      } else if (
        data.type === "success" &&
        data.message === "Successfully joined event"
      ) {
        if (!participantId && data.participantId) {
          console.log("Setting participantId from server:", data.participantId);
          setParticipantId(data.participantId);
        }
        setHasJoinedEvent(true);
        if (data.conversations) {
          setChatMessages(data.conversations);
        }
      }
      // Reconnection logic on speech recognition error
      else if (
        data.type === "error" &&
        (data.message === "Speech recognition error" ||
          data.message === "You must start audio recognition first")
      ) {
        console.warn(
          "Speech recognition error received or You must start audio recognition first. Reconnecting..."
        );
        if (ws) {
          ws.close();
        }
        connectWebSocket().then((newSocket) => {
          // Optionally, if an event code exists, re-join the event automatically.
          if (eventCode) {
            const joinMessage = JSON.stringify({
              type: "join",
              eventCode,
              language: translationLanguage?.value || "AR",
              participantId,
              conversationPage: 1,
              conversationLimit: 10,
            });
            newSocket.send(joinMessage);
            console.log("Rejoined event after speech recognition error.");
          }
        });
      }
    };
  }, [ws, participantId, eventCode, translationLanguage, connectWebSocket]);

  // Functions to send messages via WebSocket.
  const joinEvent = async () => {
    if (!eventCode) {
      console.error("Event code is missing.");
      return;
    }
    const message = JSON.stringify({
      type: "join",
      eventCode,
      language: translationLanguage?.value || "AR",
      participantId,
      conversationPage: 1,
      conversationLimit: 10,
    });
    setIsLoading(true);
    await sendWsMessage(message);
  };

  const rejoinEvent = async () => {
    if (!eventCode || !participantId) {
      console.error("Missing event code or participantId.");
      return;
    }
    const message = JSON.stringify({
      type: "join",
      eventCode,
      language: translationLanguage?.value || "AR",
      participantId,
      conversationPage: 1,
      conversationLimit: 10,
    });
    setIsLoading(true);
    await sendWsMessage(message);
  };

  const startEvent = async () => {
    if (!eventCode) {
      console.error("Event code is missing.");
      return;
    }
    const message = JSON.stringify({
      type: "event-start",
      eventCode,
      userId: adminUserId,
      conversationPage: 1,
      conversationLimit: 10,
    });
    setIsLoading(true);
    await sendWsMessage(message);
  };

  // Function for admin to stop the event (new functionality)
  const stopEvent = async () => {
    if (!eventCode) {
      console.error("Event code is missing.");
      return;
    }
    const message = JSON.stringify({
      type: "event-end",
      eventCode,
      userId: adminUserId,
    });
    await sendWsMessage(message);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
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
      setMediaRecorder({ stream, audioContext, processor });

      await sendWsMessage(JSON.stringify({ type: "audio-start", eventCode }));

      processor.onaudioprocess = (e: AudioProcessingEvent) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const int16Array = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            int16Array[i] = Math.max(
              -32768,
              Math.min(32767, inputData[i] * 32768)
            );
          }
          sendWsMessage(
            JSON.stringify({ type: "audio", audio: Array.from(int16Array) })
          );
        }
      };

      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.processor.disconnect();
      mediaRecorder.audioContext.close();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setMediaRecorder(null);
  };

  // For participants: handle translation language change.
  const handleTranslationLanguageChange = (
    option: SingleValue<OptionType>,
    actionMeta?: ActionMeta<OptionType>
  ) => {
    console.log(actionMeta);
    setTranslationLanguage(option);
    if (isEventStarted || hasJoinedEvent) {
      const message = JSON.stringify({
        type: "change-language",
        language: option?.value || "AR",
        participantId,
        eventCode,
      });
      sendWsMessage(message);
    } else {
      console.log(
        "Event has not started or you have not joined the event yet."
      );
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
  };
}
