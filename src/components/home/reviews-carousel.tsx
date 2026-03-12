"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/ui/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { reviews } from "@/data/clinic";
import { getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";

export default function ReviewsCarousel() {
  const t = useTranslations("reviews");
  const locale = useLocale() as Locale;
  const isRTL = locale === "ar";

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const visibleReviews = reviews.filter((r) => r.isVisible);

  // Average rating
  const avgRating =
    visibleReviews.reduce((sum, r) => sum + r.rating, 0) / visibleReviews.length;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tolerance = 2;
    if (isRTL) {
      setCanScrollRight(el.scrollLeft < -tolerance);
      setCanScrollLeft(Math.abs(el.scrollLeft) + el.clientWidth < el.scrollWidth - tolerance);
    } else {
      setCanScrollLeft(el.scrollLeft > tolerance);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance);
    }
  }, [isRTL]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  // Auto-scroll
  useEffect(() => {
    if (isPaused) return;
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      const scrollAmount = 320;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (isRTL) {
        if (Math.abs(el.scrollLeft) + el.clientWidth >= el.scrollWidth - 5) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      } else {
        if (el.scrollLeft >= maxScroll - 5) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, isRTL]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    el.scrollBy({ left: isRTL ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const getSourceBadge = (source: string) => {
    const sourceMap: Record<string, { label: string; color: string }> = {
      google: {
        label: locale === "ar" ? "Google" : "Google",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      },
      facebook: {
        label: "Facebook",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      },
      internal: {
        label: locale === "ar" ? "الموقع" : "Site",
        color: "bg-gray-50 text-gray-700 border-gray-200",
      },
    };
    return sourceMap[source] || sourceMap.internal;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section className="section-padding bg-white" id="reviews">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            {locale === "ar" ? "آراء المرضى" : "Témoignages"}
          </span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle">{t("subtitle")}</p>

          {/* Average rating display */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-secondary-900">{avgRating.toFixed(1)}</p>
              <RatingStars rating={avgRating} size="lg" showValue={false} className="mt-2 justify-center" />
              <p className="text-sm text-gray-500 mt-2">
                {visibleReviews.length} {locale === "ar" ? "تقييم" : "avis"}
              </p>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation arrows */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-5 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary-200 transition-all disabled:opacity-0 disabled:pointer-events-none"
            aria-label={locale === "ar" ? "السابق" : "Précédent"}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute top-1/2 -translate-y-1/2 -right-2 md:-right-5 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary-200 transition-all disabled:opacity-0 disabled:pointer-events-none"
            aria-label={locale === "ar" ? "التالي" : "Suivant"}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-1 pb-4 snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {visibleReviews.map((review) => {
              const text = getLocalizedField(review, "text", locale);
              const sourceBadge = getSourceBadge(review.source);

              return (
                <Card
                  key={review.id}
                  className="flex-shrink-0 w-[300px] sm:w-[340px] snap-start"
                  hover
                >
                  <CardContent className="p-5 md:p-6 flex flex-col h-full">
                    {/* Header: author + rating */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar placeholder */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                          {review.authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary-900 text-sm">
                            {review.authorName}
                          </p>
                          <p className="text-xs text-gray-400">{formatDate(review.publishedAt)}</p>
                        </div>
                      </div>
                      <Badge className={`${sourceBadge.color} text-[10px] px-2 py-0.5 border`}>
                        {sourceBadge.label}
                      </Badge>
                    </div>

                    {/* Rating */}
                    <RatingStars rating={review.rating} size="sm" showValue={false} className="mb-3" />

                    {/* Review text */}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                      {text}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* View all CTA */}
        <div className="text-center mt-10">
          <Link href="/reviews" className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-medium text-sm transition-colors">
            {locale === "ar" ? "عرض جميع التقييمات" : "Voir tous les avis"}
            {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
        </div>
      </div>
    </section>
  );
}
