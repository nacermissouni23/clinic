"use client";

import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { galleryItems } from "@/data/clinic";
import { getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";

export default function GalleryTeaser() {
  const tGallery = useTranslations("gallery");
  const locale = useLocale() as Locale;
  const isRTL = locale === "ar";

  const visibleItems = galleryItems.filter((g) => g.isVisible).slice(0, 3);
  const beforeLabel = tGallery("before");
  const afterLabel = tGallery("after");

  // Gradient pairs for placeholder styling
  const placeholderGradients = [
    { before: "from-gray-300 to-gray-400", after: "from-primary-300 to-primary-500" },
    { before: "from-gray-300 to-gray-400", after: "from-accent-300 to-accent-500" },
    { before: "from-gray-300 to-gray-400", after: "from-amber-300 to-amber-500" },
  ];

  return (
    <section className="section-padding bg-gray-50" id="gallery">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            {locale === "ar" ? "نتائجنا" : "Résultats"}
          </span>
          <h2 className="section-title">{tGallery("title")}</h2>
          <p className="section-subtitle">{tGallery("subtitle")}</p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visibleItems.map((item, index) => {
            const title = getLocalizedField(item, "title", locale);
            const description = getLocalizedField(item, "description", locale);
            const gradients = placeholderGradients[index % placeholderGradients.length];

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover"
              >
                {/* Before / After pair */}
                <div className="grid grid-cols-2 gap-0 relative">
                  {/* Before image placeholder */}
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradients.before} flex flex-col items-center justify-center`}>
                    <svg
                      viewBox="0 0 64 64"
                      className="w-10 h-10 text-white/40 mb-1"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M32 4c-7 0-12.5 2.5-16 7-3 3.8-4 8.5-3.5 13.5.5 5 2 10 4 15 2.5 6 5 11.5 7 16 1 2.2 2.5 3.5 4.5 3.5 2.5 0 3.5-2 4-5 .5-3 .5-6 0-9-.3-2 .3-3.5 2-3.5s2.3 1.5 2 3.5c-.5 3-.5 6 0 9 .5 3 1.5 5 4 5 2 0 3.5-1.3 4.5-3.5 2-4.5 4.5-10 7-16 2-5 3.5-10 4-15 .5-5-.5-9.7-3.5-13.5C48.5 6.5 39 4 32 4z" />
                    </svg>
                    <Badge className="bg-black/50 text-white border-0 text-[10px] backdrop-blur-sm">
                      {beforeLabel}
                    </Badge>
                  </div>

                  {/* Divider */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white z-10" />

                  {/* After image placeholder */}
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradients.after} flex flex-col items-center justify-center`}>
                    <Sparkles className="w-10 h-10 text-white/60 mb-1" />
                    <Badge className="bg-black/50 text-white border-0 text-[10px] backdrop-blur-sm">
                      {afterLabel}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 md:p-5">
                  <h3 className="font-semibold text-secondary-900 text-sm md:text-base mb-1">{title}</h3>
                  {description && (
                    <p className="text-xs md:text-sm text-gray-500 line-clamp-1">{description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-14">
          <Link href="/gallery">
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
              {locale === "ar" ? "عرض المعرض كاملاً" : "Voir toute la galerie"}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
