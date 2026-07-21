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
  current: "bg-terracotta/90 text-cream",
  recent: "bg-cream text-terracotta/90",
  next: "bg-cream text-terracotta/90",
  past: "bg-cream/90 text-forest",
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: Location["status"];
  className?: string;
}) {
  return (
    <span
      className={`px-3 py-1 text-sm font-semibold backdrop-blur-sm ${statusStyle[status]} ${className}`}
    >
      {statusLabel[status]}
    </span>
  );
}
