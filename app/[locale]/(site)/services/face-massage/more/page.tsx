import { getDictionary, type Locale } from "@/dictionaries";
import Link from "next/link";

export default async function FaceMassageMorePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="fixed inset-0 z-40 bg-white/90 p-8 overflow-y-auto">
      <Link
        href={`/${locale}/services/face-massage`}
        className="absolute top-8 right-8 inline-block px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition"
      >
        {dict.close}
      </Link>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-ink mb-4">{dict.nav.faceMassage}</h1>
        <p className="text-lg text-slate-700">{dict.placeholder}</p>
      </div>
    </div>
  );
}
