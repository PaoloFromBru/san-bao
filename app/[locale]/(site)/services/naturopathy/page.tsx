
import { getDictionary, type Locale } from "@/dictionaries";
import SetmoreButton from "@/components/SetmoreButton";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.services.naturopathy.title,
    description: dict.meta.services.naturopathy.description,
    openGraph: { title: dict.meta.services.naturopathy.title, description: dict.meta.services.naturopathy.description },
    twitter: { card: "summary_large_image", title: dict.meta.services.naturopathy.title, description: dict.meta.services.naturopathy.description }
  };
}

export default async function NaturopathyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.services.naturopathy;

  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      <header className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl font-semibold text-ink">{t.title}</h1>
          <p className="mt-4 text-lg text-slate-700">{t.lead}</p>
          <div className="mt-8 flex gap-4">
            <SetmoreButton alt={t.cta} />
            <Link
              href={`/${locale}/services/naturopathy/more`}
              className="inline-block px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition"
            >
              {dict.more}
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-2xl overflow-hidden border shadow-soft relative w-full aspect-[4/3]">
            <Image src="/images/naturopathy.webp" alt="" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div className="pointer-events-none absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 z-10 hidden md:block">
            <Image
              src="/images/Logo-colours_.webp"
              alt="San Bao"
              width={256}
              height={256}
              className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full p-1 ring-2 ring-gold shadow-soft"
            />
          </div>
        </div>
      </header>
    </article>
  );
}
