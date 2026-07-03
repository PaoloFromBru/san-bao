import { NextResponse } from "next/server";
import { getMonthAvailability } from "@/lib/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service");
  const location = searchParams.get("location");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!service || !location || !year || !month) {
    return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  const status = await getMonthAvailability(service, Number(year), Number(month), Number(location));
  return NextResponse.json({ status });
}
