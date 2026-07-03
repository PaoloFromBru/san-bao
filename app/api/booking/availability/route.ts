import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service");
  const date = searchParams.get("date");
  const location = searchParams.get("location");

  if (!service || !date || !location) {
    return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  const slots = await getAvailableSlots(service, date, Number(location));
  return NextResponse.json({ slots });
}
