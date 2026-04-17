import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { AdminLayout } from "@/features/admin/components/admin-layout";
import { useUser } from "@/lib/user-context";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const { user } = useUser();
  
  // Client-side admin check - instant, no server round-trip
  const isAdmin = user?.role === "admin";
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
