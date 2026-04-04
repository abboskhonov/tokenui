import { createFileRoute } from "@tanstack/react-router";
import { AdminSettingsPage } from "@/features/admin/pages/settings";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});
