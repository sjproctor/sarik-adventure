"use client";

import { useEffect, useState } from "react";

/**
 * Mounts its iframe only on desktop-sized viewports. Hiding the map with CSS
 * alone isn't enough: a display:none iframe is still fetched (loading="lazy"
 * can't compute its position), so phones would download the whole Google Maps
 * embed for a map they never see.
 */
export function MapEmbed({ src, title }: { src: string; title: string }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Matches the `md:` breakpoint the parent uses to show the map area.
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!isDesktop) return null;

  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-full w-full border-0"
    />
  );
}
