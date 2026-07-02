import { db } from "@/db/client";
import { availabilityRules, blockedDates, bookings, services } from "@/db/schema";
import { and, eq, isNull, lte, gte, like } from "drizzle-orm";

function getWeekday(date: string): number {
  // Parsed as UTC midnight purely to read the day-of-week off a calendar
  // date — no instant/timezone semantics involved.
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

// NOTE: "today"/past-slot filtering below uses the server's local clock.
// Fine for now since this runs in one region, but if hosting ever moves to a
// UTC-clocked platform this needs a real Europe/Rome-aware "now".
export async function getAvailableSlots(serviceSlug: string, date: string): Promise<string[]> {
  const [service] = await db.select().from(services).where(eq(services.slug, serviceSlug));
  if (!service || !service.active) return [];

  const blocked = await db
    .select()
    .from(blockedDates)
    .where(and(lte(blockedDates.startDate, date), gte(blockedDates.endDate, date)));
  if (blocked.length > 0) return [];

  const weekday = getWeekday(date);
  const rules = await db
    .select()
    .from(availabilityRules)
    .where(and(eq(availabilityRules.weekday, weekday), isNull(availabilityRules.serviceId)));
  if (rules.length === 0) return [];

  // Bookings block the whole day's schedule regardless of service — one
  // practitioner can't run two sessions at once.
  const dayBookings = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.status, "confirmed"), like(bookings.startsAt, `${date}%`)));

  const slotStep = service.durationMinutes + service.bufferMinutes;
  const now = new Date();
  const isToday = date === now.toLocaleDateString("sv-SE"); // sv-SE => YYYY-MM-DD
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: string[] = [];
  for (const rule of rules) {
    let cursor = timeToMinutes(rule.startTime);
    const ruleEnd = timeToMinutes(rule.endTime);
    while (cursor + service.durationMinutes <= ruleEnd) {
      const slotStart = cursor;
      const slotEnd = cursor + service.durationMinutes;
      const isPast = isToday && slotStart <= nowMinutes;
      const overlapsBooking = dayBookings.some((b) => {
        const bs = timeToMinutes(b.startsAt.slice(11, 16));
        const be = timeToMinutes(b.endsAt.slice(11, 16));
        return slotStart < be && bs < slotEnd;
      });
      if (!isPast && !overlapsBooking) slots.push(minutesToTime(slotStart));
      cursor += slotStep;
    }
  }
  return slots;
}
