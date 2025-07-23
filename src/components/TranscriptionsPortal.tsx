"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
  isShowTranscriptions: boolean;
  transcriptions: string;
}

export default function TranscriptionsPortal({
  children,
  isShowTranscriptions = true,
  transcriptions,
}: PortalProps) {
  const portalRoot =
    typeof document !== "undefined"
      ? document.querySelector(".fullscreen")
      : null;
  const elRef = useRef<HTMLDivElement | null>(null);
  const transcriptionEndRef = useRef<HTMLDivElement | null>(null);
  const [isShow, setIsShow] = useState<boolean>(isShowTranscriptions);

  if (!elRef.current) {
    // Create a div for this Portal instance
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    if (!portalRoot) return;
    // Append to root on mount
    portalRoot.appendChild(elRef.current!);
    return () => {
      // Clean up on unmount
      portalRoot.removeChild(elRef.current!);
    };
  }, [portalRoot]);

  useEffect(() => {
    const end = transcriptionEndRef.current;

    if (!end) return;
    end.scrollIntoView({
      behavior: "smooth",
    });
  }, [transcriptions]);

  // Render children into the div we've appended
  return createPortal(
    <div
      className={cn(
        "w-[300px] bg-white rounded-t-lg fixed bottom-0 right-6 border-gray-50 shadow-sm transition-all z-1000",
        isShow && "pb-3"
      )}
    >
      <div className="border-b border-b-gray-100 flex items-center justify-between px-2 py-1.5">
        <h2 className="text-[12px] font-extrabold">Transcriptions</h2>
        <span
          className="flex items-center justify-center w-[30px] h-[30px] rounded-full hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsShow((show) => !show)}
        >
          {!isShow ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </span>
      </div>
      {isShow ? (
        <div className="h-[200px] overflow-y-auto overflow-hidden p2 px-2 py-4">
          {children}
          <div ref={transcriptionEndRef}></div>
        </div>
      ) : null}
      {!isShow && transcriptions && (
        <div className="absolute -right-1 -top-1 w-[15px] h-[15px] bg-[#0255DA] rounded-full"></div>
      )}
    </div>,
    elRef.current
  );
}
