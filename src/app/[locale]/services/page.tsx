"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { services } from "@/data/clinic";
import { getLocalizedField, formatPrice, cn } from "@/lib/utils";
import { Locale } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Stethoscope,
  Sparkles,
  Syringe,
  HeartPulse,
  Baby,
  AlertCircle,
  Wrench,
  SmilePlus,
  Sun,
  Gem,
  Scan,
  Crown,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import React from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
  Sparkles,
  Syringe,
  HeartPulse,
  Baby,
  AlertCircle,
  Wrench,
  SmilePlus,
  Sun,
  Gem,
  Scan,
  Crown,
};

type Category =
  | "all"
  | "general"
  | "cosmetic"
  | "orthodontics"
  | "surgery"
  | "paediatric"
  | "emergency";

const categories: Category[] = [
  "all",
  "general",
  "cosmetic",
  "orthodontics",
  "surgery",
  "paediatric",
  "emergency",
];

export default function ServicesPage() {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const isRtl = locale === "ar";

  const activeServices = services.filter((s) => s.isActive);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const getCategoryLabel = (cat: Category): string => {
    if (cat === "all") {
      return locale === "ar" ? "الكل" : "Tous";
    }
    return t(`categories.${cat}.name`);
  };

  const renderServiceGrid = (filteredServices: typeof activeServices) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredServices.map((service) => {
        const IconComponent = iconMap[service.icon] || Stethoscope;
        const serviceName = getLocalizedField(service, "name", locale);
        const serviceDesc = getLocalizedField(
          service,
          "descriptionShort",
          locale
        );
        const slug = locale === "ar" ? service.slugAr : service.slugFr;

        return (
          <Card
            key={service.id}
            hover
            className={cn(
              "flex flex-col",
              service.isEmergency &&
                "border-2 border-amber-400 ring-1 ring-amber-200"
            )}
          >
            <CardHeader>
              <div className="mb-3 flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    service.isEmergency
                      ? "bg-amber-100 text-amber-600"
                      : "bg-primary-100 text-primary-600"
                  )}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                {service.isEmergency && (
                  <Badge variant="warning" className="text-xs">
                    {t("categories.emergency.name")}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{serviceName}</CardTitle>
              <CardDescription className="line-clamp-3">
                {serviceDesc}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="space-y-2">
                {/* Price */}
                {service.priceFrom && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-500">
                      {t("priceFrom")}
                    </span>
                    <span className="font-semibold text-secondary-800">
                      {formatPrice(service.priceFrom)}
                      {service.priceTo &&
                        service.priceTo !== service.priceFrom &&
                        ` - ${formatPrice(service.priceTo)}`}
                    </span>
                  </div>
                )}

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {service.durationMinutes} {t("minutes")}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-3 pt-4">
              <Link href={`/services/${slug}`} className="flex-1">
                <Button variant="outline" size="sm" fullWidth>
                  {t("viewDetails")}
                </Button>
              </Link>
              {service.isBookableOnline && (
                <Link href="/book" className="flex-1">
                  <Button
                    size="sm"
                    fullWidth
                    iconRight={<ArrowIcon className="h-4 w-4" />}
                  >
                    {t("bookAppointment")}
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="px-4 pt-16 pb-8">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Tabs & Grid */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="all" variant="pills">
            <div className="mb-8 overflow-x-auto pb-2">
              <TabsList className="flex-nowrap whitespace-nowrap">
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* All services */}
            <TabsContent value="all">
              {renderServiceGrid(activeServices)}
            </TabsContent>

            {/* Category-specific views */}
            {categories
              .filter((c) => c !== "all")
              .map((cat) => {
                const filtered = activeServices.filter(
                  (s) => s.category === cat
                );
                return (
                  <TabsContent key={cat} value={cat}>
                    {/* Category description */}
                    <div className="mb-8 rounded-xl bg-primary-50 p-6">
                      <h2 className="mb-2 text-xl font-semibold text-secondary-800">
                        {t(`categories.${cat}.name`)}
                      </h2>
                      <p className="text-gray-600">
                        {t(`categories.${cat}.description`)}
                      </p>
                    </div>

                    {filtered.length > 0 ? (
                      renderServiceGrid(filtered)
                    ) : (
                      <div className="py-12 text-center text-gray-500">
                        {tCommon("noResults")}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
          </Tabs>
        </div>
      </section>
    </main>
  );
}
