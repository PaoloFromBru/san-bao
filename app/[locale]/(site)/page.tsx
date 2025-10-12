
import Link from "next/link";
import Image from "next/image";
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
          <Image
            src="/images/Logo-colours_.webp"
            alt="San Bao"
            width={1024}
            height={1024}
            className="mx-auto h-48 w-auto mb-6 rounded-full"
            priority
          />
          <p className="text-lg text-slate-700">{dict.home.heroText}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold text-ink mb-6">{dict.home.cardsTitle}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <ServiceCard locale={locale} title={dict.home.cardShiatsu} href="/services/shiatsu" img="/images/shiatsu.webp" />
          <ServiceCard locale={locale} title={dict.home.cardQiNeiZang} href="/services/qi-nei-zang" img="/images/QiNeiZang.webp" />
          <ServiceCard locale={locale} title={dict.home.cardInfant} href="/services/infant-massage" img="/images/MassageBebe.webp" />
          <ServiceCard locale={locale} title={dict.home.cardNaturopathy} href="/services/naturopathy" img="/images/naturopathy.webp" />
          <ServiceCard locale={locale} title={dict.home.cardFaceMassage} href="/services/face-massage" img="/images/FaceMassage.webp" />
          <ServiceCard locale={locale} title={dict.home.cardAboutMe} href="/about" img="/images/contact.webp" />
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
      <div className="aspect-[4/3] overflow-hidden relative">
        <Image src={img} alt="" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
      </div>
      <div className="p-4 text-center text-ink font-medium">{title}</div>
    </Link>
  );
}
