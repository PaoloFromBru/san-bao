"use server";

import { db } from "@/db/client";
import { blockedDates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addBlockedDate(startDate: string, endDate: string, reason: string) {
  if (!startDate || !endDate || endDate < startDate) return;
  await db.insert(blockedDates).values({
    startDate,
    endDate,
    reason: reason || null,
  });
  revalidatePath("/admin/holidays");
}

export async function deleteBlockedDate(id: number) {
  await db.delete(blockedDates).where(eq(blockedDates.id, id));
  revalidatePath("/admin/holidays");
}
