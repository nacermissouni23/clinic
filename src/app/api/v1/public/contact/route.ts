import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, preferredLanguage, preferredDay, preferredTime, treatmentRequired, message } = body;

    // Validation
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!phone || phone.length < 9) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // In production: save to database, send notification
    console.log("New contact enquiry:", { name, phone, email, preferredLanguage, preferredDay, preferredTime, treatmentRequired, message });

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We will get back to you shortly."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
