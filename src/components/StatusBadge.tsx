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
  recent: "bg-cream/90 text-terracotta",
  next: "bg-cream/90 text-terracotta",
  past: "bg-cream/90 text-terracotta",
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
