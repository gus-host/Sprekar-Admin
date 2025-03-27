"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
} from "@tanstack/react-table";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Table } from "@radix-ui/themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { SingleValue } from "react-select";

import ModalMUI from "@/components/ModalMUI";
import Spinner from "@/components/ui/Spinner";
import api from "@/utils/axios/api";

import EditIcon from "@/app/_svgs/EditIcon";
import DeleteIcon from "@/app/_svgs/DeleteIcon";
import StartIcon from "@/app/_svgs/StartIcon";
import DeleteIconRed from "@/app/_svgs/DeleteIconRed";

import SearchIcon from "@/app/_svgs/SearchIcon";

// The server's event shape
interface ServerEvent {
  status: string;
  name: string;
  id: string;
  startDate: string;
  startTime: string;
}

// The shape we use in the table
interface EventData {
  id: string;
  name: string;
  date: string;
  status: "scheduled" | "live" | "ended";
}

// Props from the server
interface EventsTableProps {
  events: ServerEvent[];
  error?: string;
}

type DraggableRowProps = {
  row: Row<EventData>;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  selected: boolean;
  onSelect: () => void;
  id: string;
};

const ReactSelect = dynamic(() => import("react-select"), { ssr: false });

type OptionType = {
  value: string;
  label: string;
};

// If you want fallback data when no server events
const initialData: EventData[] = [];

export default function EventsTable({ events, error }: EventsTableProps) {
  // 1) Convert server events to table data
  const mappedData: EventData[] = [
    ...events.map((ev) => {
      const normalizedStatus = ev.status.trim().toLowerCase() as
        | "scheduled"
        | "live"
        | "ended";
      return {
        id: ev.id,
        name: ev.name,
        date: `${dayjs(ev.startDate).format("MMMM D, YYYY")} - ${dayjs(
          ev.startTime
        ).format("hh:mma")}`,
        status: normalizedStatus,
      };
    }),
  ].reverse();

  // 2) State for final table data (if no events from server, fallback)
  const [data, setData] = useState<EventData[]>(
    mappedData.length > 0 ? mappedData : initialData
  );

  // 3) Error from the server
  const [serverError] = useState<string | undefined>(error);

  // 4) If we want to retry, we can refresh the page so the server refetches
  function handleRetry() {
    window.location.reload();
  }

  // 5) Row selection, filters, etc.
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 6) Define columns
  const columns = useMemo<ColumnDef<EventData>[]>(
    () => [
      {
        id: "select",
        header: () => <input type="checkbox" className="row-checkbox" />,
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="row-checkbox"
            checked={selectedRows.includes(row.original.id)}
            onChange={() => handleSelectRow(row.original.id)}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Event Name",
      },
      {
        accessorKey: "date",
        header: "Date & Time",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const color =
            status === "scheduled"
              ? "bg-blue-500"
              : status === "live"
              ? "bg-green-500"
              : "bg-red-500";

          return (
            <div className="flex items-center gap-2">
              <span className={classNames("w-2 h-2 rounded-full", color)} />
              <span className="text-gray-800">{status}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionsDropdown row={row.original} setData={setData} />
        ),
      },
    ],
    [selectedRows]
  );

  // 7) Build the table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  // 8) Row selection toggling
  function handleSelectRow(id: string) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }

  // 9) Drag & drop reorder
  function moveRow(dragIndex: number, hoverIndex: number) {
    const updated = [...data];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, moved);
    setData(updated);
  }

  // 10) Filter logic
  const filteredRows = table
    .getRowModel()
    .rows.filter((row) =>
      statusFilter && statusFilter !== "all"
        ? row.original.status === statusFilter.toLowerCase()
        : true
    )
    .filter((row) =>
      row.original.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // 11) React Select
  const handleChange = (newValue: unknown) => {
    const typedSelected = newValue as SingleValue<OptionType>;
    setStatusFilter(typedSelected?.value || null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto py-6 space-y-4 w-full">
        {/* Filters & Create button always visible */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="text-gray-600 font-medium">Filter by</div>
            <ReactSelect
              options={[
                { value: "all", label: "All Status" },
                { value: "scheduled", label: "Scheduled" },
                { value: "live", label: "Live" },
                { value: "ended", label: "Ended" },
              ]}
              placeholder="All Status"
              onChange={handleChange}
              className="min-w-[150px]"
            />
            <div className="relative flex items-center">
              <span className="absolute left-3">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search event"
                className="border border-gray-300 pr-3 py-2 rounded w-[200px] sm:w-[250px] pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Link
            href={"/dashboard/manageEvents/createEvent"}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-start sm:self-auto text-[14px]"
          >
            Create event
          </Link>
        </div>

        <div className="overflow-x-auto w-full mt-5">
          {/* If there's a serverError, show it instead of the table */}
          {serverError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-center">
              <p>Error: {serverError}</p>
              <button
                onClick={handleRetry}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
              >
                Retry
              </button>
            </div>
          )}

          {/* If no error and no data, show "No Event yet" */}
          {!serverError && data.length === 0 && (
            <div className="p-4 text-center text-gray-600">
              <h3 className="text-lg font-semibold">No Event yet</h3>
              <p>
                There is no available event yet, create event to get started
              </p>
            </div>
          )}

          {/* If data but no filtered rows, show "No Events Found" */}
          {!serverError && data.length > 0 && filteredRows.length === 0 && (
            <div className="p-4 text-center text-gray-600">
              <h3 className="text-lg font-semibold">No Events Found</h3>
              <p>Try adjusting your filter or search term.</p>
            </div>
          )}

          {/* Otherwise, render the table */}
          {!serverError && filteredRows.length > 0 && (
            <Table.Root className="w-full text-sm table-auto">
              <Table.Header className="border-b border-[#0827F6]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.ColumnHeaderCell
                        key={header.id}
                        className="px-4 py-3 text-gray-600 font-semibold whitespace-nowrap text-left"
                      >
                        {typeof header.column.columnDef.header === "function"
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                      </Table.ColumnHeaderCell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {filteredRows.map((row, index) => (
                  <DraggableRow
                    key={row.id}
                    row={row}
                    index={index}
                    moveRow={moveRow}
                    selected={selectedRows.includes(row.original.id)}
                    onSelect={() => handleSelectRow(row.original.id)}
                    id={data[index].id}
                  />
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

/** DraggableRow + ActionsDropdown remain the same as before */
function ActionsDropdown({
  row,
  setData,
}: {
  row: EventData;
  setData: React.Dispatch<React.SetStateAction<EventData[]>>;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  async function handleDelete() {
    try {
      setIsDeletingEvent(true);
      const response = await api.delete(
        `/event/delete-event?id=${row.id}`,

        { withCredentials: true }
      );
      if (response.status === 201 || response.status === 200) {
        console.log(response.data);
        toast.success("Event deleted successfully");
        setData((data) => data.filter((d) => d.id !== row.id));
        setIsDeleteModalOpen((open) => !open);
      } else {
        toast.error("An error occured, couldnot delete event");
      }
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error?.response?.data?.message || "An error occured.");
      if (error instanceof Error) console.log(error);
    } finally {
      setIsDeletingEvent(false);
    }
  }

  const router = useRouter();
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="px-1 py-1 rounded-full hover:bg-gray-100 focus-visible:outline-none focus-visible:border-none">
            •••
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[120px] bg-white border border-gray-300 rounded shadow-md p-1"
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="cursor-pointer hover:bg-gray-100 text-sm hover:border-none focus-visible:outline-none focus-visible:border-none edit-row"
              onSelect={() => router.push(`/dashboard/manageEvents/${row.id}`)}
            >
              <div className="flex items-center gap-2 px-2 py-1">
                <EditIcon /> <span>Edit</span>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="cursor-pointer hover:bg-gray-100 text-sm hover:border-none focus-visible:outline-none focus-visible:border-none delete-row"
              onSelect={() => setIsDeleteModalOpen((open) => !open)}
            >
              <div className="flex items-center gap-2 px-2 py-1">
                <DeleteIcon /> <span>Delete</span>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="cursor-pointer hover:bg-gray-100 text-sm hover:border-none focus-visible:outline-none focus-visible:border-none live-row"
              onSelect={() => alert(`Start Live for ${row.name}`)}
            >
              <div className="flex items-center gap-2 px-2 py-1">
                <StartIcon /> <span>Start Live</span>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {isDeleteModalOpen && (
        <ModalMUI
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
        >
          <div className="flex flex-col px-[30px] py-[20px] items-center justify-center text-center">
            <DeleteIconRed />
            <p className="mt-4 text-center leading-[1.5]">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="mt-7 flex gap-3 items-center w-full">
              <button
                type="button"
                className="focus-visible:outline-none px-3 py-2 bg-white border border-[#858585] text-[14px] rounded-sm hover:bg-gray-100flex justify-center items-center w-full"
                disabled={isDeletingEvent}
                style={{
                  cursor: isDeletingEvent ? "not-allowed" : "pointer",
                }}
                onClick={() => setIsDeleteModalOpen((open) => !open)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#FF0000] font-bold tracking-[-1px] rounded-sm hover:bg-[#e60000] flex justify-center items-center gap-3 w-full"
                style={{
                  fontFamily: "Helvetica Compressed, sans-serif",
                  boxShadow: "0px 0px 6.4px 4px #FF000033",
                  cursor: isDeletingEvent ? "not-allowed" : "pointer",
                  opacity: isDeletingEvent ? "0.5" : "1",
                }}
                onClick={() => handleDelete()}
              >
                {isDeletingEvent ? (
                  <Spinner size={12} color="#fff" strokeWidth={2} />
                ) : (
                  ""
                )}
                <span>{isDeletingEvent ? "Deleting" : "Delete"}</span>
              </button>
            </div>
          </div>
        </ModalMUI>
      )}
    </>
  );
}

const DraggableRow: React.FC<DraggableRowProps> = ({
  row,
  index,
  moveRow,
  selected,
  onSelect,
  id,
}) => {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const router = useRouter();

  const [, drop] = useDrop({
    accept: "row",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "row",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement;

    if (
      target.closest(".edit-row") ||
      target.closest(".delete-row") ||
      target.closest(".row-checkbox") ||
      target.closest(".MuiModal-root") ||
      target.closest(".live-row")
    )
      return;
    router.push(`/dashboard/manageEvents/${id}`);
  };

  return (
    <Table.Row
      ref={ref}
      onClick={handleRowClick}
      className={classNames("border-b border-gray-200 hover:bg-gray-50")}
      style={{ cursor: isDragging ? "grabbing" : "pointer" }}
    >
      {row.getVisibleCells().map((cell) => {
        if (cell.column.id === "select") {
          return (
            <Table.Cell key={cell.id} className="px-4 py-3 whitespace-nowrap">
              <input
                type="checkbox"
                className="row-checkbox"
                checked={selected}
                onChange={onSelect}
              />
            </Table.Cell>
          );
        }
        return (
          <Table.Cell key={cell.id} className="px-4 py-3 whitespace-nowrap">
            {typeof cell.column.columnDef.cell === "function"
              ? cell.column.columnDef.cell(cell.getContext())
              : cell.getValue()}
          </Table.Cell>
        );
      })}
    </Table.Row>
  );
};
