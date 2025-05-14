// components/EventsTable.tsx
"use client";

import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import classNames from "classnames";
import DeleteIcon from "@/app/_svgs/DeleteIcon";
import DetailsIcon from "@/app/_svgs/DetailsIcon";
import { useRouter } from "next/navigation";

interface EventRow {
  id: string;
  name: string;
  dateTime: string;
  attendees: number;
}

const initialData: EventRow[] = [
  {
    id: "1",
    name: "AI business technology",
    dateTime: "March 10, 2025 - 08:00am",
    attendees: 44,
  },
  {
    id: "2",
    name: "AI business technology",
    dateTime: "April 20, 2025 - 08:00am",
    attendees: 209,
  },
  {
    id: "3",
    name: "AI business technology",
    dateTime: "February 10, 2025 - 01:30pm",
    attendees: 1987,
  },
  {
    id: "4",
    name: "AI business technology",
    dateTime: "July 20, 2025 - 08:00am",
    attendees: 3,
  },
  {
    id: "5",
    name: "AI business technology",
    dateTime: "March 10, 2025 - 08:00am",
    attendees: 0,
  },
  {
    id: "6",
    name: "AI business technology",
    dateTime: "March 10, 2025 - 08:00am",
    attendees: 543,
  },
  {
    id: "7",
    name: "AI business technology",
    dateTime: "February 10, 2025 - 01:30pm",
    attendees: 87,
  },
  {
    id: "8",
    name: "AI business technology",
    dateTime: "January 10, 2025 - 08:00am",
    attendees: 11,
  },
  {
    id: "9",
    name: "AI business technology",
    dateTime: "March 10, 2025 - 08:00am",
    attendees: 44,
  },
  {
    id: "10",
    name: "AI business technology",
    dateTime: "April 20, 2025 - 08:00am",
    attendees: 209,
  },
  {
    id: "11",
    name: "AI business technology",
    dateTime: "February 10, 2025 - 01:30pm",
    attendees: 1987,
  },
];

export default function PastTranslations() {
  const [data] = useState<EventRow[]>(initialData);
  const router = useRouter();

  function handleRowClick() {
    router.push("/dashboard/pastTranslations/details");
  }

  return (
    <div className="w-full mx-auto pb-8 mt-[60px]">
      {/* Header: item count + filter */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-sm text-gray-500">{data.length} items</span>
        <button className="flex items-center text-sm text-blue-600 hover:underline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6 6V20a1 1 0 01-1.447.894l-4-2A1 1 0 018 18v-7.293l-6-6A1 1 0 013 4z"
            />
          </svg>
          Filter by date
        </button>
      </div>

      {/* Responsive wrapper: scroll horizontally on small screens */}
      <div className="overflow-x-auto">
        {/* Ensure the table is at least as wide as its content */}
        <div className="min-w-[600px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-4 py-2">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Event Name
                </th>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Date &amp; Time
                </th>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Number of attendees
                </th>
                <th className="px-4 py-2 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {data.map((row, idx) => (
                <tr
                  key={row.id}
                  className={classNames(
                    "hover:bg-gray-50 cursor-pointer",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  )}
                  onClick={() => handleRowClick()}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" />
                  </td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.dateTime}</td>
                  <td className="px-4 py-3">{row.attendees} Attendees</td>
                  <td className="px-4 py-3">
                    <ActionsMenu />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ActionsMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="px-2 py-1 rounded-full hover:bg-gray-100 focus:outline-none">
          •••
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          className="min-w-[120px] bg-white border border-gray-300 rounded shadow-md p-1"
        >
          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 hover:border-none focus-visible:outline-none focus-visible:border-none delete-row"
            onSelect={() => alert("Delete clicked")}
          >
            <DeleteIcon />
            Delete
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 hover:border-none focus-visible:outline-none focus-visible:border-none details-row"
            onSelect={() => alert("View detail clicked")}
          >
            <DetailsIcon />
            View detail
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
