
import { NextResponse, type NextRequest } from "next/server";
const locales = ["it","fr","en","nl","es"]; const def="it";
export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = req.cookies.get("admin_session")?.value;
    if (session !== process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  if (locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return NextResponse.next();
  if (pathname === "/") return NextResponse.redirect(new URL(`/${def}`, req.url));
  return NextResponse.next();
}
