import { db } from "@/db/client";
import { availabilityRules, blockedDates, bookings, services } from "@/db/schema";
import { and, eq, isNull, lte, gte, like } from "drizzle-orm";

// Time needed to get from one practice location to the other.
const TRAVEL_BUFFER_MINUTES = 40;
// Minimum gap she wants between any two appointments, same location or not
// (rest/prep time). Travel time already covers this when locations differ,
// since 40 > 30, so the two never stack.
const APPOINTMENT_BUFFER_MINUTES = 30;

function requiredGapMinutes(neighborLocationId: number | null, candidateLocationId: number) {
  return neighborLocationId !== candidateLocationId
    ? TRAVEL_BUFFER_MINUTES
    : APPOINTMENT_BUFFER_MINUTES;
}

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
export async function getAvailableSlots(
  serviceSlug: string,
  date: string,
  locationId: number
): Promise<string[]> {
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
  // practitioner can't run two sessions at once, at either location.
  const dayBookings = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.status, "confirmed"), like(bookings.startsAt, `${date}%`)))
    .then((rows) =>
      rows.map((b) => ({
        start: timeToMinutes(b.startsAt.slice(11, 16)),
        end: timeToMinutes(b.endsAt.slice(11, 16)),
        locationId: b.locationId,
      }))
    );

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

      const overlapsBooking = dayBookings.some(
        (b) => slotStart < b.end && b.start < slotEnd
      );

      // Nearest booking ending at/before this slot, and nearest booking
      // starting at/after it — the only two that can constrain a same-day,
      // non-overlapping slot via a buffer requirement.
      const prev = dayBookings
        .filter((b) => b.end <= slotStart)
        .sort((a, b) => b.end - a.end)[0];
      const next = dayBookings
        .filter((b) => b.start >= slotEnd)
        .sort((a, b) => a.start - b.start)[0];

      const violatesBufferBefore =
        prev && slotStart < prev.end + requiredGapMinutes(prev.locationId, locationId);
      const violatesBufferAfter =
        next && slotEnd + requiredGapMinutes(next.locationId, locationId) > next.start;

      if (!isPast && !overlapsBooking && !violatesBufferBefore && !violatesBufferAfter) {
        slots.push(minutesToTime(slotStart));
      }
      cursor += slotStep;
    }
  }
  return slots;
}
