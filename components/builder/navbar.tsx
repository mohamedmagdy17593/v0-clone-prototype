"use client";

import { useState } from "react";
import { AnimatedLogo } from "@/components/icons/animated-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckIcon, CopyIcon, GlobeIcon, UsersIcon } from "lucide-react";
import { toast } from "sonner";

function Logo() {
  return (
    <a href="/" aria-label="Home">
      <AnimatedLogo />
    </a>
  );
}

function PublishButton() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://v0.dev/t/abc123xyz");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWithTeam = () => {
    setOpen(false);
    toast.success("Shared with team", {
      description: "Your team members can now view and edit this project.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Publish</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Publish project</DialogTitle>
          <DialogDescription>
            Choose how you want to share your project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <button
            onClick={handleShareWithTeam}
            className="group flex items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-background">
              <UsersIcon className="size-4" />
            </div>
            <div className="grid gap-0.5">
              <span className="text-sm font-medium">Share with team</span>
              <span className="text-xs text-muted-foreground">
                Only your team members can view and edit
              </span>
            </div>
          </button>
          <button
            onClick={handleCopyLink}
            className="group flex items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-background">
              <GlobeIcon className="size-4" />
            </div>
            <div className="grid flex-1 gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Make public</span>
                {copied ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckIcon className="size-3" />
                    Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CopyIcon className="size-3" />
                    Copy link
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                Anyone with the link can view
              </span>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
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
      <div className="flex items-center gap-2">
        <PublishButton />
        <ThemeToggle />
        <UserAvatar />
      </div>
    </header>
  );
}
