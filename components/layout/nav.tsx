"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { SidebarNavItem } from "types";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DashboardNavProps {
  items: SidebarNavItem[];
}
import { Button } from "@/components/ui/button";
import React from "react";

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname();
  const searchParams = useSearchParams();

  if (!items?.length) {
    return null;
  }

  const id = searchParams.get("id");

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link
              key={index}
              href={{
                pathname: item.disabled ? "/" : item.href,
                query: item.disabled ? {} : { id: id },
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 size-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}

export function NestedNav({ items }) {
  const path = usePathname();
  const searchParams = useSearchParams();

  if (!items?.length) {
    return null;
  }

  const id = searchParams.get("id");

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        const hasSubItems = item.subItems?.length > 0;

        return (
          <Collapsible key={index} className="space-y-2" defaultOpen={item.expanded}>
            <div className={cn("flex items-center rounded-md justify-between space-x-4 hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent")}>
              <Link
                href={{
                  pathname: item.disabled ? "/" : item.href,
                  query: item.disabled ? {} : { id: id },
                }}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-md font-medium",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 size-4" />
                <span>{item.title}</span>
              </Link>
              {hasSubItems && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <CaretSortIcon className="size-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>
            {hasSubItems && (
              <CollapsibleContent className="pl-6 space-y-2">
                {item.subItems.map((subItem, subIndex) => {
                  const SubIcon = Icons[subItem.icon || "arrowRight"];
                  return (
                    <Link
                      key={subIndex}
                      href={{
                        pathname: subItem.disabled ? "/" : subItem.href,
                        query: subItem.disabled ? {} : { id: id },
                      }}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-md font-medium hover:bg-accent hover:text-accent-foreground",
                        path === subItem.href ? "bg-accent" : "transparent",
                        subItem.disabled && "cursor-not-allowed opacity-80",
                      )}
                    >
                      <SubIcon className="mr-2 size-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            )}
          </Collapsible>
        );
      })}
    </nav>
  );
}