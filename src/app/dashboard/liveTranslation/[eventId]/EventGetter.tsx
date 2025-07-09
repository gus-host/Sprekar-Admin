import axios from "axios";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Spinner from "@/components/ui/Spinner";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import EventTranslation from "../_partials/EventTranslation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const revalidate = 0;

export interface Event {
  status: string;
  name: string;
  id?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  supportedLanguages: string[];
  timezone: string;
  description: string;
  qrCode: string;
  eventCode: string;
  isQRCodeEnabled: boolean;
  participants?: [];
  createdBy?: string;
  eventIsOngoing?: boolean;
}

export default async function EventGetter({ id }: { id: string }) {
  noStore();
  const cookieStore = cookies();
  const token = (await cookieStore).get("refreshTokenNew")?.value;

  let event: Event = {
    status: "",
    name: "",
    id: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    supportedLanguages: [""],
    timezone: "",
    description: "",
    qrCode: "",
    eventCode: "",
    isQRCodeEnabled: true,
  };
  let error: string | undefined;

  try {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(response.status);
      notFound();
    }

    const data = await response.json();
    event = data.data.event; // Adjust if needed
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error = err.message;
      console.log("Axios Error:", err.message);
    } else if (err instanceof Error) {
      if (err.message === "NEXT_HTTP_ERROR_FALLBACK;404") return notFound();
      error = err.message;
      console.log("Fetch Error:", err);
    } else {
      error = "An unknown error occurred.";
      console.log("Unknown Error:", err);
    }
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-[60dvh] flex items-center justify-center">
          <Spinner size={60} color="#025FF3" strokeWidth={2} />
        </div>
      }
    >
      <EventTranslation event={event} error={error} />
    </Suspense>
  );
}
