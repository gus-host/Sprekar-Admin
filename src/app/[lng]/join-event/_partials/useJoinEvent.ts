"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export function getEventCode(url: string) {
  const parsedUrl = new URL(url);
  return parsedUrl.searchParams.get("eventCode");
}
function useJoinEvent() {
  const router = useRouter();

  const [isJoining, setIsJoining] = useState(false);

  const getEventByCode = async function (eventCode: string) {
    try {
      setIsJoining(true);
      const response = await fetch(`${BASE_URL}/events/${eventCode}`, {
        method: "GET",
        headers: {
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
  };

  return { isJoining, setIsJoining, getEventByCode };
}

export default useJoinEvent;
