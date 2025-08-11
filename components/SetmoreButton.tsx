"use client";

import { useEffect } from "react";

type Props = {
  alt?: string;
  id?: string;
};

export default function SetmoreButton({
  alt = "Click here to book the appointment using setmore",
  id = "Setmore_button_iframe",
}: Props) {
  const bookingUrl =
    process.env.NEXT_PUBLIC_SETMORE_URL ?? "https://hauben.setmore.com";

  useEffect(() => {
    // Carica lo script Setmore una sola volta in tutta l'app
    const scriptId = "setmore_script";
    if (document.getElementById(scriptId)) return;
    const s = document.createElement("script");
    s.id = scriptId;
    s.type = "text/javascript";
    s.src =
      "https://assets.setmore.com/integration/static/setmoreIframeLive.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <a id={id} href={bookingUrl} style={{ float: "none" }}>
      <img
        src="https://assets.setmore.com/setmore/images/2.0/Settings/book-now-black.svg"
        alt={alt}
        style={{ border: "none" }}
      />
    </a>
  );
}

