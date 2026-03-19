"use client";

import { useTranslations, useLocale } from "next-intl";
import { GraduationCap, Clock, Award, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { dentists } from "@/data/clinic";
import { getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";

export default function AboutTeaser() {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;
  const isRTL = locale === "ar";

  const dentist = dentists[0];
  const name = getLocalizedField(dentist, "name", locale);
  const bioShort = getLocalizedField(dentist, "bioShort", locale);
  const university = getLocalizedField(dentist, "university", locale);
  const specialties = locale === "ar" ? dentist.specialtiesAr : dentist.specialtiesFr;

  return (
    <section className="section-padding bg-gray-50" id="about">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Photo placeholder */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Background decorative element */}
              <div className="absolute -inset-6 bg-primary/5 rounded-3xl rotate-3" />
              <div className="absolute -inset-6 bg-accent/5 rounded-3xl -rotate-2" />

              {/* Main photo placeholder */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-xl border border-primary-100/50">
                <img 
                  src={dentist.photoUrl} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />

                {/* Decorative pattern */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
              </div>

              {/* Floating accepting patients badge */}
              {dentist.isAcceptingPatients && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-5 py-3 border border-accent-100">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
                    </span>
                    <span className="text-sm font-medium text-accent-700 whitespace-nowrap">
                      {t("acceptingPatients")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Text content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
              {t("title")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-2">{name}</h2>
            <p className="text-lg text-gray-500 mb-6">
              {locale === "ar" ? "جراح أسنان متخصص في طب الأسنان التجميلي" : "Chirurgien-dentiste spécialisée en dentisterie esthétique"}
            </p>

            {/* Bio */}
            <p className="text-gray-600 leading-relaxed mb-8">{bioShort}</p>

            {/* Credentials */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">{university}</p>
                  <p className="text-xs text-gray-500">{t("graduatedFrom")} - {dentist.graduationYear}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    {dentist.yearsExperience}+ {locale === "ar" ? "سنوات خبرة" : "ans d'expérience"}
                  </p>
                  <p className="text-xs text-gray-500">{t("experience")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    {dentist.qualifications.length} {locale === "ar" ? "شهادات" : "diplômes"}
                  </p>
                  <p className="text-xs text-gray-500">{t("qualifications")}</p>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-8">
              <p className="text-sm font-medium text-secondary-700 mb-3">{t("specialties")}</p>
              <div className="flex flex-wrap gap-2">
                {specialties.slice(0, 5).map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="text-xs px-3 py-1"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link href="/about">
              <Button
                variant="default"
                size="lg"
                iconRight={
                  isRTL ? (
                    <ArrowLeft className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )
                }
              >
                {locale === "ar" ? "المزيد عن الدكتورة" : "En savoir plus"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
