"use client";

import { useLocation, useNavigate } from "@tanstack/react-router";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileCode,
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { AdminNavFooter } from "./admin-nav-footer";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string | null;
    email: string;
    image?: string | null;
    username?: string | null;
  } | null;
}

const adminNavItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    to: "/admin",
    icon: LayoutDashboard,
  },
  {
    id: "review",
    title: "Review Queue",
    to: "/admin/review",
    icon: CheckCircle,
  },
  {
    id: "designs",
    title: "All Designs",
    to: "/admin/designs",
    icon: FileCode,
  },
  {
    id: "users",
    title: "Users",
    to: "/admin/users",
    icon: Users,
  },
  {
    id: "analytics",
    title: "Analytics",
    to: "/admin/analytics",
    icon: BarChart3,
  },
  {
    id: "settings",
    title: "Settings",
    to: "/admin/settings",
    icon: Settings,
  },
];

function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <SidebarGroup>
      <SidebarMenu>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || 
            (item.to !== "/admin" && location.pathname.startsWith(item.to));

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton 
                isActive={isActive}
                tooltip={item.title}
                onClick={() => navigate({ to: item.to })}
                className="cursor-pointer"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
  const sidebarUser = {
    name: user?.name || "Admin",
    email: user?.email || "",
    avatar: user?.image || "/avatar-01.png",
    username: user?.username || user?.name || "",
  };

  return (
    <Sidebar {...props}>
      {/* Admin Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Shield className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Admin Panel</span>
          <span className="text-xs text-muted-foreground">TokenUI</span>
        </div>
      </div>

      <SidebarContent className="pt-2">
        <AdminNav />
      </SidebarContent>

      <div className="border-t p-4">
        <div className="flex items-center gap-2 rounded-md bg-amber-50 dark:bg-amber-950/20 p-2">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-xs text-amber-800 dark:text-amber-200">
            Admin Access
          </span>
        </div>
      </div>

      <AdminNavFooter user={sidebarUser} />
    </Sidebar>
  );
}
