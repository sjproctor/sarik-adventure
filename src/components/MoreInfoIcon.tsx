/**
 * A circle enclosing a right-pointing arrow, used to signal that a card is
 * clickable for more information. Carries the shared terracotta color and the
 * nudge-right on hover/focus of the surrounding `group` link; callers pass
 * only sizing/spacing utilities via `className` (e.g. `mt-1 size-6`).
 *
 * Always rendered inside a link that already has a text name, so it's hidden
 * from assistive tech — a label here would make screen readers announce the
 * card title twice.
 */
export function MoreInfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 text-terracotta transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 ${className}`}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12h7" />
      <path d="M12.5 9l3 3-3 3" />
    </svg>
  );
}
