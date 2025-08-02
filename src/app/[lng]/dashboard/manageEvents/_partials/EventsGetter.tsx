import axios from "axios";
import { cookies } from "next/headers";
import EventsTable from "./EventTable";
import { Suspense } from "react";
import Spinner from "@/components/ui/Spinner";
import { unstable_noStore as noStore } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const revalidate = 0;

interface Event {
  status: string;
  name: string;
  id: string;
  startDate: string;
  startTime: string;
}

export default async function EventsGetter() {
  noStore();
  const cookieStore = cookies();
  const token = (await cookieStore).get("refreshTokenNew")?.value;

  let events: Event[] = [];
  let error: string | undefined;

  try {
    const response = await fetch(`${BASE_URL}/events?limit=1000`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const data = await response.json();
    events = data.data.events.events; // Adjust if needed
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error = err.message;
      console.log("Axios Error:", err.message);
    } else if (err instanceof Error) {
      error = err.message;
      console.log("Fetch Error:", err.message);
    } else {
      error = "An unknown error occurred.";
      console.log("Unknown Error:", err);
    }
    // fallback: events = []
  }
  return (
    <Suspense
      fallback={
        <div className="min-h-[60dvh] flex items-center justify-center">
          <Spinner size={60} color="#025FF3" strokeWidth={2} />
        </div>
      }
    >
      <EventsTable events={events} error={error} />
    </Suspense>
  );
}
