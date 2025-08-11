
"use client";
import Link from "next/link";
import LangSwitcher from "./LangSwitcher";
import type { Locale } from "@/dictionaries";

export default function Nav({ locale, dict }: { locale: Locale; dict: any }) {
  const base = `/${locale}`;
  return (
    <nav className="flex items-center gap-6">
      <Link className="hover:text-ink" href={`${base}/services/shiatsu`}>{dict.nav.shiatsu}</Link>
      <Link className="hover:text-ink" href={`${base}/services/qi-nei-zang`}>{dict.nav.qiNeiZang}</Link>
      <Link className="hover:text-ink" href={`${base}/services/naturopathy`}>{dict.nav.naturopathy}</Link>
      <Link className="hover:text-ink" href={`${base}/services/face-massage`}>{dict.nav.faceMassage}</Link>
      <Link className="hover:text-ink" href={`${base}/services/infant-massage`}>{dict.nav.infant}</Link>
      <Link className="hover:text-ink" href={`${base}/about`}>{dict.nav.about}</Link>
      <Link className="px-4 py-2 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition" href={`${base}/contact`}>
        {dict.nav.contact}
      </Link>
      <LangSwitcher currentLocale={locale} />
    </nav>
  );
}
