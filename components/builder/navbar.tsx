"use client";

import CodeWords from "@/components/icons/code-words";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function Logo() {
  return (
    <a href="/" aria-label="Home">
      <CodeWords />
    </a>
  );
}

function UserAvatar() {
  return (
    <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
      <Avatar size="sm">
        <AvatarImage
          src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix"
          alt="User"
        />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </Button>
  );
}

export function Navbar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-4">
      <Logo />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        {/* <UserAvatar /> */}
      </div>
    </header>
  );
}
