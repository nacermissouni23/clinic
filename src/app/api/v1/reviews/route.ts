import { NextResponse } from "next/server";
import { reviews } from "@/data/clinic";

export async function GET() {
  const visibleReviews = reviews.filter(r => r.isVisible);
  const avgRating = visibleReviews.reduce((acc, r) => acc + r.rating, 0) / visibleReviews.length;

  return NextResponse.json({
    reviews: visibleReviews,
    summary: {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: visibleReviews.length,
      bySource: {
        google: visibleReviews.filter(r => r.source === 'google').length,
        facebook: visibleReviews.filter(r => r.source === 'facebook').length,
        internal: visibleReviews.filter(r => r.source === 'internal').length,
      }
    }
  });
}
