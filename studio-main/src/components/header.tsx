// @ts-nocheck
"use client";
import { SheetTitle } from "@/components/ui/sheet";
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
  { href: '/tools/weekly', label: 'Weekly Timetable ( only Desktop Mode)' },
];

export function Header() {
  const [open, setOpen] = React.useState(false);
  // Handler to close sheet
  const handleClose = () => setOpen(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span id="brand" className="hidden font-bold sm:inline-block font-headline">
              PurniaPulse
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 rounded transition-colors bg-white"
            >
              {link.label}
            </Link>

            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto text-sm flex items-center gap-1 ">
                  Tools <ChevronDown id="brand" className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" >
                {toolLinks.map((link, idx) => (
                  <DropdownMenuItem key={link.href} asChild className="hover:bg-blue-200 font-semibold">
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="text-black dark:text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              {/* Accessibility: Add DialogTitle for SheetContent */}
              {/* Accessibility: Use SheetTitle for DialogContent as required by Radix UI */}
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <nav className="grid gap-6 text-lg font-medium mt-6 bg-white text-black">
                <span className="sr-only" id="mobile-menu-title">Mobile Navigation</span>
                <Link href="/" className="flex items-center space-x-2 mb-4" onClick={handleClose}>
                  <Sparkles className="h-6 w-6 text-primary" />
                <span
  className="font-bold font-headline transition-colors text-white px-4 py-1 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 hover:from-purple-400 hover:to-blue-400"
>
  PurniaPulse
</span>


                </Link>
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 rounded bg-white transition-colors"
                    onClick={handleClose}
                  >
                    {link.label}
                  </Link>

                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto text-lg flex items-center gap-1 justify-start bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 border-2 border-blue-400 text-blue-900 font-semibold shadow-md focus:ring-2 focus:ring-blue-400">
                      Tools <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                    {toolLinks.map((link, idx) => (
                      <DropdownMenuItem key={link.href} asChild className="hover:bg-blue-200 focus:bg-purple-200 text-blue-900 font-semibold">
                        <Link href={link.href} onClick={handleClose}>{link.label}</Link>
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
