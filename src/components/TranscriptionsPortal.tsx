"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
  isShowTranscriptions: boolean;
}

export default function TranscriptionsPortal({
  children,
  isShowTranscriptions = true,
}: PortalProps) {
  const portalRoot = document.body;
  const elRef = useRef<HTMLDivElement | null>(null);
  const [isShow, setIsShow] = useState<boolean>(isShowTranscriptions);

  if (!elRef.current) {
    // Create a div for this Portal instance
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    // Append to root on mount
    portalRoot.appendChild(elRef.current!);
    return () => {
      // Clean up on unmount
      portalRoot.removeChild(elRef.current!);
    };
  }, [portalRoot]);

  // Render children into the div we've appended
  return createPortal(
    <div className="w-[300px] bg-white rounded-t-lg fixed bottom-0 right-6 border-gray-50 shadow-sm transition-all">
      <div className="border-b border-b-gray-100 flex items-center justify-between px-2 py-2.5">
        <h2>Transcriptions</h2>
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
        </div>
      ) : null}
    </div>,
    elRef.current
  );
}
