"use client";

import { useState, useTransition } from "react";
import { updateServicePrice } from "@/app/admin/services/actions";

type Service = {
  id: number;
  slug: string;
  label: string;
  durationMinutes: number;
  priceCents: number | null;
};

export default function ServicesTable({ services }: { services: Service[] }) {
  return (
    <table className="w-full border-collapse bg-white rounded-xl2 overflow-hidden shadow-soft">
      <thead>
        <tr className="border-b bg-slate-50 text-left text-sm text-slate-500">
          <th className="px-4 py-3">Servizio</th>
          <th className="px-4 py-3">Durata</th>
          <th className="px-4 py-3">Prezzo (€)</th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {services.map((s) => (
          <ServiceRow key={s.id} service={s} />
        ))}
      </tbody>
    </table>
  );
}

function ServiceRow({ service }: { service: Service }) {
  const [price, setPrice] = useState(
    service.priceCents != null ? (service.priceCents / 100).toString() : ""
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const value = parseFloat(price.replace(",", "."));
    if (Number.isNaN(value) || value < 0) return;
    startTransition(async () => {
      await updateServicePrice(service.id, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3 text-ink">{service.label}</td>
      <td className="px-4 py-3 text-slate-500">{service.durationMinutes} min</td>
      <td className="px-4 py-3">
        <input
          type="text"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="es. 65"
          className="w-24 rounded-xl2 border px-3 py-1.5"
        />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={handleSave}
          disabled={pending}
          className="px-4 py-1.5 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition disabled:opacity-50 text-sm"
        >
          {saved ? "Salvato ✓" : pending ? "Salvo..." : "Salva"}
        </button>
      </td>
    </tr>
  );
}
