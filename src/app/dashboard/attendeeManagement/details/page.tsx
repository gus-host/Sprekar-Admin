import React from "react";
import BreadCrumb from "../../_partials/BreadCrumb";
import AttendeeDetails from "./_partials/AttendeeDetails";

export default function page() {
  return (
    <div>
      <BreadCrumb
        links={["Attendee mangement"]}
        active="Attendee details"
        href={["/dashboard/attendeeManagement"]}
      />
      <h2 className="text-[#1E1E1E] text-[22px]">Attendee Management</h2>
      <p className="text-[#7F7F7F] text-[14px]">
        View and edit the primary details of your events including date, title
        and time
      </p>
      <AttendeeDetails />
    </div>
  );
}
