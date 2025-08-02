import axios from "axios";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Spinner from "@/components/ui/Spinner";
import { unstable_noStore as noStore } from "next/cache";
import EditEventForm from "../../_partials/EditEventForm";
import QrCode from "../../_partials/QrCode";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const revalidate = 0;

interface Event {
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
      <div className="grid grid-cols-6 gap-x-8">
        <div className={"col-span-4 max-[800px]:col-span-6"}>
          <EditEventForm eventData={event} error={error} />
        </div>
        <div className="col-span-2 max-[800px]:col-span-6 max-[800px]:row-start-1 max-[800px]:row-end-2">
          <QrCode
            eventCode={event.eventCode}
            qrCode={event.qrCode}
            description={event.description}
            classes="max-[800px]:max-w-[300px] max-[800px]:mx-auto max-[800px]:my-[30px] bg-white"
            error={error}
          />
        </div>
      </div>
    </Suspense>
  );
}
