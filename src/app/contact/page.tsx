import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Say hi",
  description: "Drop Sarah & Erik a line; we'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-10 pt-28 md:pt-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl text-forest sm:text-5xl">
          Say hi
        </h1>
        <p className="mt-4 text-lg text-ink/80">
          Questions? Comments? Just want to say hi? We&apos;d love to hear from
          you.
        </p>
        <p className="mt-4 text-lg text-ink/80">
          Email and phone are optional but if we don&apos;t have your contact info
          already please let us know how we can respond to you.
        </p>
      </header>

      <ContactForm />
    </div>
  );
}
