"use client";

import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import Link from "next/link";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  // Honeypot — hidden from real users; only bots fill it in.
  website: string;
};

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormValues>();

  const onSubmit = handleSubmit(async (data) => {
    // Honeypot: anything in "website" means a bot filled it. Bail silently —
    // no error shown and no submission performed — so bots can't tell.
    if (data.website.trim() !== "") {
      return;
    }

    clearErrors("root");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        },
        { publicKey: PUBLIC_KEY }
      );
      reset();
    } catch {
      setError("root", {
        message:
          "Sorry something went wrong sending your message. Please try again.",
      });
    }
  });

  return (
    <form className="mt-10 space-y-6" onSubmit={onSubmit}>
      {/* Honeypot field. Hidden from users (off-screen, not focusable, ignored
          by autofill and screen readers) but visible to dumb bots that fill in
          every field. aria-hidden + tabIndex -1 keep it away from real people. */}
      <div
        aria-hidden
        className="absolute -left-2499.75 -top-2499.75 h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">
          Website
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" required error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={inputClass}
            aria-required="true"
            aria-invalid={errors.name ? "true" : undefined}
            {...register("name", {
              required: "No anonymous messages allowed!",
            })}
          />
        </Field>

        <Field label="Email" name="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-invalid={errors.email ? "true" : undefined}
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address.",
              },
            })}
          />
        </Field>

        <Field label="Phone" name="phone">
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            {...register("phone")}
          />
        </Field>
      </div>

      <Field
        label="Message"
        name="message"
        required
        error={errors.message?.message}
      >
        <textarea
          id="message"
          rows={6}
          className={`${inputClass} resize-y`}
          aria-required="true"
          aria-invalid={errors.message ? "true" : undefined}
          {...register("message", { required: "Tell us something cool!" })}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-terracotta px-6 py-3 font-display text-lg text-cream shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Ship it!"}
        </button>

        {isSubmitSuccessful && !errors.root && (
          <p role="status" className="font-medium text-forest">
            Thanks! We&apos;ll get back to you ASAP.{" "}
            <Link
              href="/"
              aria-label="Back to home"
              className="text-terracotta underline underline-offset-4"
            >
              Back to main page.
            </Link>
          </p>
        )}
      </div>

      {errors.root && (
        <p role="alert" className="font-medium text-terracotta">
          {errors.root.message}
        </p>
      )}
    </form>
  );
}

const inputClass =
  "mt-2 w-full border border-sand bg-cream px-4 py-3 text-ink shadow-sm outline-none transition-colors focus:border-terracotta";

function Field({
  label,
  name,
  required = false,
  error,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="block font-medium text-forest">
      {label}
      {required && (
        <span className="text-terracotta" aria-hidden>
          {" "}
          *
        </span>
      )}
      {children}
      {error && (
        <span
          role="alert"
          className="mt-1 block text-sm font-normal text-terracotta"
        >
          {error}
        </span>
      )}
    </label>
  );
}
