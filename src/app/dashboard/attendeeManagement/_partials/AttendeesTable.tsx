// components/EventsTable.tsx
"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import SearchIcon from "@/app/_svgs/SearchIcon";
import ExportBtn from "./ExportBtn";
import { DataAttendeeObj } from "../details/_partials/AttendeeDetails";

export interface AttendeeRow {
  id: string;
  name: string;
  email: string;
  language: string;
  event: string;
}

const initialData: AttendeeRow[] = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@gmail.com",
    language: "Spanish",
    event: "AI announcement",
  },
  {
    id: "2",
    name: "Helen Micheal",
    email: "helenmicheal@gmail.com",
    language: "French",
    event: "Morning service",
  },
  {
    id: "3",
    name: "Samuel Jim",
    email: "samueljim@gmail.com",
    language: "French",
    event: "AI announcement",
  },
  {
    id: "4",
    name: "John Doe",
    email: "johndoe@gmail.com",
    language: "Spanish",
    event: "AI announcement",
  },
  {
    id: "5",
    name: "Helen Micheal",
    email: "helenmicheal@gmail.com",
    language: "French",
    event: "Morning service",
  },
  {
    id: "6",
    name: "John Doe",
    email: "johndoe@gmail.com",
    language: "Spanish",
    event: "Morning service",
  },
  {
    id: "7",
    name: "Samuel Jim",
    email: "samueljim@gmail.com",
    language: "French",
    event: "Morning service",
  },
  {
    id: "8",
    name: "Samuel Jim",
    email: "samueljim@gmail.com",
    language: "French",
    event: "AI announcement",
  },
  {
    id: "9",
    name: "Samuel Jim",
    email: "samueljim@gmail.com",
    language: "French",
    event: "AI announcement",
  },
  {
    id: "10",
    name: "Samuel Jim",
    email: "samueljim@gmail.com",
    language: "French",
    event: "Morning service",
  },
  {
    id: "11",
    name: "Samuel Jim",
    email: "samueljim@gmail.com",
    language: "French",
    event: "Morning service",
  },
];

export default function AttendeesTable() {
  const [data] = useState<AttendeeRow[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  function handleRowClick() {
    router.push("/dashboard/attendeeManagement/details");
  }

  const handleExport = () => {
    setShowModal(true);
  };

  // 10) Filter logic
  const filteredData = data.filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full mx-auto pb-8 mt-[60px]">
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4 min-[450px]:px-2 max-[450px]:flex-col gap-3
      "
      >
        <div className="relative flex items-center max-[450px]:w-full">
          <span className="absolute left-3">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, language"
            className="border border-gray-300 pr-3 py-2 rounded w-[200px] min-[450px]:w-[270px] pl-10 text-[14px] max-[450px]:w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ExportBtn onClick={handleExport} />
      </div>

      {/* Table */}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={data}
      />

      {filteredData.length === 0 && (
        <div className="p-4 text-center text-gray-600">
          <h3 className="text-lg font-semibold">No Ateendee Found</h3>
          <p>Try adjusting your filter or search term.</p>
        </div>
      )}

      {/* Otherwise, render the table */}
      {filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <table className="w-full table-fixed text-left border-collapse">
              <thead className="text-[14px]">
                <tr className="border-b border-b-[#025FF3] text-[#323232]">
                  <th className="px-4 py-2 w-[5%]">
                    <input type="checkbox" />
                  </th>
                  <th className="px-4 py-2 font-medium w-[25%]">Name</th>
                  <th className="px-4 py-2 font-medium w-[25%]">
                    Email Address
                  </th>
                  <th className="px-4 py-2 font-medium w-[25%]">
                    Preferred Language
                  </th>
                  <th className="px-4 py-2 font-medium w-[25%]">
                    Event Attended
                  </th>
                  {/* <th className="px-4 py-2 font-medium w-[10%]"></th> */}
                </tr>
              </thead>
              <tbody className="text-[14px] text-[#6F6F6F]">
                {filteredData.map((row, idx) => (
                  <tr
                    key={row.id}
                    onClick={handleRowClick}
                    className={classNames(
                      "hover:bg-gray-50 cursor-pointer group",
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-3 truncate">{row.name}</td>
                    <td className="px-4 py-3 truncate">{row.email}</td>
                    <td className="px-4 py-3 truncate">{row.language}</td>
                    <td className="px-4 py-3 truncate relative">
                      {row.event}
                      <span className="hidden group-hover:inline-block group-hover:opacity-100 transition-opacity duration-200 absolute right-0 text-blue-600 text-[14px]">
                        View all
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: AttendeeRow[] | DataAttendeeObj;
}> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exported-data.json";
    link.click();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Export Preview</h2>
          <button onClick={onClose} className="text-sm">
            ✕
          </button>
        </div>
        <pre className="text-xs bg-gray-100 p-2 overflow-auto max-h-64 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="text-xs px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={download}
            className="text-xs px-3 py-1 bg-blue-600 text-white rounded"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
