
import type { ReactNode } from "react";
import { getDictionary } from "@/dictionaries";
import Nav from "@/components/Nav";
import { locales, type Locale } from "@/dictionaries";
import "../globals.css";

export async function generateStaticParams() {
  return locales.map((l) => ({ locale: l }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as any);
  return {
    title: dict.meta.siteName,
    description: dict.meta.siteDescription,
    openGraph: { title: dict.meta.siteName, description: dict.meta.siteDescription },
    twitter: { card: "summary_large_image", title: dict.meta.siteName, description: dict.meta.siteDescription }
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return (
    <html lang={locale}>
      <body>
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-gold.svg" alt="San Bao" className="h-10 w-auto" />
            </div>
            <Nav locale={locale} dict={dict} />
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
            © {new Date().getFullYear()} San Bao
          </div>
        </footer>
      </body>
    </html>
  );
}
