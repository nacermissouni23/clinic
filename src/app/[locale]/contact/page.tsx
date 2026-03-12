"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Navigation,
  CheckCircle2,
  Send,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { clinic, services } from "@/data/clinic";
import { getLocalizedField, getWhatsAppLink, isClinicOpen, cn } from "@/lib/utils";
import type { Locale } from "@/types";

const DAY_KEYS = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"] as const;
const DAY_MAP: Record<string, string> = {
  saturday: "sat",
  sunday: "sun",
  monday: "mon",
  tuesday: "tue",
  wednesday: "wed",
  thursday: "thu",
  friday: "fri",
};

export default function ContactPage() {
  const t = useTranslations("contact");
  const tErrors = useTranslations("errors");
  const tCommon = useTranslations("common");
  const tBooking = useTranslations("booking");
  const locale = useLocale() as Locale;

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactSchema = z.object({
    name: z.string().min(2, tErrors("nameRequired")),
    phone: z
      .string()
      .min(9, tErrors("phoneRequired"))
      .regex(/^(0|\+213)[0-9\s]{8,}$/, tErrors("invalidPhone")),
    email: z
      .string()
      .email(tErrors("invalidEmail"))
      .optional()
      .or(z.literal("")),
    preferredLanguage: z.enum(["ar", "fr"]),
    preferredDay: z.string().optional(),
    preferredTime: z.string().optional(),
    treatmentRequired: z.string().optional(),
    message: z.string().optional(),
  });

  type ContactForm = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      preferredLanguage: locale,
    },
  });

  const onSubmit = async (_data: ContactForm): Promise<void> => {
    void _data;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const clinicName = getLocalizedField(clinic, "name", locale);
  const address = getLocalizedField(clinic, "address", locale);
  const open = isClinicOpen(clinic.operatingHours, clinic.timezone);
  const directionsUrl = `https://www.google.com/maps/dir//?api=1&destination=${clinic.latitude},${clinic.longitude}`;
  const whatsappUrl = getWhatsAppLink(clinic.whatsappNumber);

  const languageOptions = [
    { value: "ar", label: locale === "ar" ? "العربية" : "Arabe" },
    { value: "fr", label: locale === "ar" ? "الفرنسية" : "Français" },
  ];

  const dayOptions = DAY_KEYS
    .filter((d) => d !== "friday")
    .map((d) => ({
      value: d,
      label: t(`days.${d}`),
    }));

  const timeOptions = [
    { value: "morning", label: tBooking("morning") + " (09:00 - 12:30)" },
    { value: "afternoon", label: tBooking("afternoon") + " (14:00 - 18:00)" },
  ];

  const serviceOptions = services
    .filter((s) => s.isActive)
    .map((s) => ({
      value: s.id,
      label: getLocalizedField(s, "name", locale),
    }));

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT COLUMN - Clinic Info */}
          <div className="space-y-6">
            {/* Clinic Name & Basic Info */}
            <Card>
              <CardContent className="p-6 space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{clinicName}</h2>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("address")}
                    </p>
                    <p className="text-sm text-gray-600">{address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("phone")}
                    </p>
                    <a
                      href={`tel:${clinic.phonePrimary.replace(/\s/g, "")}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {clinic.phonePrimary}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#25D366]" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t("whatsapp")}
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#25D366] hover:underline"
                    >
                      {clinic.whatsappNumber}
                    </a>
                  </div>
                </div>

                {/* Email */}
                {clinic.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {t("email")}
                      </p>
                      <a
                        href={`mailto:${clinic.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {clinic.email}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    {t("openingHours")}
                  </CardTitle>
                  <Badge variant={open ? "success" : "danger"}>
                    {open ? tCommon("openNow") : tCommon("closedNow")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {DAY_KEYS.map((day) => {
                    const dayKey = DAY_MAP[day];
                    const hours = clinic.operatingHours[dayKey];
                    const isClosed = !hours || hours.length === 0;

                    return (
                      <div
                        key={day}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                          isClosed ? "bg-red-50/50" : "bg-gray-50"
                        )}
                      >
                        <span className="font-medium text-gray-700">
                          {t(`days.${day}`)}
                        </span>
                        <span
                          className={cn(
                            "text-sm",
                            isClosed ? "text-red-500" : "text-gray-600"
                          )}
                        >
                          {isClosed
                            ? t("closed")
                            : hours
                                .map((h) => `${h.open} - ${h.close}`)
                                .join(locale === "ar" ? " / " : " / ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            {clinic.emergencyPhone && (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-800">
                        {t("emergencyContact")}
                      </p>
                      <a
                        href={`tel:${clinic.emergencyPhone.replace(/\s/g, "")}`}
                        className="mt-1 block text-lg font-bold text-amber-900 hover:underline"
                      >
                        {clinic.emergencyPhone}
                      </a>
                      <p className="mt-1 text-xs text-amber-700">
                        {locale === "ar"
                          ? "متاح خلال ساعات العمل"
                          : "Disponible pendant les heures d'ouverture"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Get Directions */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                size="lg"
                fullWidth
                iconLeft={<Navigation className="h-5 w-5" />}
              >
                {t("getDirections")}
              </Button>
            </a>
          </div>

          {/* RIGHT COLUMN - Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("sendMessage")}</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("messageSent")}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {locale === "ar"
                        ? "سنتواصل معك في أقرب وقت ممكن."
                        : "Nous vous recontacterons dans les plus brefs délais."}
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                  >
                    {/* Name */}
                    <Input
                      label={tBooking("form.name")}
                      placeholder={tBooking("form.namePlaceholder")}
                      error={errors.name?.message}
                      fullWidth
                      {...register("name")}
                    />

                    {/* Phone */}
                    <Input
                      label={tBooking("form.phone")}
                      placeholder={tBooking("form.phonePlaceholder")}
                      type="tel"
                      error={errors.phone?.message}
                      fullWidth
                      {...register("phone")}
                    />

                    {/* Email */}
                    <Input
                      label={t("email")}
                      placeholder={
                        locale === "ar"
                          ? "example@email.com"
                          : "example@email.com"
                      }
                      type="email"
                      error={errors.email?.message}
                      fullWidth
                      {...register("email")}
                    />

                    {/* Preferred Language */}
                    <Select
                      label={
                        locale === "ar" ? "اللغة المفضّلة" : "Langue préférée"
                      }
                      options={languageOptions}
                      fullWidth
                      {...register("preferredLanguage")}
                    />

                    {/* Preferred Day */}
                    <Select
                      label={tBooking("form.preferredDate")}
                      options={dayOptions}
                      placeholder={
                        locale === "ar" ? "اختر اليوم" : "Choisir un jour"
                      }
                      fullWidth
                      {...register("preferredDay")}
                    />

                    {/* Preferred Time */}
                    <Select
                      label={tBooking("form.preferredTime")}
                      options={timeOptions}
                      placeholder={
                        locale === "ar" ? "اختر الوقت" : "Choisir un créneau"
                      }
                      fullWidth
                      {...register("preferredTime")}
                    />

                    {/* Treatment */}
                    <Select
                      label={
                        locale === "ar"
                          ? "العلاج المطلوب"
                          : "Traitement souhaité"
                      }
                      options={serviceOptions}
                      placeholder={tBooking("form.selectService")}
                      fullWidth
                      {...register("treatmentRequired")}
                    />

                    {/* Message */}
                    <Textarea
                      label={
                        locale === "ar" ? "رسالتك" : "Votre message"
                      }
                      placeholder={t("messagePlaceholder")}
                      fullWidth
                      {...register("message")}
                    />

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      fullWidth
                      loading={isSubmitting}
                      iconLeft={<Send className="h-4 w-4" />}
                    >
                      {t("sendMessage")}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <Card className="mt-8 overflow-hidden">
          <div className="relative flex min-h-[280px] flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100/50 to-teal-50 p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t("mapTitle")}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{address}</p>
            <p className="mt-1 text-xs text-gray-400">
              {clinic.latitude.toFixed(4)}, {clinic.longitude.toFixed(4)}
            </p>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              <Button
                variant="default"
                size="default"
                iconLeft={<Navigation className="h-4 w-4" />}
              >
                {t("getDirections")}
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </main>
  );
}
