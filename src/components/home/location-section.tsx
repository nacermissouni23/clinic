"use client";

import { useTranslations, useLocale } from "next-intl";
import { MapPin, Clock, Phone, ExternalLink, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clinic } from "@/data/clinic";
import { getLocalizedField, isClinicOpen } from "@/lib/utils";
import type { Locale } from "@/types";

const dayKeys = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"] as const;

const dayNamesFr: Record<string, string> = {
  sat: "Samedi",
  sun: "Dimanche",
  mon: "Lundi",
  tue: "Mardi",
  wed: "Mercredi",
  thu: "Jeudi",
  fri: "Vendredi",
};

const dayNamesAr: Record<string, string> = {
  sat: "\u0627\u0644\u0633\u0628\u062a",
  sun: "\u0627\u0644\u0623\u062d\u062f",
  mon: "\u0627\u0644\u0625\u062b\u0646\u064a\u0646",
  tue: "\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621",
  wed: "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621",
  thu: "\u0627\u0644\u062e\u0645\u064a\u0633",
  fri: "\u0627\u0644\u062c\u0645\u0639\u0629",
};

export default function LocationSection() {
  const tContact = useTranslations("contact");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  const address = getLocalizedField(clinic, "address", locale);
  const isOpen = isClinicOpen(clinic.operatingHours, clinic.timezone);
  const dayNames = locale === "ar" ? dayNamesAr : dayNamesFr;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`;

  // Get current day for highlighting
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: clinic.timezone,
    weekday: "long",
  });
  const currentWeekday = formatter.format(now).toLowerCase();
  const currentDayMap: Record<string, string> = {
    saturday: "sat",
    sunday: "sun",
    monday: "mon",
    tuesday: "tue",
    wednesday: "wed",
    thursday: "thu",
    friday: "fri",
  };
  const currentDayKey = currentDayMap[currentWeekday] || "";

  return (
    <section className="section-padding bg-white" id="location">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            {locale === "ar" ? "موقعنا" : "Localisation"}
          </span>
          <h2 className="section-title">{tContact("mapTitle")}</h2>
          <p className="section-subtitle">{tContact("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Map */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-200 h-[320px] md:h-[400px]">
              <iframe
                title="Google Maps"
                src={`https://maps.google.com/maps?q=${clinic.latitude},${clinic.longitude}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Get directions button */}
            <div className="mt-4">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  iconLeft={<Navigation className="h-4 w-4" />}
                  iconRight={<ExternalLink className="h-3.5 w-3.5 opacity-60" />}
                >
                  {tContact("getDirections")} - Google Maps
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Opening hours + info */}
          <div className="order-1 lg:order-2">
            {/* Open/Closed status */}
            <div className="flex items-center gap-3 mb-6">
              <Badge
                variant={isOpen ? "success" : "danger"}
                className="px-4 py-1.5 text-sm"
              >
                <span className="relative flex h-2 w-2 me-2">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isOpen ? "bg-accent-400 animate-ping" : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isOpen ? "bg-accent" : "bg-red-500"
                    }`}
                  />
                </span>
                {isOpen ? tCommon("openNow") : tCommon("closedNow")}
              </Badge>
            </div>

            {/* Opening hours */}
            <h3 className="text-xl font-semibold text-secondary-900 mb-5 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {tContact("openingHours")}
            </h3>

            <div className="space-y-0 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              {dayKeys.map((dayKey) => {
                const hours = clinic.operatingHours[dayKey];
                const isToday = dayKey === currentDayKey;
                const isClosed = !hours || hours.length === 0;

                return (
                  <div
                    key={dayKey}
                    className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                      isToday
                        ? "bg-primary-50/50 border-l-4 border-l-primary"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          isToday
                            ? "font-semibold text-primary-700"
                            : "font-medium text-secondary-700"
                        }`}
                      >
                        {dayNames[dayKey]}
                      </span>
                      {isToday && (
                        <span className="text-[10px] bg-primary text-white rounded-full px-2 py-0.5">
                          {locale === "ar" ? "اليوم" : "Aujourd'hui"}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isClosed
                          ? "text-red-500 font-medium"
                          : isToday
                          ? "text-primary-700 font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {isClosed
                        ? tContact("closed")
                        : hours
                            .map((slot) => `${slot.open} - ${slot.close}`)
                            .join(" | ")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Contact info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{tContact("address")}</p>
                  <p className="text-sm text-secondary-800 font-medium">{address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{tContact("phone")}</p>
                  <a
                    href={`tel:${clinic.phonePrimary.replace(/\s/g, "")}`}
                    className="text-sm text-secondary-800 font-medium hover:text-primary transition-colors"
                  >
                    {clinic.phonePrimary}
                  </a>
                </div>
              </div>

              {clinic.emergencyPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{tContact("emergencyContact")}</p>
                    <a
                      href={`tel:${clinic.emergencyPhone.replace(/\s/g, "")}`}
                      className="text-sm text-red-600 font-medium hover:text-red-700 transition-colors"
                    >
                      {clinic.emergencyPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
