"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "../components/admin-sidebar";
import { useUserProfile } from "@/lib/queries/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: user } = useUserProfile();

  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset className="bg-background">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
