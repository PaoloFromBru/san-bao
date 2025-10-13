
import { getDictionary, type Locale, locales } from "@/dictionaries";
import SetmoreButton from "@/components/SetmoreButton";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  const siteUrl = raw ? (raw.match(/^https?:\/\//i) ? raw : `https://${raw}`) : "http://localhost:3000";
  const path = `/${locale}/contact`;
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}/contact`]));
  (languages as any)["x-default"] = "/it/contact";
  return {
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    alternates: { canonical: path, languages: languages as Record<string, string> },
    openGraph: { title: dict.meta.contact.title, description: dict.meta.contact.description, url: `${siteUrl}${path}` },
    twitter: { card: "summary_large_image", title: dict.meta.contact.title, description: dict.meta.contact.description }
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-ink mb-6">{dict.contact.title}</h1>

      <div className="mb-6">
        <SetmoreButton alt={dict.home.heroCta} />
      </div>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        <form
          className="space-y-4"
          action="mailto:sanbao_shiatsu@hotmail.com"
          method="POST"
          encType="text/plain"
        >
          <input
            className="w-full border rounded-xl2 p-3"
            placeholder={dict.contact.name}
            name="name"
            required
          />
          <input
            className="w-full border rounded-xl2 p-3"
            placeholder={dict.contact.email}
            type="email"
            name="email"
            required
          />
          <textarea
            className="w-full border rounded-xl2 p-3 h-40"
            placeholder={dict.contact.message}
            name="message"
            required
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl2 bg-teal text-white hover:opacity-90"
          >
            {dict.contact.send}
          </button>
        </form>

        <div className="rounded-2xl border shadow-soft h-[320px] flex items-center justify-center bg-[#ecedee]">
          <Image
            src="/images/Logo-colours_.webp"
            alt="San Bao logo"
            width={1024}
            height={1024}
            className="w-48 h-48 object-contain rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
