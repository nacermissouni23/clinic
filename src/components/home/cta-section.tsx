"use client";

import { useTranslations, useLocale } from "next-intl";
import { MessageCircle, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { clinic } from "@/data/clinic";
import { getWhatsAppLink } from "@/lib/utils";
import type { Locale } from "@/types";

export default function CTASection() {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;

  const whatsAppUrl = getWhatsAppLink(
    clinic.whatsappNumber,
    locale === "ar"
      ? "مرحباً، أريد حجز موعد في العيادة"
      : "Bonjour, je souhaite prendre rendez-vous"
  );

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-dental" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 section-padding">
        <div className="container-custom text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/15">
            <svg
              viewBox="0 0 64 64"
              className="w-9 h-9 text-white/80"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M32 4c-7 0-12.5 2.5-16 7-3 3.8-4 8.5-3.5 13.5.5 5 2 10 4 15 2.5 6 5 11.5 7 16 1 2.2 2.5 3.5 4.5 3.5 2.5 0 3.5-2 4-5 .5-3 .5-6 0-9-.3-2 .3-3.5 2-3.5s2.3 1.5 2 3.5c-.5 3-.5 6 0 9 .5 3 1.5 5 4 5 2 0 3.5-1.3 4.5-3.5 2-4.5 4.5-10 7-16 2-5 3.5-10 4-15 .5-5-.5-9.7-3.5-13.5C48.5 6.5 39 4 32 4z" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto">
            {locale === "ar"
              ? "احجز موعدك اليوم"
              : "Prenez rendez-vous aujourd'hui"}
          </h2>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
            {locale === "ar"
              ? "راسلنا عبر الواتساب أو احجز مباشرة عبر الموقع. نحن هنا لمساعدتك في الحصول على ابتسامة جميلة."
              : "Contactez-nous via WhatsApp ou réservez directement en ligne. Nous sommes là pour vous aider à obtenir un sourire radieux."}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="whatsapp"
                size="xl"
                fullWidth
                className="sm:w-auto shadow-xl shadow-[#25D366]/20"
                iconLeft={<MessageCircle className="h-5 w-5" />}
              >
                {t("ctaWhatsApp")}
              </Button>
            </a>
            <Link href="/book">
              <Button
                size="xl"
                fullWidth
                className="sm:w-auto bg-white text-secondary-900 hover:bg-gray-100 shadow-xl"
                iconLeft={<Calendar className="h-5 w-5" />}
              >
                {t("ctaBooking")}
              </Button>
            </Link>
          </div>

          {/* Phone number */}
          <a
            href={`tel:${clinic.phonePrimary.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <Phone className="h-4 w-4" />
            <span>{clinic.phonePrimary}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
