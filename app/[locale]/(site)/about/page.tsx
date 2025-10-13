import { getDictionary, type Locale, locales } from "@/dictionaries";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  const title = dict.meta.about?.title ?? `${dict.nav.about} – ${dict.meta.siteName}`;
  const description =
    dict.meta.about?.description ??
    "Pagina di presentazione: approccio personalizzato al benessere ispirato ai tre tesori corpo, energia e spirito.";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const path = `/${locale}/about`;

  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}/about`]));
  (languages as any)["x-default"] = "/it/about";

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: languages as Record<string, string>,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

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
          <Image src="/images/contact.webp" alt="Studio San Bao a Bruxelles" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              name: dict.nav.about,
              description: (dict.meta.about?.description || dict.meta.siteDescription) as string,
              inLanguage: locale,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/${locale}/about`,
              mainEntity: {
                "@type": "Person",
                name: "Christel",
                brand: dict.meta.siteName,
                areaServed: "Bruxelles",
              },
            },
            null,
            0
          ),
        }}
      />
    </article>
  );
}
