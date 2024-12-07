"use client";

import { ActivityLog } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DateTime
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        </div>
      );
    },

    cell: ({ row }) => {
      const date = row.original.createdAt;

      const formatDate = (date: string | Date): string => {
        const parsedDate = new Date(date);
        return parsedDate.toLocaleString(); // Adjust the format as needed
      };
      const formattedDate = formatDate(date);

      return <div className="text-right font-medium">{formattedDate}</div>;
    },
  },
];
