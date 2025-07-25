import HomePageLayout from "@/app/_partials/_layout/HomePageLayout";
import EventGetter from "./EventGetter";
import { TourProvider } from "@/app/context/TourContextVisitors";

type Params = Promise<{ eventId: string }>;
export const metadata = {
  title: "Join Event",
};

export default async function page(props: { params: Params }) {
  const { eventId } = await props.params;
  return (
    <TourProvider>
      <HomePageLayout showedHeroBg={false}>
        <div className="mx-auto max-w-[1100px] px-[30px] mb-[40px] my-[20px] max-[750px]:mt-[100px]">
          <h2 className="text-[18px] ">Live Translations</h2>
          <EventGetter id={eventId} />
        </div>
      </HomePageLayout>
    </TourProvider>
  );
}
