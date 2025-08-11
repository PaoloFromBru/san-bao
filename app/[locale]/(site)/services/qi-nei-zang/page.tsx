import { getDictionary, type Locale } from "@/dictionaries";
import SetmoreButton from "@/components/SetmoreButton";
import Link from "next/link";

export default async function QiNeiZangPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const cta = dict.services.naturopathy.cta;
  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      <header className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl font-semibold text-ink">{dict.nav.qiNeiZang}</h1>
          <p className="mt-4 text-lg text-slate-700">{dict.placeholder}</p>
          <div className="mt-8 flex gap-4">
            <SetmoreButton alt={cta} />
            <Link
              href={`/${locale}/services/qi-nei-zang/more`}
              className="inline-block px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition"
            >
              {dict.more}
            </Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border shadow-soft">
          <img src="/images/QiNeiZang.png" alt="" className="w-full h-full object-cover" />
        </div>
      </header>
    </article>
  );
}

