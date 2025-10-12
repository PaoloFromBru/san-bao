
import { getDictionary, type Locale } from "@/dictionaries";
import SetmoreButton from "@/components/SetmoreButton";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.services.infant.title,
    description: dict.meta.services.infant.description,
    openGraph: { title: dict.meta.services.infant.title, description: dict.meta.services.infant.description },
    twitter: { card: "summary_large_image", title: dict.meta.services.infant.title, description: dict.meta.services.infant.description }
  };
}

export default async function InfantPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.services.infant;

  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      <header className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl font-semibold text-ink">{t.title}</h1>
          <p className="mt-4 text-lg text-slate-700">{t.lead}</p>
          <div className="mt-8 flex gap-4">
            <SetmoreButton alt={t.cta} />
            <Link
              href={`/${locale}/services/infant-massage/more`}
              className="inline-block px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition"
            >
              {dict.more}
            </Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border shadow-soft relative aspect-square">
          <Image src="/images/MassageBebe.webp" alt="" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </header>
    </article>
  );
}
