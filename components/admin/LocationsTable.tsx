"use client";

import { useState, useTransition } from "react";
import { updateLocationAddress } from "@/app/admin/locations/actions";

type Location = { id: number; address: string };

export default function LocationsTable({ locations }: { locations: Location[] }) {
  return (
    <div className="bg-white rounded-xl2 shadow-soft divide-y">
      {locations.map((loc) => (
        <LocationRow key={loc.id} location={loc} />
      ))}
    </div>
  );
}

function LocationRow({ location }: { location: Location }) {
  const [address, setAddress] = useState(location.address);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await updateLocationAddress(location.id, address);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="flex-1 rounded-xl2 border px-3 py-2"
      />
      <button
        onClick={handleSave}
        disabled={pending}
        className="px-4 py-1.5 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition disabled:opacity-50 text-sm"
      >
        {saved ? "Salvato ✓" : pending ? "Salvo..." : "Salva"}
      </button>
    </div>
  );
}
