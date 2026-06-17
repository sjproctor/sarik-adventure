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
          Questions about our travel adventures? Comments? Just want to say hi?
          We&apos;d love to hear from you.
        </p>
        <p className="mt-4 text-lg text-ink/80">
          The email and phone inputs on the form below are optional but if we
          don&apos;t have your contact info please include a way for us to
          respond to you.
        </p>
        <p className="mt-4 text-sm text-ink/80">
          P.S. If you already have our numbers just send a text.
        </p>
      </header>

      <ContactForm />
    </div>
  );
}
