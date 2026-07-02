import { db } from "./client";
import { services } from "./schema";

// Durations/prices taken from dictionaries/it.ts service copy.
// infant has no published total price (sold as a 5-session package) —
// seeded here at a placeholder 50€/hour rate; adjust via the admin panel.
const seedData = [
  { slug: "shiatsu", durationMinutes: 60, priceCents: 6500 },
  { slug: "qiNeiZang", durationMinutes: 60, priceCents: 6500 },
  { slug: "naturopathy", durationMinutes: 90, priceCents: 8000 },
  { slug: "faceMassage", durationMinutes: 50, priceCents: 6000 },
  { slug: "infant", durationMinutes: 45, priceCents: 3750 },
];

async function main() {
  for (const service of seedData) {
    await db.insert(services).values(service).onConflictDoNothing();
  }
  console.log(`Seeded ${seedData.length} services.`);
}

main();
