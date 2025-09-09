import { Suspense } from "react";
import Spinner from "@/components/ui/Spinner";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";

import EventTranslationVisitorAligned from "./_partials/EventTranslationVisitorAligned";
// import EventTranslation from "./_partials/EventTranslation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const VISITOR_TOKEN = process.env.VISITOR_ACCESS_TOKEN;
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

  // Ensure token is defined
  const token = VISITOR_TOKEN;

  if (!token) {
    console.error("Visitor token is missing");
    return notFound();
  }

  const endpoint = `${BASE_URL}/events/${id}`;

  let event: Event | undefined;
  let error: string | undefined;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Fetch failed with status:", response.status);
      return notFound();
    }

    const data = await response.json();
    event = data.data?.event;
  } catch (err) {
    console.error("Fetch error:", err);
    error = err instanceof Error ? err.message : String(err);
  }

  if (!event) {
    console.error("No event data returned");
    return notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-[60dvh] flex items-center justify-center">
          <Spinner size={60} color="#025FF3" strokeWidth={2} />
        </div>
      }
    >
      <EventTranslationVisitorAligned event={event} error={error} />
    </Suspense>
  );
}
