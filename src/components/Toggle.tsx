"use client";
import { useState } from "react";

export function Toggle() {
  const [view, setView] = useState<"albums" | "gallery">("albums");

  return (
    <div
      role="group"
      aria-label="Choose how to view photos"
      className="inline-flex border border-sand bg-cream p-1"
    >
      {(["albums", "gallery"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setView(option)}
          aria-pressed={view === option}
          className={`px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
            view === option
              ? "bg-terracotta text-cream"
              : "text-forest hover:text-terracotta"
          }`}
        >
          {option === "albums" ? "View By Album" : "View Gallery"}
        </button>
      ))}
    </div>
  );
}
