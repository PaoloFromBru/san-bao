
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  const normalized = raw ? (raw.match(/^https?:\/\//i) ? raw : `https://${raw}`) : "http://localhost:3000";
  let metadataBase: URL | undefined;
  try {
    metadataBase = new URL(normalized);
  } catch {
    metadataBase = undefined;
  }
  return {
    title: dict.meta.siteName,
    description: dict.meta.siteDescription,
    metadataBase,
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
                <Link href={`/${locale}`}>
                <Image src="/images/Logo-mini.webp" alt="San Bao" width={1024} height={1024} className="h-10 w-auto" />
              </Link>
            </div>
            <Nav locale={locale} dict={dict} />
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
            <p className="mb-2">{dict.disclaimer}</p>
            © {new Date().getFullYear()} San Bao
          </div>
        </footer>
      </body>
    </html>
  );
}
