"use client";

import { useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "@/components/theme-provider";
import { LogOut, Moon, Sun, User } from "lucide-react";

interface AdminNavFooterProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    username: string;
  };
}

export function AdminNavFooter({ user }: AdminNavFooterProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleExit = () => {
    navigate({ to: "/" });
  };

  return (
    <SidebarFooter className="p-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Avatar className="h-8 w-8 rounded-full cursor-pointer"><AvatarImage src={user.avatar} alt={user.name} /><AvatarFallback className="rounded-full bg-primary text-primary-foreground text-xs">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>} />
            <DropdownMenuContent className="w-48" side="top" align="start">
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                {user.email}
              </div>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate({ to: "/u/$username", params: { username: user.username } })}>
                <User size={16} className="mr-2 opacity-80" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={toggleTheme}>
                {resolvedTheme === "dark" ? (
                  <Sun size={16} className="mr-2 opacity-80" />
                ) : (
                  <Moon size={16} className="mr-2 opacity-80" />
                )}
                {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleExit}>
                <LogOut size={16} className="mr-2 opacity-80" />
                Exit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
