import { getDictionary, type Locale } from "@/dictionaries";
import SetmoreButton from "@/components/SetmoreButton";
import Link from "next/link";

export default async function FaceMassagePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.services.faceMassage;
  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      <header className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl font-semibold text-ink">{t.title}</h1>
          <p className="mt-4 text-lg text-slate-700">{t.lead}</p>
          <div className="mt-8 flex gap-4">
            <SetmoreButton alt={t.cta} />
            <Link
              href={`/${locale}/services/face-massage/more`}
              className="inline-block px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition"
            >
              {dict.more}
            </Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border shadow-soft">
          <img src="/images/FaceMassage.png" alt="" className="w-full h-full object-cover" />
        </div>
      </header>
    </article>
  );
}

