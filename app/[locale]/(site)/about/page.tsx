import { getDictionary, type Locale } from "@/dictionaries";
import Link from "next/link";
import Image from "next/image";

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict.about;
  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      <header className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl font-semibold text-ink">{dict.nav.about}</h1>
          <div className="mt-4 text-lg text-slate-700 whitespace-pre-line">{t.content}</div>
          <div className="mt-8">
            <Link
              href={`/${locale}/about/more`}
              className="inline-block px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition"
            >
              {dict.more}
            </Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border shadow-soft relative w-full aspect-[4/3]">
          <Image src="/images/contact.webp" alt="" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          <div className="pointer-events-none absolute right-4 bottom-4 md:right-6 md:bottom-6 z-10 hidden md:block">
            <Image src="/logo-gold.svg" alt="" width={96} height={96} className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-white/80 p-2 ring-1 ring-gold shadow-soft backdrop-blur-sm" />
          </div>
        </div>
      </header>
    </article>
  );
}
