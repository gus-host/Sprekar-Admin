"use client";

import React, { useState } from "react";
import ExportBtn from "../../_partials/ExportBtn";
import { Modal } from "../../_partials/AttendeesTable";

export interface DataAttendeeObj {
  attendeeDetail: object;
  attendeeEvents: object;
}
export default function AttendeeDetails() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleExport = () => {
    setShowModal(true);
  };

  const data = {
    attendeeDetail: {
      name: "John Doe",
      email: "Johndoe@gmail.com",
      preferredLanguage: "Spanish",
      sessions: "5",
    },
    attendeeEvents: [
      {
        name: "Global Summer 2024",
        time: "March 12, 2024 - 07:am",
        lang: "French",
      },
      {
        name: "Tech Conference",
        time: "March 28, 2024 - 07:am",
        lang: "Spanish",
      },
      {
        name: "Business Forum",
        time: "June 19, 2024 - 07:am",
        lang: "French",
      },
      {
        name: "AI Business Technology",
        time: "June 22, 2024 - 07:am",
        lang: "French",
      },
      {
        name: "Morning Service",
        time: "March 12, 2024 - 07:am",
        lang: "French",
      },
    ],
  };

  return (
    <div>
      <div className="flex justify-end my-[20px] ">
        <ExportBtn onClick={handleExport} />
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={data}
      />
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <table className="w-full table-fixed text-left border-collapse">
            <thead className="text-[14px] text-[#000000]">
              <tr className=" text-[#323232]">
                <th className="px-4 py-2 font-medium w-[25%]">Name</th>
                <th className="px-4 py-2 font-medium w-[25%]">Email Address</th>
                <th className="px-4 py-2 font-medium w-[25%]">
                  Preferred Language
                </th>
                <th className="px-4 py-2 font-medium w-[25%]">
                  No of Session Attended
                </th>
                {/* <th className="px-4 py-2 font-medium w-[10%]"></th> */}
              </tr>
            </thead>
            <tbody className="text-[14px] text-[#6F6F6F]">
              <tr className={"hover:bg-gray-50  group"}>
                <td className="px-4 py-3 truncate">
                  {data.attendeeDetail.name}
                </td>
                <td className="px-4 py-3 truncate">
                  {data.attendeeDetail.email}
                </td>
                <td className="px-4 py-3 truncate">
                  {data.attendeeDetail.preferredLanguage}
                </td>
                <td className="px-4 py-3 truncate">
                  {data.attendeeDetail.sessions}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <h3 className="mt-[40px] font-semibold mb-[30px]">Event Attended</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <table className="w-full table-fixed text-left border-collapse">
            <thead className="text-[14px]">
              <tr className="border-b border-b-[#025FF3] text-[#323232]">
                <th className="px-4 py-2 font-medium w-[25%]">Events Name</th>
                <th className="px-4 py-2 font-medium w-[25%]">Date & Time</th>
                <th className="px-4 py-2 font-medium w-[25%]">
                  Translated languages
                </th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-[#6F6F6F]">
              {data.attendeeEvents.map((row, idx) => (
                <tr key={idx} className={"hover:bg-gray-50 group"}>
                  <td className="px-4 py-3 truncate">{row.name}</td>
                  <td className="px-4 py-3 truncate">{row.time}</td>
                  <td className="px-4 py-3 truncate">{row.lang}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
