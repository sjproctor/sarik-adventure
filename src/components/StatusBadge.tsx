import Image from "next/image";
import type { Location } from "@/lib/content";

const statusLabel: Record<Location["status"], string> = {
  current: "Current Location",
  recent: "Recent Location",
  next: "Coming Up",
  past: "Visited",
};

// Translucent backgrounds get backdrop-blur + full-opacity text so the tiny
// pill text keeps AA contrast regardless of the photo behind it.
const statusStyle: Record<Exclude<Location["status"], "current">, string> = {
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
  // The current location gets a softer, rounded badge marked with the
  // watercolor flower instead of the square pill the other statuses use.
  if (status === "current") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-terracotta/40 bg-cream/90 py-1 pr-3.5 pl-2 text-sm font-semibold text-terracotta backdrop-blur-sm ${className}`}
      >
        {/* object-cover/top crops the long stem so the flower head fills the icon */}
        <Image
          src="/flower.png"
          alt=""
          width={650}
          height={872}
          className="size-5 object-cover object-top"
        />
        {statusLabel.current}
      </span>
    );
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold backdrop-blur-sm ${statusStyle[status]} ${className}`}
    >
      {statusLabel[status]}
    </span>
  );
}
