import { NextResponse } from "next/server";
import { clinic, dentists, services } from "@/data/clinic";

export async function GET() {
  return NextResponse.json({
    clinic,
    dentists,
    services: services.filter(s => s.isActive),
  });
}
