import { db } from "@/db/client";
import { availabilityRules } from "@/db/schema";
import { isNull } from "drizzle-orm";
import HoursEditor from "@/components/admin/HoursEditor";

export default async function AdminHoursPage() {
  const rules = await db
    .select()
    .from(availabilityRules)
    .where(isNull(availabilityRules.serviceId));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold text-ink mb-2">Orario settimanale</h1>
      <p className="text-sm text-slate-500 mb-6">
        Valido per tutti i servizi. Disattiva i giorni di chiusura abituale.
      </p>
      <HoursEditor rules={rules} />
    </div>
  );
}
