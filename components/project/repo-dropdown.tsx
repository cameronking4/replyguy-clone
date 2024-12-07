import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CaretSortIcon } from "@radix-ui/react-icons"

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="mr-2">View details<CaretSortIcon/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>BuzzDaddy</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Rerun campaign
            <DropdownMenuShortcut>⌘ SHIFT R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Go to Activity Log
            <DropdownMenuShortcut>⌘ SHIFT L</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Go to Playground
            <DropdownMenuShortcut>⌘ SHIFT P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Go to Settings
            <DropdownMenuShortcut>⌘ SHIFT S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
           Edit campaign
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            Toggle platforms
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Collaborators</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Branches</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>main</DropdownMenuItem>
                <DropdownMenuItem>dev</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        <DropdownMenuItem>
          Delete
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}