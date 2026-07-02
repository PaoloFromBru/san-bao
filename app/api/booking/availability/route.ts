import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service");
  const date = searchParams.get("date");

  if (!service || !date) {
    return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  const slots = await getAvailableSlots(service, date);
  return NextResponse.json({ slots });
}
