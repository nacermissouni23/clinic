"use client";

import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { services, galleryItems } from "@/data/clinic";
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
} from "@/components/ui/card";
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
  Calendar,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
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

export default function ServiceDetailPage() {
  const t = useTranslations("services");
  const tGallery = useTranslations("gallery");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const isRtl = locale === "ar";
  const params = useParams();

  const slug = params.slug as string;

  // Find the service by slug (check both fr and ar slugs)
  const service = services.find(
    (s) =>
      s.slugFr === slug ||
      s.slugAr === slug ||
      s.slugFr === decodeURIComponent(slug) ||
      s.slugAr === decodeURIComponent(slug)
  );

  if (!service) {
    notFound();
  }

  const serviceName = getLocalizedField(service, "name", locale);
  const serviceDescFull = getLocalizedField(
    service,
    "descriptionFull",
    locale
  );
  const serviceDescShort = getLocalizedField(
    service,
    "descriptionShort",
    locale
  );
  const IconComponent = iconMap[service.icon] || Stethoscope;
  const BackIcon = isRtl ? ChevronRight : ChevronLeft;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Related gallery items for this service
  const relatedGalleryItems = galleryItems.filter(
    (item) => item.serviceId === service.id && item.isVisible
  );

  // Related services (same category, excluding current)
  const relatedServices = services.filter(
    (s) =>
      s.category === service.category &&
      s.id !== service.id &&
      s.isActive
  );

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.nameFr,
    alternateName: service.nameAr,
    description: service.descriptionFullFr,
    procedureType: "http://schema.org/NoninvasiveProcedure",
    ...(service.priceFrom && {
      offers: {
        "@type": "Offer",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: service.priceFrom,
          priceCurrency: "DZD",
          ...(service.priceTo && { maxPrice: service.priceTo }),
        },
      },
    }),
    estimatedCost: service.priceFrom
      ? {
          "@type": "MonetaryAmount",
          currency: "DZD",
          minValue: service.priceFrom,
          ...(service.priceTo && { maxValue: service.priceTo }),
        }
      : undefined,
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Back navigation */}
        <div className="mx-auto max-w-5xl px-4 pt-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-800"
          >
            <BackIcon className="h-4 w-4" />
            {tCommon("back")}
          </Link>
        </div>

        {/* Service Header */}
        <section className="px-4 pt-6 pb-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl sm:h-20 sm:w-20",
                    service.isEmergency
                      ? "bg-amber-100 text-amber-600"
                      : "bg-primary-100 text-primary-600"
                  )}
                >
                  <IconComponent className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>

                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-secondary-900 sm:text-3xl lg:text-4xl">
                      {serviceName}
                    </h1>
                    {service.isEmergency && (
                      <Badge variant="warning" className="text-sm">
                        {t("categories.emergency.name")}
                      </Badge>
                    )}
                  </div>

                  <p className="mb-6 text-lg text-gray-600">
                    {serviceDescShort}
                  </p>

                  {/* Key info pills */}
                  <div className="flex flex-wrap gap-4">
                    {service.priceFrom && (
                      <div className="rounded-xl bg-primary-50 px-4 py-3">
                        <div className="text-xs font-medium text-gray-500 uppercase">
                          {t("priceFrom")}
                        </div>
                        <div className="text-lg font-bold text-primary-700">
                          {formatPrice(service.priceFrom)}
                          {service.priceTo &&
                            service.priceTo !== service.priceFrom &&
                            ` - ${formatPrice(service.priceTo)}`}
                        </div>
                      </div>
                    )}

                    <div className="rounded-xl bg-secondary-50 px-4 py-3">
                      <div className="text-xs font-medium text-gray-500 uppercase">
                        {t("duration")}
                      </div>
                      <div className="flex items-center gap-1 text-lg font-bold text-secondary-700">
                        <Clock className="h-5 w-5" />
                        {service.durationMinutes} {t("minutes")}
                      </div>
                    </div>

                    <div className="rounded-xl bg-accent-50 px-4 py-3">
                      <div className="text-xs font-medium text-gray-500 uppercase">
                        {t("visits")}
                      </div>
                      <div className="text-lg font-bold text-accent-700">
                        {t("singleVisit")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Description & Booking CTA */}
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Description */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
                  <h2 className="mb-4 text-xl font-bold text-secondary-900">
                    {locale === "ar" ? "تفاصيل العلاج" : "D\u00e9tails du traitement"}
                  </h2>
                  <div className="space-y-4 leading-relaxed text-gray-700">
                    {serviceDescFull.split("\n").map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Booking card */}
                  <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-700 p-6 text-white shadow-xl">
                    <h3 className="mb-2 text-lg font-bold">
                      {locale === "ar"
                        ? "هل ترغب في هذا العلاج؟"
                        : "Int\u00e9ress\u00e9(e) par ce soin ?"}
                    </h3>
                    <p className="mb-6 text-sm text-primary-100">
                      {locale === "ar"
                        ? "احجز موعدك الآن واحصل على استشارة مخصصة"
                        : "Prenez rendez-vous et b\u00e9n\u00e9ficiez d'une consultation personnalis\u00e9e"}
                    </p>
                    <Link href="/book">
                      <Button
                        size="lg"
                        fullWidth
                        className="bg-white text-primary-700 hover:bg-gray-100 shadow-lg"
                        iconLeft={<Calendar className="h-5 w-5" />}
                      >
                        {t("bookAppointment")}
                      </Button>
                    </Link>
                  </div>

                  {/* Price summary */}
                  {service.priceFrom && (
                    <div className="rounded-2xl bg-white p-6 shadow-md">
                      <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
                        {locale === "ar" ? "التسعير" : "Tarification"}
                      </h3>
                      <div className="text-2xl font-bold text-secondary-900">
                        {locale === "ar"
                          ? service.priceDisplayAr
                          : service.priceDisplayFr}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {locale === "ar"
                          ? "السعر النهائي يحدد بعد الفحص"
                          : "Le prix final est d\u00e9termin\u00e9 apr\u00e8s consultation"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After Gallery */}
        {relatedGalleryItems.length > 0 && (
          <section className="bg-gray-50 px-4 py-16">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-8 text-center text-2xl font-bold text-secondary-900">
                {tGallery("title")}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedGalleryItems.map((item) => {
                  const title = getLocalizedField(item, "title", locale);
                  const description = getLocalizedField(
                    item,
                    "description",
                    locale
                  );

                  return (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-2xl bg-white shadow-md"
                    >
                      <div className="grid grid-cols-2">
                        {/* Before */}
                        <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300">
                          <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs font-semibold text-white">
                            {tGallery("before")}
                          </span>
                        </div>
                        {/* After */}
                        <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-primary-200 via-accent-200 to-primary-300">
                          <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs font-semibold text-white">
                            {tGallery("after")}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-secondary-800">
                          {title}
                        </h3>
                        {description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="px-4 py-16">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-8 text-center text-2xl font-bold text-secondary-900">
                {locale === "ar"
                  ? "خدمات ذات صلة"
                  : "Soins similaires"}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedServices.slice(0, 3).map((relService) => {
                  const RelIcon =
                    iconMap[relService.icon] || Stethoscope;
                  const relName = getLocalizedField(
                    relService,
                    "name",
                    locale
                  );
                  const relDesc = getLocalizedField(
                    relService,
                    "descriptionShort",
                    locale
                  );
                  const relSlug =
                    locale === "ar"
                      ? relService.slugAr
                      : relService.slugFr;

                  return (
                    <Card key={relService.id} hover>
                      <CardHeader>
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                          <RelIcon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base">
                          {relName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">
                          {relDesc}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/services/${relSlug}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconRight={<ArrowIcon className="h-4 w-4" />}
                          >
                            {t("viewDetails")}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
