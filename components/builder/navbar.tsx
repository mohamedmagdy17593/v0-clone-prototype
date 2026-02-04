"use client";

import { AnimatedLogo } from "@/components/icons/animated-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Logo() {
  return (
    <a href="/" aria-label="Home">
      <AnimatedLogo />
    </a>
  );
}

function UserAvatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="rounded-full">
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px] font-medium">MO</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Mohamed</p>
          <p className="text-xs text-muted-foreground">mo@example.com</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Your projects</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-4">
      <Logo />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserAvatar />
      </div>
    </header>
  );
}
