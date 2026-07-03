import { getLocations } from "@/lib/locations";
import LocationsTable from "@/components/admin/LocationsTable";

export default async function AdminLocationsPage() {
  const rows = await getLocations();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold text-ink mb-2">Sedi</h1>
      <p className="text-sm text-slate-500 mb-6">
        I due indirizzi tra cui il cliente può scegliere quando prenota.
      </p>
      <LocationsTable locations={rows} />
    </div>
  );
}
