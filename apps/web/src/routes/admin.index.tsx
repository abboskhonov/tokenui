import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/features/admin/pages/dashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: AdminDashboardPage,
});
