import EventGetter from "./_partials/EventGetter";
export const metadata = {
  title: "Edit Event",
};

export default async function page({
  params,
}: {
  params: Promise<{ eventid: string }>;
}) {
  const { eventid } = await params;
  return (
    <div>
      <h2 className="text-[#1E1E1E] text-[22px]">Edit Event</h2>
      <p className="text-[#7F7F7F] text-[14px]">
        View and edit the primary details of your events including date, title
        and time
      </p>

      <EventGetter id={eventid} />
    </div>
  );
}
