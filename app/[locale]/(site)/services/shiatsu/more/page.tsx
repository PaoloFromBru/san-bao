import { getDictionary, type Locale } from "@/dictionaries";

export default async function ShiatsuMorePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.services.shiatsu;

  return (
    <div className="fixed inset-0 bg-white/90 p-8 overflow-y-auto">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-ink mb-4">{t.title}</h1>
        <p className="text-lg text-slate-700">{dict.placeholder}</p>
      </div>
    </div>
  );
}
