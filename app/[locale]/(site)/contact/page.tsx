
import { getDictionary, type Locale } from "@/dictionaries";
import SetmoreButton from "@/components/SetmoreButton";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    openGraph: { title: dict.meta.contact.title, description: dict.meta.contact.description },
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
        <SetmoreButton label={dict.home.heroCta} />
      </div>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        <form className="space-y-4">
          <input className="w-full border rounded-xl2 p-3" placeholder={dict.contact.name} />
          <input className="w-full border rounded-xl2 p-3" placeholder={dict.contact.email} type="email" />
          <textarea className="w-full border rounded-xl2 p-3 h-40" placeholder={dict.contact.message} />
          <button className="px-5 py-3 rounded-xl2 bg-teal text-white hover:opacity-90">{dict.contact.send}</button>
        </form>

        <div className="rounded-2xl overflow-hidden border shadow-soft h-[320px]">
          <iframe title="Map" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com" />
        </div>
      </div>

      <div className="mt-10">
        <a className="inline-flex items-center gap-3 border rounded-full px-5 py-3 text-ink hover:border-teal" href="https://wa.me/XXXXXXXXXXX" target="_blank" rel="noreferrer">
          <span>🟢</span> {dict.contact.whatsapp}
        </a>
      </div>
    </div>
  );
}
