import { NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, message } = body ?? {};

  if (!name || !email || !message) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  try {
    await sendContactMessage({ name, email, message });
  } catch {
    return NextResponse.json({ error: "send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
