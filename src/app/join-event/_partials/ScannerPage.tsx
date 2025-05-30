"use client";

import { useZxing } from "react-zxing";

import Spinner from "@/components/ui/Spinner";
import ScanningFrame from "@/app/_svgs/ScanningFrame";
import ArrowLeft from "@/app/_svgs/ArrowLeft";
import { Anchor } from "./ScannerComponent";
import useJoinEvent, { getEventCode } from "./useJoinEvent";

export default function ScannerPage({
  eventName = "Morning Service",
  token,
  toggleDrawer,
  anchor,
}: {
  eventName: string;
  token: string;
  toggleDrawer: (anchor: Anchor, open: boolean) => void;
  anchor: Anchor;
}) {
  const { isJoining, getEventByCode } = useJoinEvent();

  const { ref } = useZxing({
    constraints: {
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    },
    async onDecodeResult(r) {
      const eventCode = getEventCode(r.getText());
      await getEventByCode(eventCode as string);
    },
  });

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* 1️⃣ Background video */}
      <video
        ref={ref as React.Ref<HTMLVideoElement>}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        autoPlay
      />

      {/* 2️⃣ Overlay container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center p-4 text-white">
          <button
            onClick={() => toggleDrawer(anchor, false)}
            className="p-2 cursor-pointer "
          >
            <ArrowLeft />
          </button>
          <h1 className="ml-2 text-lg font-semibold">{eventName}</h1>
        </div>

        {/* Subtitle */}
        <p className="px-4 text-sm text-white/80">
          Place the QR code properly inside the area and scanning will start
          automatically
        </p>

        {/* Scanning Frame */}
        <div className="flex-1 flex items-center justify-center">
          {isJoining ? (
            <div className="flex gap-3 items-center">
              <Spinner size={20} color="#025FF3" strokeWidth={2} />
              <p className="text-sm text-white/80">Joining event ...</p>
            </div>
          ) : (
            <ScanningFrame />
          )}
        </div>
      </div>
    </div>
  );
}
