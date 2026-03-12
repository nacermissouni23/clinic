"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Stethoscope,
  Sparkles,
  Syringe,
  HeartPulse,
  Crown,
  Baby,
  AlertCircle,
  Wrench,
  SmilePlus,
  Gem,
  Sun,
  Scan,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { services } from "@/data/clinic";
import { getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
  Sparkles,
  Syringe,
  HeartPulse,
  Crown,
  Baby,
  AlertCircle,
  Wrench,
  SmilePlus,
  Gem,
  Sun,
  Scan,
};

const iconColorMap: Record<string, string> = {
  general: "bg-primary-50 text-primary-600",
  cosmetic: "bg-amber-50 text-amber-600",
  orthodontics: "bg-accent-50 text-accent-600",
  surgery: "bg-red-50 text-red-600",
  paediatric: "bg-blue-50 text-blue-600",
  emergency: "bg-orange-50 text-orange-600",
};

export default function ServicesSection() {
  const t = useTranslations("services");
  const locale = useLocale() as Locale;
  const isRTL = locale === "ar";

  const activeServices = services.filter((s) => s.isActive).slice(0, 12);

  return (
    <section className="section-padding bg-white" id="services">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            {locale === "ar" ? "خدماتنا" : "Nos soins"}
          </span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {activeServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Stethoscope;
            const name = getLocalizedField(service, "name", locale);
            const description = getLocalizedField(service, "descriptionShort", locale);
            const priceDisplay = getLocalizedField(service, "priceDisplay", locale);
            const colorClasses = iconColorMap[service.category] || iconColorMap.general;

            return (
              <Card
                key={service.id}
                hover
                className="card-hover group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 75}ms`, animationFillMode: "both" }}
              >
                <CardContent className="p-4 md:p-6">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${colorClasses} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <IconComponent className="h-6 w-6 md:h-7 md:w-7" />
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-secondary-900 text-sm md:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {name}
                  </h3>

                  {/* Description (hidden on small screens for compactness) */}
                  <p className="hidden sm:block text-xs md:text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                    {description}
                  </p>

                  {/* Price */}
                  {priceDisplay && (
                    <p className="text-xs md:text-sm font-medium text-primary">
                      {priceDisplay}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA button */}
        <div className="text-center mt-10 md:mt-14">
          <Link href="/services">
            <Button
              variant="outline"
              size="lg"
              iconRight={
                isRTL ? (
                  <ArrowLeft className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )
              }
            >
              {locale === "ar" ? "عرض جميع الخدمات" : "Voir tous les soins"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
