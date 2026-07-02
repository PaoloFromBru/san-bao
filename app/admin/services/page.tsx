import { db } from "@/db/client";
import { services } from "@/db/schema";
import { getDictionary } from "@/dictionaries";
import ServicesTable from "@/components/admin/ServicesTable";

export default async function AdminServicesPage() {
  const [rows, dict] = await Promise.all([
    db.select().from(services),
    getDictionary("it"),
  ]);

  const rowsWithLabel = rows.map((s) => ({
    ...s,
    label: dict.nav[s.slug as keyof typeof dict.nav] ?? s.slug,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-xl font-semibold text-ink mb-6">Servizi e prezzi</h1>
      <ServicesTable services={rowsWithLabel} />
    </div>
  );
}
