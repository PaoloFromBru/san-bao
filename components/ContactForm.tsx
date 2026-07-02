"use client";

import { useState } from "react";

type ContactStrings = {
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  successMessage: string;
  errorMessage: string;
};

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ strings: t }: { strings: ContactStrings }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <p className="rounded-xl2 border border-green-600 text-green-700 p-4">
        {t.successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border rounded-xl2 p-3"
        placeholder={t.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="w-full border rounded-xl2 p-3"
        placeholder={t.email}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <textarea
        className="w-full border rounded-xl2 p-3 h-40"
        placeholder={t.message}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      {status === "error" && <p className="text-sm text-red-600">{t.errorMessage}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-5 py-3 rounded-xl2 bg-teal text-white hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? t.sending : t.send}
      </button>
    </form>
  );
}
