"use server";

import { db } from "@/db/client";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateServicePrice(id: number, priceEuros: number) {
  const priceCents = Math.round(priceEuros * 100);
  await db.update(services).set({ priceCents }).where(eq(services.id, id));
  revalidatePath("/admin/services");
}
