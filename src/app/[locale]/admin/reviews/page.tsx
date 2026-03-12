"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn, getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";
import { reviews as allReviews } from "@/data/clinic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Star,
  Globe,
  Facebook,
  MessageSquare,
  Eye,
  EyeOff,
  Send,
  TrendingUp,
  Award,
} from "lucide-react";

export default function ReviewsPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const dateLocale = locale === "ar" ? undefined : fr;

  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [reviewsList, setReviewsList] = useState([...allReviews]);

  // Summary stats
  const totalReviews = reviewsList.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviewsList.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : "0";

  const googleCount = reviewsList.filter((r) => r.source === "google").length;
  const facebookCount = reviewsList.filter(
    (r) => r.source === "facebook"
  ).length;
  const internalCount = reviewsList.filter(
    (r) => r.source === "internal"
  ).length;

  // Filter and sort
  const filteredReviews = useMemo(() => {
    let result = [...reviewsList];

    if (sourceFilter !== "all") {
      result = result.filter((r) => r.source === sourceFilter);
    }

    switch (sortBy) {
      case "date-desc":
        result.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
        break;
      case "date-asc":
        result.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
        );
        break;
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        result.sort((a, b) => a.rating - b.rating);
        break;
    }

    return result;
  }, [reviewsList, sourceFilter, sortBy]);

  // Toggle featured
  const toggleFeatured = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isFeatured: !r.isFeatured } : r
      )
    );
  };

  // Toggle visibility
  const toggleVisibility = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isVisible: !r.isVisible } : r
      )
    );
  };

  // Star rendering
  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              size,
              i <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-gray-200 fill-gray-200"
            )}
          />
        ))}
      </div>
    );
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "google":
        return <Globe className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      case "internal":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "google":
        return "Google";
      case "facebook":
        return "Facebook";
      case "internal":
        return locale === "ar" ? "الموقع" : "Interne";
      default:
        return source;
    }
  };

  const sourceOptions = [
    { value: "all", label: locale === "ar" ? "جميع المصادر" : "Toutes les sources" },
    { value: "google", label: "Google" },
    { value: "facebook", label: "Facebook" },
    { value: "internal", label: locale === "ar" ? "الموقع" : "Interne" },
  ];

  const sortOptions = [
    {
      value: "date-desc",
      label: locale === "ar" ? "الاحدث اولا" : "Plus recents",
    },
    {
      value: "date-asc",
      label: locale === "ar" ? "الاقدم اولا" : "Plus anciens",
    },
    {
      value: "rating-desc",
      label: locale === "ar" ? "الاعلى تقييما" : "Meilleures notes",
    },
    {
      value: "rating-asc",
      label: locale === "ar" ? "الادنى تقييما" : "Notes les plus basses",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("reviews.title")}
        </h1>
        <Button>
          <Send className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
          {locale === "ar" ? "طلب تقييم" : "Demander un avis"}
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Average rating */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="p-5 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {averageRating}
            </div>
            <div className="flex justify-center mb-1">
              {renderStars(Math.round(Number(averageRating)), "w-5 h-5")}
            </div>
            <p className="text-xs text-gray-500">
              {totalReviews} {locale === "ar" ? "تقييم" : "avis"}
            </p>
          </CardContent>
        </Card>

        {/* Total reviews */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalReviews}
                </p>
                <p className="text-xs text-gray-500">
                  {locale === "ar" ? "اجمالي التقييمات" : "Total avis"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {googleCount}
                </p>
                <p className="text-xs text-gray-500">Google</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facebook */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Facebook className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {facebookCount}
                </p>
                <p className="text-xs text-gray-500">Facebook</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Internal */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {internalCount}
                </p>
                <p className="text-xs text-gray-500">
                  {locale === "ar" ? "الموقع" : "Interne"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          options={sourceOptions}
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="w-full sm:w-48"
        />
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {locale === "ar"
                  ? "لا توجد تقييمات"
                  : "Aucun avis trouve"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card
              key={review.id}
              className={cn(!review.isVisible && "opacity-60")}
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Review content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 shrink-0">
                        {review.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 text-sm">
                            {review.authorName}
                          </p>
                          {review.isFeatured && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">
                              <Award className="w-3 h-3 ltr:mr-0.5 rtl:ml-0.5" />
                              {locale === "ar" ? "مميز" : "Mis en avant"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {renderStars(review.rating, "w-3.5 h-3.5")}
                          <span className="text-xs text-gray-400">
                            {format(parseISO(review.publishedAt), "d MMM yyyy", {
                              locale: dateLocale,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      {getLocalizedField(review, "text", locale)}
                    </p>

                    {/* Source badge */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border",
                          review.source === "google" &&
                            "bg-red-50 text-red-700 border-red-200",
                          review.source === "facebook" &&
                            "bg-blue-50 text-blue-700 border-blue-200",
                          review.source === "internal" &&
                            "bg-primary-50 text-primary-700 border-primary-200"
                        )}
                      >
                        {getSourceIcon(review.source)}
                        {getSourceLabel(review.source)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 shrink-0">
                    {/* Featured toggle */}
                    <button
                      onClick={() => toggleFeatured(review.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                        review.isFeatured
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      )}
                      title={
                        locale === "ar"
                          ? review.isFeatured
                            ? "الغاء التمييز"
                            : "تمييز"
                          : review.isFeatured
                          ? "Retirer mise en avant"
                          : "Mettre en avant"
                      }
                    >
                      <Star
                        className={cn(
                          "w-3.5 h-3.5",
                          review.isFeatured && "fill-amber-400"
                        )}
                      />
                      {review.isFeatured
                        ? locale === "ar"
                          ? "مميز"
                          : "Mis en avant"
                        : locale === "ar"
                        ? "تمييز"
                        : "Mettre en avant"}
                    </button>

                    {/* Visibility toggle */}
                    <button
                      onClick={() => toggleVisibility(review.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                        review.isVisible
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      )}
                    >
                      {review.isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          {locale === "ar" ? "ظاهر" : "Visible"}
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          {locale === "ar" ? "مخفي" : "Masque"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
