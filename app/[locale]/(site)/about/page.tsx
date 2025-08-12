import { getDictionary, type Locale } from "@/dictionaries";

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      <header className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl font-semibold text-ink">{dict.nav.about}</h1>
          <div className="mt-4 text-lg text-slate-700 whitespace-pre-line">
            {dict.about.content}
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border shadow-soft">
          <img src="/images/contact.webp" alt="" className="w-full h-full object-cover" />
        </div>
      </header>
    </article>
  );
}

