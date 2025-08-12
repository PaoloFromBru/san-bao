
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

        <div className="rounded-2xl overflow-hidden border shadow-soft h-[320px] flex items-center justify-center">
          <img
            src="/images/Logo-colours.png"
            alt="San Bao logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
