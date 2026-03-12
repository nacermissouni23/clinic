"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { galleryItems, services } from "@/data/clinic";
import { getLocalizedField, cn } from "@/lib/utils";
import { Locale, GalleryItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, ZoomIn } from "lucide-react";

type GalleryCategory = "all" | "cosmetic" | "surgery" | "orthodontics" | "general";
type JawFilter = "all" | "upper" | "lower" | "both";

const galleryCategories: GalleryCategory[] = [
  "all",
  "cosmetic",
  "surgery",
  "orthodontics",
  "general",
];

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const tServices = useTranslations("services");
  const locale = useLocale() as Locale;

  const [jawFilter, setJawFilter] = useState<JawFilter>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const visibleItems = galleryItems.filter((item) => item.isVisible);

  const getCategoryLabel = (cat: GalleryCategory): string => {
    if (cat === "all") return t("filters.all");
    return tServices(`categories.${cat}.name`);
  };

  const getJawLabel = (jaw: JawFilter): string => {
    switch (jaw) {
      case "all":
        return t("filters.all");
      case "upper":
        return t("filters.upperJaw");
      case "lower":
        return t("filters.lowerJaw");
      case "both":
        return t("filters.bothJaws");
    }
  };

  const filterByJaw = (items: GalleryItem[]): GalleryItem[] => {
    if (jawFilter === "all") return items;
    return items.filter((item) => item.jawPosition === jawFilter);
  };

  const openDialog = (item: GalleryItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const renderGalleryGrid = (items: GalleryItem[]) => {
    const filtered = filterByJaw(items);

    if (filtered.length === 0) {
      return (
        <div className="py-16 text-center text-gray-500">
          <p className="text-lg">{t("noPhotos")}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const title = getLocalizedField(item, "title", locale);
          const relatedService = services.find(
            (s) => s.id === item.serviceId
          );
          const treatmentName = relatedService
            ? getLocalizedField(relatedService, "name", locale)
            : "";

          return (
            <div
              key={item.id}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              onClick={() => openDialog(item)}
            >
              {/* Before/After Images */}
              <div className="relative grid grid-cols-2">
                {/* Before */}
                <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-amber-300 via-orange-200 to-yellow-300">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className="relative rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    {t("before")}
                  </span>
                </div>

                {/* Divider */}
                <div className="absolute top-0 bottom-0 left-1/2 z-10 w-0.5 -translate-x-1/2 bg-white" />

                {/* After */}
                <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-primary-300 via-accent-200 to-primary-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  <span className="relative rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    {t("after")}
                  </span>
                </div>

                {/* Zoom overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="mb-1 font-semibold text-secondary-800">
                  {title}
                </h3>
                {treatmentName && (
                  <p className="text-sm text-gray-500">{treatmentName}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="default" className="text-xs">
                    {tServices(`categories.${item.category}.name`)}
                  </Badge>
                  {item.jawPosition && (
                    <Badge variant="outline" className="text-xs">
                      {item.jawPosition === "upper"
                        ? t("filters.upperJaw")
                        : item.jawPosition === "lower"
                          ? t("filters.lowerJaw")
                          : t("filters.bothJaws")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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

      {/* Filters & Grid */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="all" variant="pills">
            {/* Category tabs */}
            <div className="mb-6 overflow-x-auto pb-2">
              <TabsList className="flex-nowrap whitespace-nowrap">
                {galleryCategories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Jaw position filter */}
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-500">
                {t("filters.category")}:
              </span>
              {(["all", "upper", "lower", "both"] as JawFilter[]).map(
                (jaw) => (
                  <button
                    key={jaw}
                    onClick={() => setJawFilter(jaw)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                      jawFilter === jaw
                        ? "bg-secondary-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {getJawLabel(jaw)}
                  </button>
                )
              )}
            </div>

            {/* All items */}
            <TabsContent value="all">
              {renderGalleryGrid(visibleItems)}
            </TabsContent>

            {/* Category-specific */}
            {galleryCategories
              .filter((c) => c !== "all")
              .map((cat) => {
                const filtered = visibleItems.filter(
                  (item) => item.category === cat
                );
                return (
                  <TabsContent key={cat} value={cat}>
                    {renderGalleryGrid(filtered)}
                  </TabsContent>
                );
              })}
          </Tabs>
        </div>
      </section>

      {/* Patient Consent Notice */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 rounded-xl bg-accent-50 p-4 text-accent-800 border border-accent-200">
            <ShieldCheck className="h-6 w-6 shrink-0 text-accent-600" />
            <p className="text-sm font-medium">
              {t("patientConsent")}
            </p>
          </div>
        </div>
      </section>

      {/* Dialog for expanded view */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {getLocalizedField(selectedItem, "title", locale)}
                </DialogTitle>
                <DialogDescription>
                  {getLocalizedField(selectedItem, "description", locale)}
                </DialogDescription>
              </DialogHeader>

              {/* Side-by-side comparison */}
              <div className="relative mt-4 grid grid-cols-2 overflow-hidden rounded-xl">
                {/* Before */}
                <div className="relative flex h-56 flex-col items-center justify-center bg-gradient-to-br from-amber-300 via-orange-200 to-yellow-300 sm:h-72">
                  <span className="mb-2 rounded-full bg-black/40 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                    {t("before")}
                  </span>
                </div>

                {/* Vertical divider */}
                <div className="absolute top-0 bottom-0 left-1/2 z-10 w-1 -translate-x-1/2 bg-white shadow-md" />

                {/* After */}
                <div className="relative flex h-56 flex-col items-center justify-center bg-gradient-to-br from-primary-300 via-accent-200 to-primary-200 sm:h-72">
                  <span className="mb-2 rounded-full bg-black/40 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                    {t("after")}
                  </span>
                </div>
              </div>

              {/* Case details */}
              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase">
                    {t("treatment")}
                  </h4>
                  <p className="text-secondary-800 font-medium">
                    {(() => {
                      const relService = services.find(
                        (s) => s.id === selectedItem.serviceId
                      );
                      return relService
                        ? getLocalizedField(relService, "name", locale)
                        : "-";
                    })()}
                  </p>
                </div>

                {selectedItem.jawPosition && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase">
                      {locale === "ar" ? "الموقع" : "Position"}
                    </h4>
                    <p className="text-secondary-800">
                      {selectedItem.jawPosition === "upper"
                        ? t("filters.upperJaw")
                        : selectedItem.jawPosition === "lower"
                          ? t("filters.lowerJaw")
                          : t("filters.bothJaws")}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-2 text-xs text-accent-700">
                  <ShieldCheck className="h-4 w-4" />
                  {t("patientConsent")}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
