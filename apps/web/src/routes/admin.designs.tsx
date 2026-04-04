import { createFileRoute } from "@tanstack/react-router";
import { AdminDesignsPage } from "@/features/admin/pages/designs";

export const Route = createFileRoute("/admin/designs")({
  component: AdminDesignsPage,
});
