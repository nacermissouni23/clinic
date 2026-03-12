"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { dentists } from "@/data/clinic";
import { getLocalizedField } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Locale } from "@/types";
import {
  Calendar,
  GraduationCap,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Armchair,
  Monitor,
  Wrench,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;
  const isRtl = locale === "ar";

  const dentist = dentists[0];
  const name = getLocalizedField(dentist, "name", locale);
  const bioFull = getLocalizedField(dentist, "bioFull", locale);
  const university = getLocalizedField(dentist, "university", locale);
  const specialties =
    locale === "ar" ? dentist.specialtiesAr : dentist.specialtiesFr;

  // Clinic interior sections
  const clinicSpaces = [
    {
      labelFr: "Salle de soins",
      labelAr: "غرفة العلاج",
      icon: Armchair,
      gradient: "from-primary-400 via-primary-500 to-secondary-500",
    },
    {
      labelFr: "Réception",
      labelAr: "الاستقبال",
      icon: Monitor,
      gradient: "from-secondary-400 via-secondary-500 to-primary-600",
    },
    {
      labelFr: "Équipement",
      labelAr: "التجهيزات",
      icon: Wrench,
      gradient: "from-accent-400 via-primary-500 to-secondary-500",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Dentist Profile Section */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-10">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
              {/* Photo Placeholder */}
              <div className="shrink-0">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-secondary-600 shadow-xl sm:h-52 sm:w-52">
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-white/30" />
                  {/* Tooth icon */}
                  <svg
                    viewBox="0 0 64 64"
                    className="h-20 w-20 text-white/90"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M32 4C24 4 18 8 16 14c-2 6-1 14 2 20 2 4 4 10 5 16 1 4 3 6 5 6s4-2 4-6V38h0v12c0 4 2 6 4 6s4-2 5-6c1-6 3-12 5-16 3-6 4-14 2-20C41 8 38 4 32 4z" />
                  </svg>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center lg:text-start">
                <h2 className="mb-2 text-2xl font-bold text-secondary-900 sm:text-3xl">
                  {name}
                </h2>

                {/* Key Stats */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{university}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">
                      {dentist.graduationYear}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-primary-700">
                      {t("yearsOfExperience", {
                        count: dentist.yearsExperience,
                      })}
                    </span>
                  </div>
                </div>

                {/* Accepting patients badge */}
                <div className="mb-6">
                  {dentist.isAcceptingPatients ? (
                    <Badge variant="success" className="px-3 py-1 text-sm">
                      <CheckCircle className="me-1.5 h-4 w-4" />
                      {t("acceptingPatients")}
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="px-3 py-1 text-sm">
                      <XCircle className="me-1.5 h-4 w-4" />
                      {t("notAcceptingPatients")}
                    </Badge>
                  )}
                </div>

                {/* Bio */}
                <div className="mb-6 space-y-3 leading-relaxed text-gray-700">
                  {bioFull.split("\n\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Specialties */}
                <div className="mb-2">
                  <h3 className="mb-3 text-lg font-semibold text-secondary-800">
                    {t("specialties")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty, idx) => (
                      <Badge
                        key={idx}
                        variant="default"
                        className="px-3 py-1.5 text-sm"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications Timeline */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-secondary-900 sm:text-3xl">
            {t("qualifications")}
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div
              className={`absolute top-0 bottom-0 w-0.5 bg-primary-200 ${
                isRtl ? "right-6 sm:right-1/2" : "left-6 sm:left-1/2"
              }`}
            />

            <div className="space-y-8">
              {dentist.qualifications.map((qual, idx) => {
                const institution = getLocalizedField(
                  qual,
                  "institution",
                  locale
                );
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={idx}
                    className={`relative flex items-start gap-4 ${
                      isRtl
                        ? "sm:flex-row-reverse"
                        : ""
                    }`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg ${
                        isRtl ? "right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2" : "left-0 sm:left-1/2 sm:-translate-x-1/2"
                      }`}
                    >
                      <Award className="h-5 w-5" />
                    </div>

                    {/* Content card */}
                    <div
                      className={`w-full rounded-xl bg-white p-5 shadow-md ${
                        isRtl
                          ? "me-16 sm:me-0 sm:w-[calc(50%-2rem)]"
                          : "ms-16 sm:ms-0 sm:w-[calc(50%-2rem)]"
                      } ${
                        isRtl
                          ? isEven
                            ? "sm:me-auto sm:ms-0"
                            : "sm:ms-auto sm:me-0"
                          : isEven
                            ? "sm:ms-0 sm:me-auto"
                            : "sm:ms-auto sm:me-0"
                      }`}
                    >
                      <div className="mb-1 inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
                        {qual.year}
                      </div>
                      <h4 className="mb-1 text-lg font-semibold text-secondary-900">
                        {qual.degree}
                      </h4>
                      <p className="text-sm text-gray-600">{institution}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-br from-primary-50 via-white to-accent-50 p-8 text-center shadow-sm sm:p-12">
            <h2 className="mb-4 text-2xl font-bold text-secondary-900 sm:text-3xl">
              {t("philosophy")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700">
              {t("philosophyText")}
            </p>
          </div>
        </div>
      </section>

      {/* Clinic Interior Section */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-secondary-900 sm:text-3xl">
            {locale === "ar" ? "العيادة" : "Notre cabinet"}
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {clinicSpaces.map((space, idx) => (
              <div
                key={idx}
                className="group overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className={`flex h-52 items-center justify-center bg-gradient-to-br ${space.gradient}`}
                >
                  <space.icon className="h-16 w-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="bg-white p-4 text-center">
                  <h3 className="font-semibold text-secondary-800">
                    {locale === "ar" ? space.labelAr : space.labelFr}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-700 p-8 shadow-xl sm:p-12">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
              {locale === "ar"
                ? `احجز موعدك مع ${name}`
                : `Prendre rendez-vous avec ${dentist.nameFr}`}
            </h2>
            <p className="mb-8 text-primary-100">
              {locale === "ar"
                ? "نستقبلكم بكل سرور لتقديم أفضل رعاية لأسنانكم"
                : "Nous vous accueillons avec plaisir pour prendre soin de votre sourire"}
            </p>
            <Link href="/book">
              <Button
                size="xl"
                className="bg-white text-primary-700 hover:bg-gray-100 shadow-lg"
                iconLeft={<Calendar className="h-5 w-5" />}
              >
                {locale === "ar"
                  ? `حجز موعد مع ${name}`
                  : `Prendre rendez-vous avec ${dentist.nameFr}`}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
