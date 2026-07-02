"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Password errata.");
      return;
    }
    router.push("/admin/services");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-semibold text-ink mb-6">San Bao — Amministrazione</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded-xl2 border px-4 py-3"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 py-3 rounded-xl2 border border-gold text-gold hover:bg-gold hover:text-white transition disabled:opacity-50"
        >
          {loading ? "Accesso..." : "Accedi"}
        </button>
      </form>
    </div>
  );
}
