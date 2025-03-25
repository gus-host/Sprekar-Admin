import EventsGetter from "./_partials/EventsGetter";

export const metadata = {
  title: "Manage Event",
};

export default async function Page() {
  return (
    <div>
      <h2 className="text-[#1E1E1E] text-[22px]">Manage Event</h2>
      <p className="text-[#7F7F7F] text-[14px]">
        View and edit the primary details of your events including date, title
        and time
      </p>
      <div className="">
        <EventsGetter />
      </div>
    </div>
  );
}
