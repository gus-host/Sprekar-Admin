import React, { useEffect, useState, useRef, useCallback } from "react";

interface ChatMessage {
  text: string;
  translation: string;
  timestamp: Date;
}

interface MediaRecorderState {
  stream: MediaStream;
  audioContext: AudioContext;
  processor: ScriptProcessorNode;
}

const AudioTranslator: React.FC = () => {
  const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL;
  const restApi = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorderState | null>(
    null
  );

  // For participant translation language (used by participants)
  const [translationLanguage, setTranslationLanguage] = useState<string>("");
  const [eventCode, setEventCode] = useState<string>("");
  const [isEventStarted, setIsEventStarted] = useState<boolean>(false);
  const [hasJoinedEvent, setHasJoinedEvent] = useState<boolean>(false);
  const [participantId, setParticipantId] = useState<string>("");
  const [isParticipant, setIsParticipant] = useState<boolean>(false);

  // For admin, assume a userId is available (hard-coded for testing)
  const adminUserId: string = "67d9a553ed100590beaf1eaf";

  // State for conversation history pagination
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Refs for the chat container and end-of-chat marker
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // On mount: check for participant query and establish WebSocket connection.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("participant") === "true") {
      setIsParticipant(true);
    }
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
      if (data.type === "transcription") {
        setTranscription(data.text);
      } else if (data.type === "translation") {
        setTranscription(data.text);
        setTranslation(data.translation);
        setChatMessages((prev) => [
          ...prev,
          {
            text: data.text,
            translation: data.translation,
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
        data.message === "Speech recognition error"
      ) {
        console.warn("Speech recognition error received. Reconnecting...");
        if (ws) {
          ws.close();
        }
        connectWebSocket().then((newSocket) => {
          // Optionally, if an event code exists, re-join the event automatically.
          if (eventCode) {
            const joinMessage = JSON.stringify({
              type: "join",
              eventCode,
              language: translationLanguage,
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

  // Auto-scroll to bottom when new messages arrive.
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Functions to send messages via WebSocket.
  const joinEvent = async () => {
    if (!eventCode) {
      console.error("Event code is missing.");
      return;
    }
    const message = JSON.stringify({
      type: "join",
      eventCode,
      language: translationLanguage,
      participantId,
      conversationPage: 1,
      conversationLimit: 10,
    });
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
      language: translationLanguage,
      participantId,
      conversationPage: 1,
      conversationLimit: 10,
    });
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
    await sendWsMessage(message);
  };

  // For participants: handle translation language change.
  const handleTranslationLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTranslationLanguage(e.target.value);
    if (isEventStarted || hasJoinedEvent) {
      const message = JSON.stringify({
        type: "change-language",
        language: e.target.value,
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

  const handleEventCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventCode(e.target.value);
  };

  const handleParticipantIdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setParticipantId(e.target.value);
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

  return (
    <div>
      <div>
        <label>Enter Event Code:</label>
        <input
          type="text"
          value={eventCode}
          onChange={handleEventCodeChange}
          placeholder="Enter event code"
        />
      </div>
      <div>
        <label>Participant ID (if you have one):</label>
        <input
          type="text"
          value={participantId}
          onChange={handleParticipantIdChange}
          placeholder="Enter your participant ID"
        />
      </div>
      <div>
        <button type="button" onClick={joinEvent}>
          Join Event
        </button>
        <button type="button" onClick={rejoinEvent} disabled={!participantId}>
          Rejoin Event
        </button>
      </div>

      {isParticipant && (
        <div>
          <label>Select Language for Translation:</label>
          <select
            value={translationLanguage}
            onChange={handleTranslationLanguageChange}
          >
            <option value="" disabled>
              -- Select language --
            </option>
            <option value="SV">Swedish</option>
            <option value="ES">Spanish</option>
            <option value="EN_GB">English (GB)</option>
            <option value="FR">French</option>
          </select>
        </div>
      )}

      <div>
        <h2>Transcription:</h2>
        <p>{transcription}</p>
      </div>

      <div>
        <h2>Translation:</h2>
        <p>{translation}</p>
      </div>

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        style={{
          overflowY: "auto",
          maxHeight: "300px",
          border: "1px solid #ccc",
          padding: "1rem",
          marginTop: "1rem",
        }}
      >
        {chatMessages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <div
              style={{
                background: "#DCF8C6",
                padding: "0.5rem 1rem",
                borderRadius: "15px",
                maxWidth: "70%",
                margin: "0.5rem 0",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{msg.text}</div>
              <div style={{ fontStyle: "italic", color: "#555" }}>
                {msg.translation}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#999",
                  textAlign: "right",
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {!isParticipant && (
        <div>
          <button type="button" onClick={startEvent}>
            Start Event (Admin)
          </button>
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioTranslator;
