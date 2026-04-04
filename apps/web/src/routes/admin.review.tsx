import { createFileRoute } from "@tanstack/react-router";
import { AdminReviewPage } from "@/features/admin/pages/review";

export const Route = createFileRoute("/admin/review")({
  component: AdminReviewPage,
});
