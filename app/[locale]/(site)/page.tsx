
import Link from "next/link";
import { getDictionary, type Locale } from "@/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    openGraph: { title: dict.meta.home.title, description: dict.meta.home.description },
    twitter: { card: "summary_large_image", title: dict.meta.home.title, description: dict.meta.home.description }
  };
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <img src="/hero-texture.svg" alt="" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <img src="/logo-gold.svg" alt="San Bao" className="mx-auto h-28 w-auto mb-6" />
          <h1 className="text-3xl md:text-5xl font-semibold text-ink">{dict.home.heroHeading}</h1>
          <p className="mt-4 text-lg text-slate-700">{dict.home.heroText}</p>
          <div className="mt-8">
            <Link href={`/${locale}/contact`} className="inline-block px-6 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition shadow-soft">
              {dict.home.heroCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold text-ink mb-6">{dict.home.cardsTitle}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <ServiceCard locale={locale} title={dict.home.cardShiatsu} href="/services/shiatsu" img="/images/shiatsu.webp" />
          <ServiceCard locale={locale} title={dict.home.cardNaturopathy} href="/services/naturopathy" img="/images/naturopathy.webp" />
          <ServiceCard locale={locale} title={dict.home.cardInfant} href="/services/infant-massage" img="/images/infant-massage.webp" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h3 className="text-2xl text-ink">{dict.home.contactLead}</h3>
        <Link href={`/${locale}/contact`} className="mt-6 inline-block px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition">
          {dict.home.contactBtn}
        </Link>
      </section>
    </>
  );
}

function ServiceCard({ locale, title, href, img }: { locale: string; title: string; href: string; img: string }) {
  return (
    <Link href={`/${locale}${href}`} className="block rounded-2xl overflow-hidden border hover:shadow-soft transition">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={img} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="p-4 text-center text-ink font-medium">{title}</div>
    </Link>
  );
}
