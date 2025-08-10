
import { NextResponse } from "next/server";
const locales = ["it","fr","en","nl","es"]; const def="it";
export function middleware(req: Request) {
  const { pathname } = new URL(req.url);
  if (locales.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return NextResponse.next();
  if (pathname === "/") return NextResponse.redirect(new URL(`/${def}`, req.url));
  return NextResponse.next();
}
