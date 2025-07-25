import { TourProvider } from "@/app/context/TourContext";
import EventGetter from "./EventGetter";
type Params = Promise<{ eventId: string }>;
export const metadata = {
  title: "Event Translation",
};
export default async function page(props: { params: Params }) {
  const { eventId } = await props.params;
  return (
    <TourProvider>
      <div>
        <h2 className="text-[18px] ">Live Translations</h2>
        <EventGetter id={eventId} />
      </div>
    </TourProvider>
  );
}
