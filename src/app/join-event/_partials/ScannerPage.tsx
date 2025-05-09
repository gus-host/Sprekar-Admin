"use client";

import { useState } from "react";
import { useZxing } from "react-zxing";
import toast from "react-hot-toast";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import ScanningFrame from "@/app/_svgs/ScanningFrame";
import ArrowLeft from "@/app/_svgs/ArrowLeft";
import { Anchor } from "./ScannerComponent";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const { ref } = useZxing({
    constraints: {
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    },
    async onDecodeResult(r) {
      try {
        setIsJoining(true);
        const response = await fetch(`${BASE_URL}/events/${r.getText()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const data = await response.json();
        const id = data?.data?.event?.id;

        if (!id)
          return toast.error(
            data.message || "Could not join event. Please try again"
          );
        toast.success("Successfully joined the event!");
        router.push(`/join-event/${id}`); // Adjust if needed
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log("Axios Error:", err.message);
          toast.error("An error occurred!");
        } else if (err instanceof Error) {
          toast.error(err.message);
          console.log("Fetch Error:", err);
        } else {
          toast.error("An error occurred!");
          console.log("Unknown Error:", err);
        }
      } finally {
        setIsJoining(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* 1️⃣ Background video */}
      <video
        ref={ref}
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
