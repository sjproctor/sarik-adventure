"use client";

import { useForm } from "react-hook-form";

type EmailSignupValues = {
  name: string;
  email: string;
  // Honeypot — hidden from real users; only bots fill it in.
  website: string;
};

export function EmailSignupForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<EmailSignupValues>();

  const onSubmit = handleSubmit(async (data) => {
    // Honeypot: anything in "website" means a bot filled it. Bail silently.
    if (data.website.trim() !== "") {
      return;
    }

    clearErrors("root");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email }),
      });
      if (!response.ok) {
        throw new Error("Signup request failed");
      }
      reset();
    } catch {
      setError("root", {
        message: "Sorry something went wrong. Please try again.",
      });
    }
  });

  return (
    <form className="mt-10 space-y-6" onSubmit={onSubmit}>
      {/* Honeypot field, same pattern as ContactForm. */}
      <div
        aria-hidden
        className="absolute -left-2499.75 -top-2499.75 h-0 w-0 overflow-hidden"
      >
        <label htmlFor="signup-website">
          Website
          <input
            id="signup-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Name"
          name="signup-name"
          required
          error={errors.name?.message}
        >
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            className={inputClass}
            aria-required="true"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "signup-name-error" : undefined}
            {...register("name", {
              required: "Please tell us your name.",
            })}
          />
        </Field>

        <Field
          label="Email"
          name="signup-email"
          required
          error={errors.email?.message}
        >
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-required="true"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "signup-email-error" : undefined}
            {...register("email", {
              required: "We need your email to keep in touch!",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address.",
              },
            })}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-terracotta px-6 py-3 font-display text-lg text-cream shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>

        {isSubmitSuccessful && !errors.root && (
          <p role="status" className="font-medium text-forest">
            Thanks! You&apos;re on the list.
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
    <div className="font-medium text-forest">
      <label htmlFor={name} className="block">
        {label}
        {required && (
          <span className="text-terracotta" aria-hidden>
            {" "}
            *
          </span>
        )}
        {children}
      </label>
      {error && (
        <span
          id={`${name}-error`}
          role="alert"
          className="mt-1 block text-sm font-normal text-terracotta"
        >
          {error}
        </span>
      )}
    </div>
  );
}
