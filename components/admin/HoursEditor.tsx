"use client";

import { useState, useTransition } from "react";
import { setWeeklyHours, type DayRule } from "@/app/admin/hours/actions";

type Rule = { weekday: number; startTime: string; endTime: string };

const DAYS = [
  { weekday: 1, label: "Lunedì" },
  { weekday: 2, label: "Martedì" },
  { weekday: 3, label: "Mercoledì" },
  { weekday: 4, label: "Giovedì" },
  { weekday: 5, label: "Venerdì" },
  { weekday: 6, label: "Sabato" },
  { weekday: 0, label: "Domenica" },
];

function buildInitialState(rules: Rule[]): DayRule[] {
  return DAYS.map(({ weekday }) => {
    const existing = rules.find((r) => r.weekday === weekday);
    return {
      weekday,
      open: !!existing,
      startTime: existing?.startTime ?? "09:00",
      endTime: existing?.endTime ?? "17:00",
    };
  });
}

export default function HoursEditor({ rules }: { rules: Rule[] }) {
  const [days, setDays] = useState<DayRule[]>(() => buildInitialState(rules));
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function update(weekday: number, patch: Partial<DayRule>) {
    setDays((prev) => prev.map((d) => (d.weekday === weekday ? { ...d, ...patch } : d)));
  }

  function handleSave() {
    startTransition(async () => {
      await setWeeklyHours(days);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl2 shadow-soft divide-y">
        {days.map((d) => {
          const label = DAYS.find((x) => x.weekday === d.weekday)!.label;
          return (
            <div key={d.weekday} className="flex items-center gap-4 px-4 py-3">
              <label className="flex items-center gap-2 w-36">
                <input
                  type="checkbox"
                  checked={d.open}
                  onChange={(e) => update(d.weekday, { open: e.target.checked })}
                />
                <span className="text-ink">{label}</span>
              </label>
              {d.open ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={d.startTime}
                    onChange={(e) => update(d.weekday, { startTime: e.target.value })}
                    className="rounded-xl2 border px-2 py-1"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="time"
                    value={d.endTime}
                    onChange={(e) => update(d.weekday, { endTime: e.target.value })}
                    className="rounded-xl2 border px-2 py-1"
                  />
                </div>
              ) : (
                <span className="text-sm text-slate-400">Chiuso</span>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={handleSave}
        disabled={pending}
        className="px-5 py-2.5 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition disabled:opacity-50"
      >
        {saved ? "Salvato ✓" : pending ? "Salvo..." : "Salva orario"}
      </button>
    </div>
  );
}
