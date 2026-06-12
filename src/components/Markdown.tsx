// Renders the HTML produced by Velite's s.markdown() for short frontmatter
// fields (summary, overview). The compiled output is wrapped in a block <p>;
// when it's a single paragraph we unwrap it so the caller's own styled element
// (e.g. <p className="...">) keeps its classes and just receives the inline
// markup (links, <br>). Content is authored in-repo (trusted), so injecting it
// as HTML is safe.
function unwrapParagraph(html: string): string {
  const trimmed = html.trim();
  const match = /^<p>([\s\S]*)<\/p>$/.exec(trimmed);
  // Only unwrap a lone paragraph — bail if there's more than one block.
  if (match && !match[1].includes("<p>")) return match[1];
  return trimmed;
}

export function Markdown({
  html,
  as: Tag = "p",
  className,
  linkClassName,
}: {
  html: string;
  as?: "p" | "div" | "span";
  className?: string;
  // Applied to every <a> in the compiled markup. Content is trusted (authored
  // in-repo), so a simple tag rewrite is safe.
  linkClassName?: string;
}) {
  let inner = unwrapParagraph(html);
  if (linkClassName) {
    inner = inner.replace(/<a\b/g, `<a class="${linkClassName}"`);
  }
  return (
    <Tag className={className} dangerouslySetInnerHTML={{ __html: inner }} />
  );
}

/** Plain-text version of compiled markdown HTML — for <meta> descriptions. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
