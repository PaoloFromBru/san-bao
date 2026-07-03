"use client";

import { useEffect, useState } from "react";

type DayStatus = "available" | "full" | "closed" | "past";

type Props = {
  serviceSlug: string;
  locationId: number | null;
  selectedDate: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
  locale: string;
};

function todayIso() {
  return new Date().toLocaleDateString("sv-SE");
}

// Monday-first weekday index (0 = Monday ... 6 = Sunday)
function mondayFirstDay(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

export default function Calendar({ serviceSlug, locationId, selectedDate, onSelect, locale }: Props) {
  const today = todayIso();
  const [selected] = selectedDate ? [new Date(`${selectedDate}T00:00:00Z`)] : [new Date(`${today}T00:00:00Z`)];
  const [viewYear, setViewYear] = useState(selected.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getUTCMonth() + 1); // 1-12
  const [status, setStatus] = useState<Record<string, DayStatus>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (locationId == null) return;
    setLoading(true);
    fetch(
      `/api/booking/month-availability?service=${serviceSlug}&location=${locationId}&year=${viewYear}&month=${viewMonth}`
    )
      .then((r) => r.json())
      .then((data) => setStatus(data.status ?? {}))
      .finally(() => setLoading(false));
  }, [serviceSlug, locationId, viewYear, viewMonth]);

  const monthStart = new Date(Date.UTC(viewYear, viewMonth - 1, 1));
  const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();
  const leadingBlanks = mondayFirstDay(monthStart);

  const monthLabel = monthStart.toLocaleDateString(locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(2023, 0, 2 + i)); // a known Mon..Sun week
    return d.toLocaleDateString(locale, { weekday: "short", timeZone: "UTC" });
  });

  const todayDate = new Date(`${today}T00:00:00Z`);
  const canGoPrev =
    viewYear > todayDate.getUTCFullYear() ||
    (viewYear === todayDate.getUTCFullYear() && viewMonth > todayDate.getUTCMonth() + 1);

  function changeMonth(delta: number) {
    let y = viewYear;
    let m = viewMonth + delta;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
  }

  const cellClasses: Record<DayStatus, string> = {
    available: "border-gold text-gold hover:bg-gold hover:text-white cursor-pointer",
    full: "border-slate-100 text-slate-300 cursor-not-allowed",
    closed: "border-slate-100 text-slate-300 cursor-not-allowed",
    past: "border-transparent text-slate-200 cursor-not-allowed",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={!canGoPrev}
          className="px-2 py-1 rounded-xl2 border text-slate-500 disabled:opacity-30 hover:bg-slate-50"
          aria-label="previous month"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-ink capitalize">{monthLabel}</span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="px-2 py-1 rounded-xl2 border text-slate-500 hover:bg-slate-50"
          aria-label="next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-1">
        {weekdayLabels.map((w) => (
          <div key={w} className="capitalize">
            {w}
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-7 gap-1 ${loading ? "opacity-50" : ""}`}>
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dateStr = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayStatus = status[dateStr] ?? "past";
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={day}
              type="button"
              disabled={dayStatus !== "available"}
              onClick={() => onSelect(dateStr)}
              className={`aspect-square rounded-xl2 border text-sm transition ${
                isSelected ? "bg-gold text-white border-gold" : cellClasses[dayStatus]
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
