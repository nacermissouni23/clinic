import { NextRequest, NextResponse } from "next/server";

// Rate limiting store (in-memory for demo)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimit.get(ip);
  if (!limit || now > limit.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 3600000 }); // 1 hour window
    return true;
  }
  if (limit.count >= 20) return false;
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, phone, serviceId, preferredDate, preferredTime, notes, isEmergency } = body;

    // Validation
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is required (min 2 characters)" }, { status: 400 });
    }
    if (!phone || phone.length < 9) {
      return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
    }

    // Generate reference number
    const ref = `RDV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // In production: save to database, send WhatsApp notification to clinic
    console.log("New booking request:", { ref, name, phone, serviceId, preferredDate, preferredTime, notes, isEmergency });

    return NextResponse.json({
      success: true,
      reference: ref,
      message: "Booking request received. We will contact you on WhatsApp to confirm.",
      data: { ref, name, phone, serviceId, preferredDate, preferredTime }
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
