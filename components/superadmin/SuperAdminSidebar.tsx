import React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Newspaper,
  Folders,
  CreditCard,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

const SuperAdminSidebar = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return (
    <Command className="bg-white">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="px-8">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <Link href="/superadmin-portal">Dashboard</Link>
          </CommandItem>
          <CommandItem>
            <Newspaper className="mr-2 h-4 w-4" />
            <Link href="/add-user">Add New User</Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <Link href={`/superadmin/profile/${userId}`}>
              <span>Profile</span>
            </Link>
            <CommandShortcut>&#x2318;</CommandShortcut>
          </CommandItem>
          {/* <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <CommandShortcut>&#x2318; B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>&#x2318; S</CommandShortcut>
          </CommandItem> */}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default SuperAdminSidebar;
