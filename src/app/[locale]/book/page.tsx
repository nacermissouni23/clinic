"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Home,
  Calendar,
  User,
  Stethoscope,
  Sparkles,
  SmilePlus,
  Syringe,
  Baby,
  HeartPulse,
  Crown,
  Wrench,
  Gem,
  Sun,
  Scan,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { services, clinic } from "@/data/clinic";
import { getLocalizedField, getWhatsAppLink, formatPrice, cn } from "@/lib/utils";
import type { Locale, Service } from "@/types";

/* ------------------------------------------------------------------ */
/*  Icon map                                                           */
/* ------------------------------------------------------------------ */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
  Sparkles,
  SmilePlus,
  Syringe,
  Baby,
  HeartPulse,
  Crown,
  Wrench,
  Gem,
  Sun,
  Scan,
  AlertCircle,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getNext7Days(locale: Locale): { date: Date; dayName: string; dateStr: string; iso: string }[] {
  const days: { date: Date; dayName: string; dateStr: string; iso: string }[] = [];
  const now = new Date();

  for (let i = 1; days.length < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    // Skip Friday (day 5)
    if (d.getDay() === 5) continue;

    const dayName = d.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      weekday: "short",
    });
    const dateStr = d.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ", {
      day: "numeric",
      month: "short",
    });
    const iso = d.toISOString().split("T")[0];

    days.push({ date: d, dayName, dateStr, iso });
  }

  return days;
}

const MORNING_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
];
const AFTERNOON_SLOTS = [
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

function generateRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RDV-${code}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BookingPage() {
  const t = useTranslations("booking");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tServices = useTranslations("services");
  const locale = useLocale() as Locale;

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const bookableServices = services.filter(
    (s) => s.isActive && s.isBookableOnline
  );

  const availableDays = useMemo(() => getNext7Days(locale), [locale]);

  // Step 3 form
  const bookingSchema = z.object({
    name: z.string().min(2, tErrors("nameRequired")),
    phone: z
      .string()
      .min(9, tErrors("phoneRequired"))
      .regex(/^(0|\+213)[0-9\s]{8,}$/, tErrors("invalidPhone")),
    notes: z.string().optional(),
    whatsappOptIn: z.boolean().optional(),
  });

  type BookingForm = z.infer<typeof bookingSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      whatsappOptIn: true,
    },
  });

  const onSubmit = async (_data: BookingForm): Promise<void> => {
    void _data;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setRefNumber(generateRef());
    setConfirmed(true);
  };

  const selectedDateObj = availableDays.find((d) => d.iso === selectedDate);

  const formatSelectedDate = () => {
    if (!selectedDateObj) return "";
    return selectedDateObj.date.toLocaleDateString(
      locale === "ar" ? "ar-DZ" : "fr-DZ",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    );
  };

  /* ------------------------------------------------------------------ */
  /*  Progress indicator                                                 */
  /* ------------------------------------------------------------------ */

  const steps = [
    { num: 1, label: t("steps.service"), icon: Stethoscope },
    { num: 2, label: t("steps.date"), icon: Calendar },
    { num: 3, label: t("steps.info"), icon: User },
  ];

  const ProgressIndicator = () => (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((s, i) => {
        const isComplete = confirmed ? true : step > s.num;
        const isCurrent = !confirmed && step === s.num;
        const StepIcon = s.icon;

        return (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  isComplete
                    ? "border-primary bg-primary text-white"
                    : isCurrent
                    ? "border-primary bg-primary-50 text-primary"
                    : "border-gray-300 bg-white text-gray-400"
                )}
              >
                {isComplete ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-[10px] font-medium sm:text-xs",
                  isCurrent ? "text-primary" : isComplete ? "text-primary" : "text-gray-400"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-8 sm:w-16 transition-all",
                  step > s.num || confirmed ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Step 1: Choose Service                                             */
  /* ------------------------------------------------------------------ */

  const Step1 = () => (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {t("steps.service")}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {bookableServices.map((service) => {
          const Icon = iconMap[service.icon] || Stethoscope;
          const isSelected = selectedService?.id === service.id;
          const name = getLocalizedField(service, "name", locale);
          const desc = getLocalizedField(service, "descriptionShort", locale);

          return (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={cn(
                "flex flex-col rounded-xl border-2 p-4 text-start transition-all",
                "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                isSelected
                  ? "border-primary bg-primary-50/50 shadow-md"
                  : "border-gray-100 bg-white",
                service.isEmergency && "border-amber-200 bg-amber-50/30"
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    isSelected
                      ? "bg-primary text-white"
                      : service.isEmergency
                      ? "bg-amber-100 text-amber-700"
                      : "bg-primary-50 text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 text-sm">
                    {name}
                  </span>
                  {service.isEmergency && (
                    <Badge variant="warning" className="ltr:ml-2 rtl:mr-2 text-[10px]">
                      {locale === "ar" ? "طوارئ" : "Urgence"}
                    </Badge>
                  )}
                </div>
                {isSelected && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <p className="mb-2 text-xs text-gray-500 line-clamp-2">{desc}</p>
              <div className="mt-auto flex items-center gap-3 text-xs text-gray-600">
                {service.priceFrom && (
                  <span className="font-medium text-primary">
                    {tServices("priceFrom")} {formatPrice(service.priceFrom)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {service.durationMinutes} {tServices("minutes")}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          size="lg"
          disabled={!selectedService}
          onClick={() => setStep(2)}
          iconRight={
            locale === "ar" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          }
        >
          {tCommon("next")}
        </Button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Step 2: Choose Date & Time                                         */
  /* ------------------------------------------------------------------ */

  const Step2 = () => (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {t("steps.date")}
      </h2>

      {/* Date Selection */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-gray-700">
          {t("form.selectDate")}
        </p>
        <div className="flex flex-wrap gap-2">
          {availableDays.map((day) => (
            <button
              key={day.iso}
              onClick={() => {
                setSelectedDate(day.iso);
                setSelectedTime("");
              }}
              className={cn(
                "flex min-w-[80px] flex-col items-center rounded-xl border-2 px-3 py-3 transition-all",
                "hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                selectedDate === day.iso
                  ? "border-primary bg-primary text-white shadow-md"
                  : "border-gray-100 bg-white text-gray-700"
              )}
            >
              <span className="text-xs font-medium">{day.dayName}</span>
              <span className="mt-0.5 text-sm font-bold">{day.dateStr}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-4">
          {/* Morning */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              {t("morning")}
            </p>
            <div className="flex flex-wrap gap-2">
              {MORNING_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={cn(
                    "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
                    "hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                    selectedTime === slot
                      ? "border-primary bg-primary text-white"
                      : "border-gray-100 bg-white text-gray-700"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Afternoon */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              {t("afternoon")}
            </p>
            <div className="flex flex-wrap gap-2">
              {AFTERNOON_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={cn(
                    "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all",
                    "hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                    selectedTime === slot
                      ? "border-primary bg-primary text-white"
                      : "border-gray-100 bg-white text-gray-700"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(1)}
          iconLeft={
            locale === "ar" ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )
          }
        >
          {tCommon("previous")}
        </Button>
        <Button
          size="lg"
          disabled={!selectedDate || !selectedTime}
          onClick={() => setStep(3)}
          iconRight={
            locale === "ar" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          }
        >
          {tCommon("next")}
        </Button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Step 3: Your Information                                           */
  /* ------------------------------------------------------------------ */

  const Step3 = () => (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {t("steps.info")}
      </h2>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <form
            id="booking-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <Input
              label={t("form.name")}
              placeholder={t("form.namePlaceholder")}
              error={errors.name?.message}
              fullWidth
              {...register("name")}
            />

            <Input
              label={t("form.phone")}
              placeholder={t("form.phonePlaceholder")}
              type="tel"
              phonePrefix
              error={errors.phone?.message}
              fullWidth
              {...register("phone")}
            />

            <Textarea
              label={t("form.notes")}
              placeholder={t("form.notesPlaceholder")}
              fullWidth
              {...register("notes")}
            />

            {/* WhatsApp opt-in */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                defaultChecked
                {...register("whatsappOptIn")}
              />
              <span className="text-sm text-gray-600">
                {locale === "ar"
                  ? "أوافق على استلام تأكيد الموعد عبر واتساب"
                  : "J'accepte de recevoir la confirmation du rendez-vous par WhatsApp"}
              </span>
            </label>
          </form>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-2">
          <Card className="border-primary-100 bg-primary-50/30">
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                {t("summary")}
              </h3>
              <div className="space-y-3 text-sm">
                {selectedService && (
                  <div className="flex items-start gap-2">
                    <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("steps.service")}
                      </p>
                      <p className="font-medium text-gray-900">
                        {getLocalizedField(selectedService, "name", locale)}
                      </p>
                    </div>
                  </div>
                )}
                {selectedDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("selectedDate")}
                      </p>
                      <p className="font-medium text-gray-900">
                        {formatSelectedDate()}
                      </p>
                    </div>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("selectedTime")}
                      </p>
                      <p className="font-medium text-gray-900">{selectedTime}</p>
                    </div>
                  </div>
                )}
                {selectedService?.priceFrom && (
                  <div className="border-t border-primary-100 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {tServices("priceFrom")}
                      </span>
                      <span className="font-semibold text-primary">
                        {formatPrice(selectedService.priceFrom)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(2)}
          iconLeft={
            locale === "ar" ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )
          }
        >
          {tCommon("previous")}
        </Button>
        <Button
          type="submit"
          form="booking-form"
          size="lg"
          loading={isSubmitting}
        >
          {t("submit")}
        </Button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Confirmation                                                       */
  /* ------------------------------------------------------------------ */

  const Confirmation = () => {
    const whatsappMessage =
      locale === "ar"
        ? `مرحباً، لقد حجزت موعداً عبر الموقع. المرجع: ${refNumber}`
        : `Bonjour, j'ai pris rendez-vous via le site. Référence : ${refNumber}`;
    const whatsappUrl = getWhatsAppLink(clinic.whatsappNumber, whatsappMessage);

    return (
      <div className="flex flex-col items-center py-6 text-center">
        {/* Success icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-[scale-in_0.3s_ease-out]">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {t("success.title")}
        </h2>
        <p className="mt-2 text-gray-600">{t("success.message")}</p>

        {/* Reference */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
          <span className="text-sm text-gray-500">
            {locale === "ar" ? "المرجع" : "Référence"}:
          </span>
          <span className="font-mono text-lg font-bold text-primary">
            {refNumber}
          </span>
        </div>

        {/* Summary */}
        <Card className="mt-6 w-full max-w-md">
          <CardContent className="p-5 text-start">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              {t("summary")}
            </h3>
            <div className="space-y-2.5 text-sm">
              {selectedService && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("steps.service")}</span>
                  <span className="font-medium text-gray-900">
                    {getLocalizedField(selectedService, "name", locale)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">{t("selectedDate")}</span>
                <span className="font-medium text-gray-900">
                  {formatSelectedDate()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("selectedTime")}</span>
                <span className="font-medium text-gray-900">{selectedTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp message */}
        <p className="mt-4 text-sm text-gray-500">
          {locale === "ar"
            ? "سنتواصل معك عبر واتساب لتأكيد الموعد"
            : "Nous vous contacterons sur WhatsApp pour confirmer le rendez-vous"}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="whatsapp"
              size="lg"
              iconLeft={<MessageCircle className="h-5 w-5" />}
            >
              WhatsApp
            </Button>
          </a>
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              iconLeft={<Home className="h-5 w-5" />}
            >
              {locale === "ar" ? "العودة للرئيسية" : "Retour à l'accueil"}
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Progress */}
        <ProgressIndicator />

        {/* Content Card */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            {confirmed ? (
              <Confirmation />
            ) : step === 1 ? (
              <Step1 />
            ) : step === 2 ? (
              <Step2 />
            ) : (
              <Step3 />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
