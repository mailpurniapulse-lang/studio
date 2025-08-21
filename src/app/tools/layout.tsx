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
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="w-full text-center py-24">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="flex flex-col items-center w-full">
        <div className="w-full bg-secondary/30 py-12">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-primary-bold font-headline text-primary-foreground">
              Our Tools
            </h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of powerful, easy-to-use utilities to boost your productivity—from image resizing to smart scheduling.
            </p>
          </div>
        </div>
        <div className="container w-full max-w-2xl py-12 text-center">
          <Card className="p-8">
            <CardHeader>
              <Lock className="h-12 w-12 mx-auto text-primary" />
              <CardTitle className="mt-4">Access Restricted</CardTitle>
              <CardDescription>
                Please sign in to unlock our suite of creator tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={signInWithGoogle} size="lg">
                Sign In with Google
              </Button>
              <p className="mt-6 text-sm text-muted-foreground">
                Most tools are free to use. However, access to the <span className="font-medium text-primary">Weekly Timetable</span> requires a premium account.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Signing in also lets you save your progress, access personalized features, and manage your listings.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center w-full">
      <div className="w-full bg-secondary/30 py-12">
        <div className="container text-center">
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
              🔒 <span className="font-medium text-primary">Premium Tool:</span> Weekly Timetable — unlock advanced scheduling features with a paid account.
            </p>
          </div>
        </div>
      </div>
      <div className="container w-full max-w-5xl py-12">{children}</div>
    </section>
  );
}
