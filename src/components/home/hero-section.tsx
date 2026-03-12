"use client";

import { useTranslations, useLocale } from "next-intl";
import { Phone, MessageCircle, Calendar, Clock, MapPin, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { clinic, dentists } from "@/data/clinic";
import { getLocalizedField, getWhatsAppLink } from "@/lib/utils";
import type { Locale } from "@/types";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;

  const clinicName = getLocalizedField(clinic, "name", locale);
  const dentist = dentists[0];
  const dentistName = getLocalizedField(dentist, "name", locale);
  const whatsAppUrl = getWhatsAppLink(
    clinic.whatsappNumber,
    locale === "ar"
      ? "مرحباً، أريد حجز موعد في العيادة"
      : "Bonjour, je souhaite prendre rendez-vous"
  );

  const reviewCount = locale === "ar" ? "١٢٧" : "127";

  return (
    <section className="relative min-h-[100dvh] bg-gradient-dental overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-start order-2 lg:order-1">
            {/* Clinic name as small label */}
            <div className="animate-fade-in-up">
              <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm mb-6 text-sm px-4 py-1.5">
                {clinicName}
              </Badge>
            </div>

            {/* Main headline */}
            <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t("headline")}
            </h1>

            {/* Subheadline / description */}
            <p className="animate-fade-in-up delay-200 text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              {t("subheadline")}
            </p>

            {/* Google rating badge */}
            <div className="animate-fade-in-up delay-300 flex items-center gap-3 mb-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/15">
                <div className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <RatingStars rating={4.8} size="sm" showValue={false} filledColor="text-amber-400" />
                </div>
                <span className="text-white font-semibold text-sm">4.8</span>
                <span className="text-white/70 text-sm">
                  ({reviewCount} {locale === "ar" ? "تقييم Google" : "avis Google"})
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6">
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="whatsapp"
                  size="lg"
                  fullWidth
                  className="sm:w-auto shadow-lg shadow-[#25D366]/25"
                  iconLeft={<MessageCircle className="h-5 w-5" />}
                >
                  {t("ctaWhatsApp")}
                </Button>
              </a>
              <Link href="/book">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  className="sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white"
                  iconLeft={<Calendar className="h-5 w-5" />}
                >
                  {t("ctaBooking")}
                </Button>
              </Link>
            </div>

            {/* Phone call link */}
            <div className="animate-fade-in-up delay-500">
              <a
                href={`tel:${clinic.phonePrimary.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>{clinic.phonePrimary}</span>
                <span className="mx-1">-</span>
                <span>{t("ctaCall")}</span>
              </a>
            </div>
          </div>

          {/* Right side - dentist photo placeholder */}
          <div className="order-1 lg:order-2 flex justify-center animate-fade-in-up delay-200">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary-400/20 to-accent/20 blur-xl" />

              {/* Photo placeholder */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-primary-400/30 to-secondary-700/50 border-4 border-white/15 backdrop-blur-sm flex flex-col items-center justify-center gap-4 shadow-2xl">
                {/* Tooth icon */}
                <svg
                  viewBox="0 0 64 64"
                  className="w-20 h-20 sm:w-24 sm:h-24 text-white/40"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M32 4c-7 0-12.5 2.5-16 7-3 3.8-4 8.5-3.5 13.5.5 5 2 10 4 15 2.5 6 5 11.5 7 16 1 2.2 2.5 3.5 4.5 3.5 2.5 0 3.5-2 4-5 .5-3 .5-6 0-9-.3-2 .3-3.5 2-3.5s2.3 1.5 2 3.5c-.5 3-.5 6 0 9 .5 3 1.5 5 4 5 2 0 3.5-1.3 4.5-3.5 2-4.5 4.5-10 7-16 2-5 3.5-10 4-15 .5-5-.5-9.7-3.5-13.5C48.5 6.5 39 4 32 4z" />
                </svg>
                <p className="text-white/50 text-sm font-medium">{dentistName}</p>
              </div>

              {/* Floating accent badges */}
              <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:-left-4 bg-white rounded-2xl shadow-xl px-4 py-3 animate-bounce-gentle">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Award className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-secondary-900">12+</p>
                    <p className="text-[10px] text-gray-500">
                      {locale === "ar" ? "سنوات خبرة" : "ans d'exp."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 sm:top-4 sm:-right-4 bg-white rounded-2xl shadow-xl px-4 py-3 animate-bounce-gentle delay-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                    <Star className="h-4 w-4 text-amber fill-amber" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-secondary-900">4.8/5</p>
                    <p className="text-[10px] text-gray-500">Google</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators bar */}
        <div className="animate-fade-in-up delay-500 mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-16">
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-white/80" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">12+</p>
                <p className="text-xs text-white/60">
                  {locale === "ar" ? "سنوات خبرة" : "ans d'expérience"}
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-white/15" />

            <div className="flex items-center gap-3 text-white/70">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">4.8/5</p>
                <p className="text-xs text-white/60">
                  {locale === "ar" ? "تقييم المرضى" : "note patients"}
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-white/15" />

            <div className="flex items-center gap-3 text-white/70">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white/80" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{clinic.commune}</p>
                <p className="text-xs text-white/60">{clinic.wilaya}</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-white/15" />

            <div className="flex items-center gap-3 text-white/70">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-white/80" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {locale === "ar" ? "السبت - الخميس" : "Sam - Jeu"}
                </p>
                <p className="text-xs text-white/60">09:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
