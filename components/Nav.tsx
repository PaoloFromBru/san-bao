
"use client";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/dictionaries";
import { locales } from "@/dictionaries";
import LangSwitcher from "./LangSwitcher";

const FLAGS: Record<string, string> = { it: "🇮🇹", fr: "🇫🇷", en: "🇬🇧", nl: "🇳🇱", es: "🇪🇸" };

export default function Nav({ locale, dict }: { locale: Locale; dict: any }) {
  const base = `/${locale}`;
  const [openMenu, setOpenMenu] = useState(false);
  const [openLang, setOpenLang] = useState(false);

  return (
    <nav className="flex items-center gap-3">
      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
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
      </div>

      {/* Mobile actions: menu + language */}
      <div className="md:hidden flex items-center gap-2">
        <button
          aria-label="Open menu"
          aria-expanded={openMenu}
          onClick={() => {
            setOpenMenu(!openMenu); setOpenLang(false);
          }}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 text-slate-700 bg-white/70 backdrop-blur hover:bg-white"
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <button
          aria-label="Change language"
          aria-expanded={openLang}
          onClick={() => { setOpenLang(!openLang); setOpenMenu(false); }}
          className="inline-flex items-center justify-center px-3 h-10 rounded-full border border-slate-300 text-slate-700 bg-white/70 backdrop-blur hover:bg-white gap-2"
        >
          <span className="text-base">{FLAGS[locale]}</span>
          <span className="uppercase text-sm">{locale}</span>
        </button>
      </div>

      {/* Dropdowns (mobile) */}
      {openMenu && (
        <div className="fixed inset-x-4 top-16 z-50 md:hidden">
          <div className="rounded-2xl border bg-white/90 backdrop-blur shadow-soft p-3">
            <div className="grid">
              <Link className="px-3 py-2 rounded-lg hover:bg-slate-100" href={`${base}/services/shiatsu`} onClick={() => setOpenMenu(false)}>{dict.nav.shiatsu}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-slate-100" href={`${base}/services/qi-nei-zang`} onClick={() => setOpenMenu(false)}>{dict.nav.qiNeiZang}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-slate-100" href={`${base}/services/naturopathy`} onClick={() => setOpenMenu(false)}>{dict.nav.naturopathy}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-slate-100" href={`${base}/services/face-massage`} onClick={() => setOpenMenu(false)}>{dict.nav.faceMassage}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-slate-100" href={`${base}/services/infant-massage`} onClick={() => setOpenMenu(false)}>{dict.nav.infant}</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-slate-100" href={`${base}/about`} onClick={() => setOpenMenu(false)}>{dict.nav.about}</Link>
              <Link className="mt-1 px-3 py-2 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition text-center" href={`${base}/contact`} onClick={() => setOpenMenu(false)}>
                {dict.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      )}

      {openLang && (
        <div className="fixed right-4 left-auto top-16 z-50 md:hidden">
          <div className="rounded-2xl border bg-white/90 backdrop-blur shadow-soft p-2">
            <ul className="min-w-[180px]">
              {locales.map(l => (
                <li key={l}>
                  <Link
                    href={`/${l}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 ${l===locale ? "text-ink font-medium" : "text-slate-700"}`}
                    onClick={() => setOpenLang(false)}
                  >
                    <span className="text-lg">{FLAGS[l]}</span>
                    <span className="uppercase">{l}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
