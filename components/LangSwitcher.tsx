
"use client";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/dictionaries";

export default function LangSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  function switchTo(lang: Locale) {
    if (lang === currentLocale) return;
    const segments = pathname.split("/");
    segments[1] = lang;
    router.push(segments.join("/"));
  }
  return (
    <div className="flex items-center gap-2 text-sm">
      {locales.map(l => (
        <button key={l} onClick={() => switchTo(l)}
          className={`uppercase tracking-wide hover:text-ink ${l===currentLocale ? "font-semibold text-ink" : "text-slate-500"}`}
          aria-current={l===currentLocale ? "page" : undefined}>
          {l}
        </button>
      ))}
    </div>
  );
}
