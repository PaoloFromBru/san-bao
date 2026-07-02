import { db } from "@/db/client";
import { blockedDates } from "@/db/schema";
import { asc } from "drizzle-orm";
import HolidaysManager from "@/components/admin/HolidaysManager";

export default async function AdminHolidaysPage() {
  const rows = await db.select().from(blockedDates).orderBy(asc(blockedDates.startDate));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold text-ink mb-2">Chiusure e vacanze</h1>
      <p className="text-sm text-slate-500 mb-6">
        Giorni o periodi in cui non è possibile prenotare, oltre all'orario settimanale.
      </p>
      <HolidaysManager initialDates={rows} />
    </div>
  );
}
