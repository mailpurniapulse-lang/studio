'use client';

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center w-full min-h-screen bg-secondary/30 py-8 px-4 md:px-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="px-4 md:px-8 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground drop-shadow-lg"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
          >
            Our Tools
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore a growing collection of digital tools designed to simplify your workflow. Whether you're a student, creator, or business owner—there's something here for you.
          </p>
          <div className="mt-6 text-sm text-muted-foreground max-w-xl mx-auto">
            <p>
              ✅ <span className="font-medium">Free Tools:</span> Image Resizer, File Converter, Timetable Creator
            </p>
            <p className="mt-2">
              🔒 <span className="font-medium text-primary">Premium Tool:</span> Weekly Timetable — unlock advanced scheduling features with a free account.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
        {children}
      </div>
    </section>
  );
}
