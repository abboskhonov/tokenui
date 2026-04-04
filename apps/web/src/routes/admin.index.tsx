import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/features/admin/pages/dashboard";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});
