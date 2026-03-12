"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn, getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";
import { services } from "@/data/clinic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  MessageSquare,
  Calendar,
  Phone,
  ArrowUpRight,
} from "lucide-react";

// Mock analytics data
const pageViewsData = {
  total: 1247,
  change: "+12%",
};

const whatsappClicks = {
  total: 89,
  change: "+8%",
};

const bookingRequests = {
  total: 23,
  change: "+15%",
};

const phoneCalls = {
  total: 45,
  change: "+5%",
};

// Mock daily visitors (7 days)
const dailyVisitors = [
  { day: "Lun", dayAr: "اثن", value: 145 },
  { day: "Mar", dayAr: "ثلا", value: 198 },
  { day: "Mer", dayAr: "اربع", value: 167 },
  { day: "Jeu", dayAr: "خمي", value: 212 },
  { day: "Ven", dayAr: "جمع", value: 89 },
  { day: "Sam", dayAr: "سبت", value: 234 },
  { day: "Dim", dayAr: "احد", value: 202 },
];

export default function AnalyticsPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;

  const maxVisitors = Math.max(...dailyVisitors.map((d) => d.value));

  // Top services viewed
  const topServices = services.slice(0, 5).map((s, i) => ({
    name: getLocalizedField(s, "name", locale),
    views: [342, 287, 256, 198, 154][i],
  }));

  // Traffic sources with locale
  const localTrafficSources = [
    { source: "Google", percentage: 60, color: "bg-red-500" },
    { source: "Direct", percentage: 20, color: "bg-blue-500" },
    { source: "Facebook", percentage: 15, color: "bg-indigo-500" },
    {
      source: locale === "ar" ? "اخرى" : "Autre",
      percentage: 5,
      color: "bg-gray-400",
    },
  ];

  const statCards = [
    {
      label: locale === "ar" ? "زيارات الصفحة هذا الشهر" : "Pages vues ce mois",
      value: pageViewsData.total.toLocaleString(),
      change: pageViewsData.change,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: locale === "ar" ? "نقرات واتساب" : "Clics WhatsApp",
      value: whatsappClicks.total.toString(),
      change: whatsappClicks.change,
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: locale === "ar" ? "طلبات الحجز" : "Demandes de RDV",
      value: bookingRequests.total.toString(),
      change: bookingRequests.change,
      icon: Calendar,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: locale === "ar" ? "مكالمات هاتفية" : "Appels telephoniques",
      value: phoneCalls.total.toString(),
      change: phoneCalls.change,
      icon: Phone,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("analytics.title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {locale === "ar"
            ? "نظرة عامة على اداء موقعك"
            : "Vue d'ensemble des performances de votre site"}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      stat.bg
                    )}
                  >
                    <Icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily visitors bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {locale === "ar"
                ? "الزوار اليوميون (7 ايام)"
                : "Visiteurs quotidiens (7 jours)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {dailyVisitors.map((day) => {
                const heightPercent = (day.value / maxVisitors) * 100;
                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {day.value}
                    </span>
                    <div className="w-full relative" style={{ height: "160px" }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {locale === "ar" ? day.dayAr : day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Traffic sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {locale === "ar" ? "مصادر الزيارات" : "Sources de trafic"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localTrafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">
                      {source.source}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {source.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        source.color
                      )}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top services viewed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("analytics.topServices")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topServices.map((service, index) => (
              <div
                key={service.name}
                className="flex items-center gap-4"
              >
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {service.name}
                    </span>
                    <span className="text-sm text-gray-500 shrink-0 ltr:ml-3 rtl:mr-3">
                      {service.views}{" "}
                      {locale === "ar" ? "مشاهدة" : "vues"}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${(service.views / topServices[0].views) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
