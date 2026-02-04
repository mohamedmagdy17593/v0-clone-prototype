"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function Logo() {
  return (
    <Button variant="ghost" size="sm" className="gap-0.5 font-semibold" asChild>
      <a href="/">
        <span className="text-base">v0</span>
        <span className="text-muted-foreground text-xs font-normal">.clone</span>
      </a>
    </Button>
  );
}

function UserAvatar() {
  return (
    <Button variant="ghost" size="icon-sm" className="rounded-full" asChild>
      <button aria-label="User menu">
        <Avatar size="sm">
          <AvatarImage
            src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix"
            alt="User"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </button>
    </Button>
  );
}

export function Navbar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-3">
      <Logo />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserAvatar />
      </div>
    </header>
  );
}
