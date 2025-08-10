"use client";

import { useEffect } from "react";

type Props = {
  label?: string;
  className?: string;
  id?: string;
};

export default function SetmoreButton({
  label = "Prenota un appuntamento",
  className = "inline-block px-6 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition",
  id = "Setmore_button_iframe",
}: Props) {
  const bookingUrl = process.env.NEXT_PUBLIC_SETMORE_URL;

  useEffect(() => {
    // Carica lo script Setmore una sola volta in tutta l'app
    const scriptId = "setmore-widget-js";
    if (document.getElementById(scriptId)) return;
    const s = document.createElement("script");
    s.id = scriptId;
    s.src = "https://my.setmore.com/webapp/js/widget.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  if (!bookingUrl) {
    // fallback di sicurezza: non rompiamo l'UI se manca l'ENV
    return (
      <a
        href="#"
        aria-disabled="true"
        className={`${className} opacity-60 pointer-events-none`}
        title="Configura NEXT_PUBLIC_SETMORE_URL"
      >
        {label}
      </a>
    );
  }

  // L’ancora con id specifico fa aprire il popup di Setmore
  return (
    <a id={id} href={bookingUrl} className={className} rel="nofollow">
      {label}
    </a>
  );
}

