import { getDictionary, type Locale } from "@/dictionaries";

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-ink">{dict.nav.about}</h1>
      <p className="mt-4 text-lg text-slate-700">{dict.placeholder}</p>
    </div>
  );
}

