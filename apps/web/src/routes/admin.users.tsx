import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "@/features/admin/pages/users";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});
