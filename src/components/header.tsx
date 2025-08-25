// @ts-nocheck
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutGrid, Wrench, ChevronDown, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { AuthButton } from "./auth-button";

const navLinks = [
  { href: "/blog?lang=english", label: "Blog" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

const toolLinks = [
  { href: '/tools/image-resizer', label: 'Image Resizer' },
  { href: '/tools/file-converter', label: 'File Converter' },
  { href: '/tools/timetable-creator', label: 'Timetable Creator (only Desktop Mode)' },
  { href: '/tools/weekly', label: 'Weekly Timetable (Paid- only Desktop Mode)' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span id="brand"className="hidden font-bold sm:inline-block font-headline">
              PurniaPulse
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto font-medium text-sm flex items-center gap-1">
                  Tools <ChevronDown id="brand" className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {toolLinks.map(link => (
                    <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-6">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">PurniaPulse</span>
              </Link>
              {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="p-0 h-auto font-medium text-lg flex items-center gap-1 justify-start">
                  Tools <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {toolLinks.map(link => (
                    <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
