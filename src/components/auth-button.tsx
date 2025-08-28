// @ts-nocheck
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  // Helper wrappers for toast notifications
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Login Successful!",
        description: "Welcome back to PurniaPulse.",
      });
    } catch (err) {
      toast({
        title: "Login Failed",
        description: "Could not sign in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been signed out.",
      });
    } catch (err) {
      toast({
        title: "Logout Failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return null; // Or a loading skeleton
  }
  return (
     <>
        {user ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} data-ai-hint="user avatar" />
                <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        ) : (
        <Button onClick={handleLogin} variant="outline">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In with Google
        </Button>
        )}
    </>
  )
}
