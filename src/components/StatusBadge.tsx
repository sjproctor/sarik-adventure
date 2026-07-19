import type { Location } from "@/lib/content";

const statusLabel: Record<Location["status"], string> = {
  current: "Current Location",
  recent: "Recent Location",
  next: "Coming Up",
  past: "Visited",
};

// Translucent backgrounds get backdrop-blur + full-opacity text so the tiny
// pill text keeps AA contrast regardless of the photo behind it.
const statusStyle: Record<Location["status"], string> = {
  current: "bg-cream text-terracotta/90",
  recent: "bg-cream text-terracotta/90",
  next: "bg-cream text-terracotta/90",
  past: "bg-cream/90 text-forest",
};

/**
 * The pill naming a location's status ("Current Location", "Visited", …).
 * Pass positioning via `className` (e.g. `absolute left-3 top-3`); the pill
 * styles itself.
 */
export function StatusBadge({
  status,
  className = "",
}: {
  status: Location["status"];
  className?: string;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${statusStyle[status]} ${className}`}
    >
      {statusLabel[status]}
    </span>
  );
}
