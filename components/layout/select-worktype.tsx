"use client"
import * as React from "react"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ShieldAlertIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CreateDropdownMenu() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Ticket" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          Create
          <SelectLabel>Ticket</SelectLabel>
          <SelectItem disabled value="apple">using Chat</SelectItem>
          <SelectItem disabled value="banana">using Template</SelectItem>
          Import
          <SelectItem disabled value="banana">From Notion</SelectItem>
          <SelectItem disabled value="banana">Github Issues</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}