import HomePageLayout from "@/app/_partials/_layout/HomePageLayout";
import EventGetter from "./EventGetter";

type Params = Promise<{ eventId: string }>;
export const metadata = {
  title: "Event Translation",
};

export default async function page(props: { params: Params }) {
  const { eventId } = await props.params;
  return (
    <HomePageLayout showedHeroBg={false}>
      <div className="mx-auto max-w-[1100px] px-[30px] mb-[40px] my-[20px]">
        <h2 className="text-[18px] ">Live Translations</h2>
        <EventGetter id={eventId} />
      </div>
    </HomePageLayout>
  );
}
