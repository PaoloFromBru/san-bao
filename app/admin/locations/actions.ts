"use server";

import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateLocationAddress(id: number, address: string) {
  if (!address.trim()) return;
  await db.update(locations).set({ address: address.trim() }).where(eq(locations.id, id));
  revalidatePath("/admin/locations");
}
