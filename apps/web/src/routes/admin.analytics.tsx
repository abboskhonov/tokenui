import { createFileRoute } from "@tanstack/react-router";
import { AdminAnalyticsPage } from "@/features/admin/pages/analytics";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalyticsPage,
});
