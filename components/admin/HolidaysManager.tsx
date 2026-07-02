"use client";

import { useState, useTransition } from "react";
import { addBlockedDate, deleteBlockedDate } from "@/app/admin/holidays/actions";

type BlockedDate = {
  id: number;
  startDate: string;
  endDate: string;
  reason: string | null;
};

function formatIt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function HolidaysManager({ initialDates }: { initialDates: BlockedDate[] }) {
  const dates = initialDates;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    if (!startDate) return;
    const effectiveEnd = endDate || startDate;
    startTransition(async () => {
      await addBlockedDate(startDate, effectiveEnd, reason);
      setStartDate("");
      setEndDate("");
      setReason("");
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteBlockedDate(id);
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl2 shadow-soft p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex flex-col gap-1 text-sm text-slate-500">
            Dal
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl2 border px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-500">
            Al (facoltativo)
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl2 border px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-500 flex-1 min-w-[10rem]">
            Motivo (facoltativo)
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="es. Vacanze"
              className="rounded-xl2 border px-3 py-2"
            />
          </label>
          <button
            onClick={handleAdd}
            disabled={pending || !startDate}
            className="px-5 py-2.5 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition disabled:opacity-50"
          >
            Aggiungi
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl2 shadow-soft divide-y">
        {dates.length === 0 && (
          <p className="px-4 py-6 text-sm text-slate-400">Nessuna chiusura programmata.</p>
        )}
        {dates.map((d) => (
          <div key={d.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="text-ink">
                {d.startDate === d.endDate
                  ? formatIt(d.startDate)
                  : `${formatIt(d.startDate)} – ${formatIt(d.endDate)}`}
              </span>
              {d.reason && <span className="ml-2 text-sm text-slate-500">({d.reason})</span>}
            </div>
            <button
              onClick={() => handleDelete(d.id)}
              disabled={pending}
              className="text-sm text-slate-400 hover:text-red-600 disabled:opacity-50"
            >
              Elimina
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
