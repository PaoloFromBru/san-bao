import { db } from "@/db/client";
import { locations } from "@/db/schema";

export async function getLocations() {
  return db.select().from(locations);
}
