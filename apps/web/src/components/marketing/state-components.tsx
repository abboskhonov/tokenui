"use client";

import { memo } from "react";

/**
 * LoadingState - Displays a loading spinner
 */
export const LoadingState = memo(function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  );
});

/**
 * ErrorState - Displays an error message
 */
interface ErrorStateProps {
  message?: string;
}

export const ErrorState = memo(function ErrorState({ 
  message = "Failed to load skills" 
}: ErrorStateProps) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
});

/**
 * EmptyState - Displays when no data is available
 */
interface EmptyStateProps {
  message?: string;
}

export const EmptyState = memo(function EmptyState({ 
  message = "No skills published yet" 
}: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
});
