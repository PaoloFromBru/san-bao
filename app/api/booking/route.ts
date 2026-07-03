import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { services, bookings, locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAvailableSlots } from "@/lib/availability";
import { sendBookingEmails } from "@/lib/email";
import { getDictionary, locales, type Locale } from "@/dictionaries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json();
  const { serviceSlug, date, time, name, email, phone, notes, locale, locationId } = body ?? {};
  const clientLocale: Locale = locales.includes(locale) ? locale : "it";

  if (!serviceSlug || !date || !time || !name || !email || !locationId) {
    return NextResponse.json({ error: "Campi obbligatori mancanti" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email non valida" }, { status: 400 });
  }

  const [service] = await db.select().from(services).where(eq(services.slug, serviceSlug));
  if (!service) {
    return NextResponse.json({ error: "Servizio non trovato" }, { status: 404 });
  }
  const [location] = await db.select().from(locations).where(eq(locations.id, locationId));
  if (!location) {
    return NextResponse.json({ error: "Sede non trovata" }, { status: 404 });
  }

  // Re-check availability server-side right before writing, so two people
  // can't both grab the same slot between page load and submit.
  const slots = await getAvailableSlots(serviceSlug, date, locationId);
  if (!slots.includes(time)) {
    return NextResponse.json({ error: "Questo orario non è più disponibile" }, { status: 409 });
  }

  const [h, m] = time.split(":").map(Number);
  const endMinutes = h * 60 + m + service.durationMinutes;
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

  await db.insert(bookings).values({
    serviceId: service.id,
    locationId: location.id,
    clientName: name,
    clientEmail: email,
    clientPhone: phone || null,
    startsAt: `${date}T${time}`,
    endsAt: `${date}T${endTime}`,
    notes: notes || null,
  });

  const [itDict, clientDict] = await Promise.all([
    getDictionary("it"),
    getDictionary(clientLocale),
  ]);
  const ownerServiceName = itDict.nav[service.slug as keyof typeof itDict.nav] ?? service.slug;
  const clientServiceName = clientDict.nav[service.slug as keyof typeof clientDict.nav] ?? service.slug;
  const [y, mo, d] = date.split("-");

  await sendBookingEmails({
    ownerServiceName,
    clientServiceName,
    dateLabel: `${d}/${mo}/${y}`,
    time,
    locationAddress: location.address,
    clientName: name,
    clientEmail: email,
    clientPhone: phone,
    notes,
    clientStrings: clientDict.booking,
  });

  return NextResponse.json({ ok: true });
}
