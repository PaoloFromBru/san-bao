import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import "../globals.css";

// /admin sits outside app/[locale], which is what supplies <html>/<body> for
// the public site — so this layout has to provide its own root shell.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <div className="min-h-screen bg-slate-50">
          <header className="border-b bg-white px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-6 flex-wrap">
              <Link href="/admin/services" className="font-semibold text-ink">
                San Bao — Amministrazione
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/admin/services" className="text-slate-500 hover:text-ink">
                  Servizi
                </Link>
                <Link href="/admin/hours" className="text-slate-500 hover:text-ink">
                  Orario
                </Link>
                <Link href="/admin/holidays" className="text-slate-500 hover:text-ink">
                  Chiusure
                </Link>
                <Link href="/admin/locations" className="text-slate-500 hover:text-ink">
                  Sedi
                </Link>
              </nav>
            </div>
            <LogoutButton />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
