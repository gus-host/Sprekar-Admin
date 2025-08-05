import HomePageLayout from "@/app/[lng]/_partials/_layout/HomePageLayout";
import EventGetter from "./EventGetter";
import { TourProvider } from "@/app/[lng]/context/TourContextVisitors";

interface Params {
  eventId: string;
  lng: string;
}
export const metadata = {
  title: "Join Event",
};

export default async function page(props: { params: Promise<Params> }) {
  const { eventId, lng } = await props.params;
  return (
    <TourProvider>
      <HomePageLayout showedHeroBg={false} lng={lng}>
        <div className="mx-auto max-w-[1100px] px-[30px] mb-[40px] my-[20px] max-[750px]:mt-[100px]">
          <h2 className="text-[18px] ">Live Translations</h2>
          <EventGetter id={eventId} />
        </div>
      </HomePageLayout>
    </TourProvider>
  );
}
