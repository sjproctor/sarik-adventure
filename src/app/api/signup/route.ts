import { NextResponse } from "next/server";

// Server-only Airtable credentials (no NEXT_PUBLIC_ prefix) — the token must
// never reach the browser, which is why the form posts here instead of
// calling Airtable directly.
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    console.error("Signup: missing Airtable environment variables.");
    return NextResponse.json(
      { error: "Signup is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email } = (body ?? {}) as { name?: unknown; email?: unknown };

  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_TABLE_NAME
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Field names must match the Airtable columns exactly (they're
        // case-sensitive). "Created" is Airtable's own created-time field,
        // so it isn't sent.
        records: [
          { fields: { Name: name.trim(), Email: email.trim() } },
        ],
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Signup: Airtable request failed.",
      response.status,
      await response.text()
    );
    return NextResponse.json(
      { error: "Could not save your signup." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
