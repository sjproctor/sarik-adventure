/**
 * A circle enclosing a right-pointing arrow, used to signal that a card is
 * clickable for more information. Inherits color via `currentColor`, so set the
 * color with a text utility (e.g. `text-terracotta`) on the icon or a parent.
 */
export function MoreInfoIcon({
  className,
  title = "More information",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12h7" />
      <path d="M12.5 9l3 3-3 3" />
    </svg>
  );
}
