import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(), // matches dictionaries/*.ts service keys: shiatsu, qiNeiZang, naturopathy, infant, faceMassage
  durationMinutes: integer("duration_minutes").notNull(),
  bufferMinutes: integer("buffer_minutes").notNull().default(0),
  priceCents: integer("price_cents"), // null = not yet set by the owner (e.g. package/quote-based services)
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

// Recurring weekly opening hours, optionally scoped to one service (null = applies to all services)
export const availabilityRules = sqliteTable("availability_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").references(() => services.id),
  weekday: integer("weekday").notNull(), // 0 = Sunday ... 6 = Saturday
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "17:00"
});

// One-off closures: single days or ranges (holidays, vacations, sick days)
export const blockedDates = sqliteTable("blocked_dates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startDate: text("start_date").notNull(), // "2026-08-01" (ISO date, inclusive)
  endDate: text("end_date").notNull(), // inclusive
  reason: text("reason"),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  startsAt: text("starts_at").notNull(), // "YYYY-MM-DDTHH:MM", local wall-clock time (single-location practice, no timezone conversion)
  endsAt: text("ends_at").notNull(), // same format as startsAt
  status: text("status", { enum: ["confirmed", "cancelled"] })
    .notNull()
    .default("confirmed"),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});
