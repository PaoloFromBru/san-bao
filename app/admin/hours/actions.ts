"use server";

import { db } from "@/db/client";
import { availabilityRules } from "@/db/schema";
import { isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type DayRule = {
  weekday: number; // 0 = Sunday ... 6 = Saturday
  open: boolean;
  startTime: string;
  endTime: string;
};

// Global hours only (serviceId = null), applies to all services.
// Simplest correct approach for a single weekly schedule: wipe and reinsert.
export async function setWeeklyHours(days: DayRule[]) {
  await db.delete(availabilityRules).where(isNull(availabilityRules.serviceId));

  const openDays = days.filter((d) => d.open);
  if (openDays.length > 0) {
    await db.insert(availabilityRules).values(
      openDays.map((d) => ({
        serviceId: null,
        weekday: d.weekday,
        startTime: d.startTime,
        endTime: d.endTime,
      }))
    );
  }

  revalidatePath("/admin/hours");
}
