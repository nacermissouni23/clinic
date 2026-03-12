"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Star,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Globe,
  Facebook,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { reviews, clinic } from "@/data/clinic";
import type { Locale, Review } from "@/types";

type SourceFilter = "all" | "google" | "facebook" | "internal";
type SortOption = "newest" | "highest";

export default function ReviewsPage() {
  const t = useTranslations("reviews");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const visibleReviews = reviews.filter((r) => r.isVisible);

  // Stats
  const averageRating =
    visibleReviews.reduce((sum, r) => sum + r.rating, 0) / visibleReviews.length;
  const totalCount = visibleReviews.length;

  // Star breakdown
  const starBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1-star, index 4 = 5-star
    visibleReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating - 1]++;
      }
    });
    return counts;
  }, [visibleReviews]);

  // Filter and sort
  const filteredReviews = useMemo(() => {
    let result = visibleReviews;

    if (sourceFilter !== "all") {
      result = result.filter((r) => r.source === sourceFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return b.rating - a.rating;
    });

    return result;
  }, [visibleReviews, sourceFilter, sortBy]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSourceIcon = (source: Review["source"]) => {
    switch (source) {
      case "google":
        return <Globe className="h-3.5 w-3.5" />;
      case "facebook":
        return <Facebook className="h-3.5 w-3.5" />;
      case "internal":
        return <MessageSquare className="h-3.5 w-3.5" />;
    }
  };

  const getSourceLabel = (source: Review["source"]) => {
    switch (source) {
      case "google":
        return t("source.google");
      case "facebook":
        return t("source.facebook");
      case "internal":
        return t("source.website");
    }
  };

  const getReviewText = (review: Review) => {
    if (locale === "ar") return review.textAr || review.textFr || "";
    return review.textFr || review.textAr || "";
  };

  const googleReviewUrl = clinic.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${clinic.googlePlaceId}`
    : "#";

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              {/* Average Rating */}
              <div className="flex flex-col items-center text-center md:min-w-[180px]">
                <span className="text-5xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <RatingStars
                  rating={averageRating}
                  size="lg"
                  showValue={false}
                  className="mt-2"
                />
                <span className="mt-1.5 text-sm text-gray-500">
                  {t("totalReviews", { count: totalCount })}
                </span>
              </div>

              {/* Star Breakdown */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = starBreakdown[star - 1];
                  const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="flex w-8 items-center justify-end gap-1 text-sm font-medium text-gray-700">
                        {star}
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-sm text-gray-500 ltr:text-right rtl:text-left">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center gap-3 md:min-w-[180px]">
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="default"
                    size="lg"
                    iconRight={<ExternalLink className="h-4 w-4" />}
                  >
                    {t("leaveReview")}
                  </Button>
                </a>
                <span className="text-xs text-gray-400">Google</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter & Sort Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Source Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {(["all", "google", "facebook", "internal"] as SourceFilter[]).map(
                (src) => (
                  <button
                    key={src}
                    onClick={() => setSourceFilter(src)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      sourceFilter === src
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {src === "all"
                      ? locale === "ar"
                        ? "الكل"
                        : "Tous"
                      : getSourceLabel(src)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="newest">{t("sortRecent")}</option>
              <option value="highest">{t("sortHighest")}</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredReviews.map((review) => (
            <Card
              key={review.id}
              className={`transition-all ${
                review.isFeatured
                  ? "border-amber-200 bg-amber-50/30 ring-1 ring-amber-100"
                  : ""
              }`}
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
                      {review.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.authorName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(review.publishedAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1 text-[10px]">
                    {getSourceIcon(review.source)}
                    {getSourceLabel(review.source)}
                  </Badge>
                </div>

                {/* Rating */}
                <RatingStars
                  rating={review.rating}
                  size="sm"
                  showValue={false}
                  className="mb-2"
                />

                {/* Text */}
                <p className="text-sm leading-relaxed text-gray-700">
                  {getReviewText(review)}
                </p>

                {/* Reply */}
                {review.replyText && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-3 ltr:border-l-3 rtl:border-r-3 border-primary-300">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary-700">
                      <ThumbsUp className="h-3 w-3" />
                      {locale === "ar"
                        ? "رد من د. بن سالم"
                        : "Réponse de Dr. Bensalem"}
                    </p>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {review.replyText}
                    </p>
                  </div>
                )}

                {/* Featured indicator */}
                {review.isFeatured && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-amber-600">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {locale === "ar" ? "تقييم مميّز" : "Avis mis en avant"}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredReviews.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            {tCommon("noResults")}
          </div>
        )}

        {/* Testimonial opt-in notice */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">
            {locale === "ar"
              ? "جميع التقييمات المعروضة هي من مرضى حقيقيين وافقوا على نشر آرائهم. نحن نحترم خصوصيتكم ولا ننشر أي تقييم بدون إذن صريح."
              : "Tous les avis affichés proviennent de vrais patients ayant donné leur consentement pour la publication. Nous respectons votre vie privée et ne publions aucun avis sans autorisation explicite."}
          </p>
        </div>
      </div>
    </main>
  );
}
