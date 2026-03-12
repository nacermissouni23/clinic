import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, page, metadata } = body;

    const validTypes = ['page_view', 'whatsapp_click', 'call_click', 'booking_submit', 'contact_submit'];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    // In production: store in database or send to analytics service
    console.log("Analytics event:", { type, page, metadata, timestamp: new Date().toISOString() });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
