"use client";

import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

// Define data type
interface UserData {
  country: string;
  users: number;
  flag: string;
}

// Sample data
const data: UserData[] = [
  { country: "United States", users: 3, flag: "🇺🇸" },
  { country: "United States", users: 3, flag: "🇺🇸" },
  { country: "United States", users: 3, flag: "🇺🇸" },
];

// Define columns
const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "country",
    header: () => <span>Country</span>, // Ensures ReactNode type
    cell: ({ row }) => (
      <div className="flex items-center gap-2 ">
        <span>{row.original.flag}</span>
        <span className="text-blue-500">{row.original.country}</span>
      </div>
    ),
  },
  {
    accessorKey: "users",
    header: "Users",
  },
];

export default function UsersTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full border-collapse">
      <thead className="text-[#7F7F7F] text-[14px] font-normal!">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="px-4 py-2 text-left border-b">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 cursor-pointer">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-4 py-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
