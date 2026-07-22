"use client";

import { createContext, useContext, useRef, type RefObject } from "react";
import { EmailSignupForm } from "@/components/EmailSignupForm";

const DialogRefContext =
  createContext<RefObject<HTMLDialogElement | null> | null>(null);

/**
 * Renders its children followed by the signup <dialog> as a sibling. The
 * dialog can't live inside a <p> (invalid nesting breaks hydration), so the
 * inline trigger and the dialog are split: wrap the surrounding markup with
 * this component and put <EmailSignupTrigger> inside the sentence.
 */
export function EmailSignupModal({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <DialogRefContext.Provider value={dialogRef}>
      {children}

      <dialog
        ref={dialogRef}
        // Backdrop clicks land on the <dialog> itself; clicks inside the
        // panel land on its children.
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current.close();
          }
        }}
        className="m-auto w-[calc(100%-2.5rem)] max-w-xl border border-sand bg-cream p-0 text-ink shadow-xl backdrop:bg-ink/50"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-3xl text-forest">
              Want to check in on our adventures?
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              className="cursor-pointer p-1 text-2xl leading-none text-ink/60 transition-colors hover:text-ink"
            >
              &times;
            </button>
          </div>

          <p className="mt-4 text-lg text-ink/80">
            Leave your name and email and we&apos;ll give you a ping when we post new content.
          </p>
          <p className="mt-4 text-lg text-ink/80">
            We won&apos;t spam you. I&apos;m thinking once a month max and honestly I&apos;ll probably forget some of the time.
          </p>

          <EmailSignupForm />
        </div>
      </dialog>
    </DialogRefContext.Provider>
  );
}

/** Link-styled inline button that opens the nearest EmailSignupModal. */
export function EmailSignupTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const dialogRef = useContext(DialogRefContext);

  return (
    <button
      type="button"
      onClick={() => dialogRef?.current?.showModal()}
      className="cursor-pointer text-terracotta underline underline-offset-4"
    >
      {children}
    </button>
  );
}
