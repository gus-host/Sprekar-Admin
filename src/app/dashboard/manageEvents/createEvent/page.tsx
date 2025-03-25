import CreateEventForm from "../_partials/CreateEventForm";

export const metadata = {
  title: "Create Event",
};

export default function page() {
  return (
    <div className="mb-[60px]">
      <div>
        <h2 className="text-[#1E1E1E] text-[22px]"> Create an event</h2>
        <p className="text-[#7F7F7F] text-[14px]">
          View and edit the primary details of your events including date, title
          and time
        </p>
      </div>

      <CreateEventForm />
    </div>
  );
}
