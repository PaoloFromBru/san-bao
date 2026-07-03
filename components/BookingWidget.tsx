"use client";

import { useState } from "react";
import { format } from "@/lib/format";

type BookingStrings = {
  dateLabel: string;
  locationLabel: string;
  timeLabel: string;
  loadingSlots: string;
  noSlots: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  notesPlaceholder: string;
  confirmButton: string;
  submitting: string;
  successMessage: string;
  genericError: string;
  slotTakenError: string;
};

type Location = { id: number; address: string };

type Props = {
  serviceSlug: string;
  ctaLabel: string;
  locale: string;
  strings: BookingStrings;
  locations: Location[];
};

type Status = "idle" | "loading" | "success" | "error";

function todayIso() {
  return new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD
}

export default function BookingWidget({
  serviceSlug,
  ctaLabel,
  locale,
  strings: t,
  locations,
}: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayIso());
  const [locationId, setLocationId] = useState<number | null>(locations[0]?.id ?? null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function loadSlots(nextDate: string, nextLocationId: number | null) {
    setDate(nextDate);
    setSelectedTime(null);
    if (nextLocationId == null) return;
    setLoadingSlots(true);
    const res = await fetch(
      `/api/booking/availability?service=${serviceSlug}&date=${nextDate}&location=${nextLocationId}`
    );
    const data = await res.json();
    setSlots(data.slots ?? []);
    setLoadingSlots(false);
  }

  function handleOpen() {
    setOpen(true);
    if (slots.length === 0) loadSlots(date, locationId);
  }

  function handleLocationChange(id: number) {
    setLocationId(id);
    loadSlots(date, id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTime || locationId == null) return;
    setStatus("loading");
    setError("");
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceSlug,
        date,
        time: selectedTime,
        locationId,
        name,
        email,
        phone,
        notes,
        locale,
      }),
    });
    if (!res.ok) {
      setStatus("error");
      setError(res.status === 409 ? t.slotTakenError : t.genericError);
      if (res.status === 409) loadSlots(date, locationId); // slot taken in the meantime, refresh
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <p className="inline-block px-5 py-3 rounded-xl2 border border-green-600 text-green-700">
        {format(t.successMessage, { date, time: selectedTime ?? "" })}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="inline-block px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition"
      >
        {ctaLabel}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border shadow-soft p-5 max-w-md space-y-4">
      <div>
        <label className="block text-sm text-slate-500 mb-1">{t.locationLabel}</label>
        <div className="flex flex-wrap gap-2">
          {locations.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => handleLocationChange(loc.id)}
              className={`px-3 py-1.5 rounded-xl2 border text-sm text-left transition ${
                locationId === loc.id
                  ? "bg-gold text-white border-gold"
                  : "border-gold text-gold hover:bg-gold hover:text-white"
              }`}
            >
              {loc.address}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-500 mb-1">{t.dateLabel}</label>
        <input
          type="date"
          value={date}
          min={todayIso()}
          onChange={(e) => loadSlots(e.target.value, locationId)}
          className="rounded-xl2 border px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-500 mb-1">{t.timeLabel}</label>
        {loadingSlots && <p className="text-sm text-slate-400">{t.loadingSlots}</p>}
        {!loadingSlots && slots.length === 0 && (
          <p className="text-sm text-slate-400">{t.noSlots}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {slots.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedTime(s)}
              className={`px-3 py-1.5 rounded-xl2 border text-sm transition ${
                selectedTime === s
                  ? "bg-gold text-white border-gold"
                  : "border-gold text-gold hover:bg-gold hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {selectedTime && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t">
          <input
            type="text"
            required
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl2 border px-3 py-2 w-full"
          />
          <input
            type="email"
            required
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl2 border px-3 py-2 w-full"
          />
          <input
            type="tel"
            placeholder={t.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-xl2 border px-3 py-2 w-full"
          />
          <textarea
            placeholder={t.notesPlaceholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded-xl2 border px-3 py-2 w-full"
            rows={2}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition disabled:opacity-50"
          >
            {status === "loading" ? t.submitting : t.confirmButton}
          </button>
        </form>
      )}
    </div>
  );
}
