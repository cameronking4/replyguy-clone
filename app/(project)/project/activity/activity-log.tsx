"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ActivityLogEntry {
  timestamp: string
  activityType: string
  platform: string
  details: string
  engagementMetrics?: string
}

const data: ActivityLogEntry[] = [
  {
    timestamp: "4 hours ago",
    activityType: "Post Detected",
    platform: "X",
    details: "BuzzDaddy successfully detected 382 new posts across social platforms.",
    engagementMetrics: "N/A",
  },
  {
    timestamp: "2 min ago",
    activityType: "Comment Replied",
    platform: "X",
    details: "BuzzDaddy commented on X post 'Networking on social media isn't just about....'",
    engagementMetrics: "Likes: 10, Retweets: 2",
  },
  {
    timestamp: "1 hour ago",
    activityType: "Post Created",
    platform: "Reddit",
    details: "BuzzDaddy created a post in Reddit community 'SocialMediaMarketing'",
    engagementMetrics: "Upvotes: 15, Comments: 3",
  },
  {
    timestamp: "4 hours ago",
    activityType: "Post Detected",
    platform: "Multiple",
    details: "BuzzDaddy successfully detected 4176 posts across social platforms.",
    engagementMetrics: "N/A",
  },
  {
    timestamp: "6 hours ago",
    activityType: "Campaign Started",
    platform: "N/A",
    details: "Campaign for BuzzDaddy successfully started.",
    engagementMetrics: "N/A",
  },
  {
    timestamp: "3 hours ago",
    activityType: "Comment Replied",
    platform: "LinkedIn",
    details: "BuzzDaddy replied to a LinkedIn post 'Looking for social media tips...'",
    engagementMetrics: "Likes: 5, Comments: 1",
  },
  {
    timestamp: "5 hours ago",
    activityType: "Post Created",
    platform: "TikTok",
    details: "BuzzDaddy posted a video '5 Tips for Social Media Marketing Success'",
    engagementMetrics: "Likes: 20, Shares: 4",
  },
]

export const columns: ColumnDef<ActivityLogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => <div>{row.getValue("timestamp")}</div>,
  },
  {
    accessorKey: "activityType",
    header: "Activity Type",
    cell: ({ row }) => <div>{row.getValue("activityType")}</div>,
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => <div>{row.getValue("platform")}</div>,
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => <div>{row.getValue("details")}</div>,
  },
  {
    accessorKey: "engagementMetrics",
    header: "Engagement Metrics",
    cell: ({ row }) => <div>{row.getValue("engagementMetrics")}</div>,
  },
]

const activityTypes = ["All", "Post Detected", "Comment Replied", "Post Created", "Campaign Started"]
const platforms = ["All", "X", "Reddit", "LinkedIn", "TikTok", "Multiple"]
const timeRanges = ["All", "Last hour", "Last 24 hours", "Last 7 days"]

export function ActivityLogTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedRow, setSelectedRow] = React.useState<ActivityLogEntry | null>(null)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Filter details..."
          value={(table.getColumn("details")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("details")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Select
          onValueChange={(value) => table.getColumn("activityType")?.setFilterValue(value === "All" ? "" : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Activity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Activity Type</SelectLabel>
              {activityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => table.getColumn("platform")?.setFilterValue(value === "All" ? "" : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Platform</SelectLabel>
              {platforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            const now = new Date()
            let filterValue = ""

            switch (value) {
              case "Last hour":
                filterValue = new Date(now.setHours(now.getHours() - 1)).toISOString()
                break
              case "Last 24 hours":
                filterValue = new Date(now.setHours(now.getHours() - 24)).toISOString()
                break
              case "Last 7 days":
                filterValue = new Date(now.setDate(now.getDate() - 7)).toISOString()
                break
              default:
                filterValue = ""
            }

            table.getColumn("timestamp")?.setFilterValue(filterValue)
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time Range</SelectLabel>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Sheet key={row.id}>
                  <SheetTrigger asChild>
                    <TableRow
                      onClick={() => setSelectedRow(row.original)}
                      className="cursor-pointer"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <ScrollArea>
                      <SheetHeader>
                        <SheetTitle>Activity Details</SheetTitle>
                        <SheetDescription>Details of the selected activity</SheetDescription>
                      </SheetHeader>
                      {selectedRow && (
                        <div className="p-4">
                          <p><strong>Timestamp:</strong> {selectedRow.timestamp}</p>
                          <p><strong>Activity Type:</strong> {selectedRow.activityType}</p>
                          <p><strong>Platform:</strong> {selectedRow.platform}</p>
                          <p><strong>Details:</strong> {selectedRow.details}</p>
                          <p><strong>Engagement Metrics:</strong> {selectedRow.engagementMetrics}</p>
                        </div>
                      )}
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
