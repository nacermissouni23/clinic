"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";
import { clinic } from "@/data/clinic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Clock,
  MessageSquare,
  Users,
  Save,
  Shield,
} from "lucide-react";

// Day labels
const dayLabels: Record<string, { fr: string; ar: string }> = {
  sat: { fr: "Samedi", ar: "السبت" },
  sun: { fr: "Dimanche", ar: "الاحد" },
  mon: { fr: "Lundi", ar: "الاثنين" },
  tue: { fr: "Mardi", ar: "الثلاثاء" },
  wed: { fr: "Mercredi", ar: "الاربعاء" },
  thu: { fr: "Jeudi", ar: "الخميس" },
  fri: { fr: "Vendredi", ar: "الجمعة" },
};

export default function SettingsPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("settings.title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {locale === "ar"
            ? "ادارة اعدادات العيادة والحساب"
            : "Gerez les parametres de votre cabinet et de votre compte"}
        </p>
      </div>

      {/* Clinic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {t("settings.clinicInfo")}
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                {locale === "ar"
                  ? "المعلومات الاساسية عن العيادة"
                  : "Informations de base du cabinet"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={locale === "ar" ? "اسم العيادة (فرنسية)" : "Nom du cabinet (FR)"}
              defaultValue={clinic.nameFr}
              fullWidth
            />
            <Input
              label={locale === "ar" ? "اسم العيادة (عربية)" : "Nom du cabinet (AR)"}
              defaultValue={clinic.nameAr}
              fullWidth
            />
            <Input
              label={locale === "ar" ? "العنوان (فرنسية)" : "Adresse (FR)"}
              defaultValue={clinic.addressFr}
              fullWidth
            />
            <Input
              label={locale === "ar" ? "العنوان (عربية)" : "Adresse (AR)"}
              defaultValue={clinic.addressAr}
              fullWidth
            />
            <Input
              label={locale === "ar" ? "الهاتف الرئيسي" : "Telephone principal"}
              defaultValue={clinic.phonePrimary}
              fullWidth
            />
            <Input
              label="WhatsApp"
              defaultValue={clinic.whatsappNumber}
              fullWidth
            />
            <Input
              label={locale === "ar" ? "البريد الالكتروني" : "E-mail"}
              defaultValue={clinic.email || ""}
              type="email"
              fullWidth
            />
            <Input
              label={locale === "ar" ? "هاتف الطوارئ" : "Telephone d'urgence"}
              defaultValue={clinic.emergencyPhone || ""}
              fullWidth
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button>
              <Save className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
              {locale === "ar" ? "حفظ التغييرات" : "Enregistrer"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {locale === "ar" ? "اوقات العمل" : "Horaires d'ouverture"}
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                {locale === "ar"
                  ? "جدول عمل العيادة الاسبوعي"
                  : "Planning hebdomadaire du cabinet"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(clinic.operatingHours).map(([day, slots]) => {
              const label = dayLabels[day];
              if (!label) return null;
              const isClosed = !slots || slots.length === 0;

              return (
                <div
                  key={day}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg",
                    isClosed ? "bg-red-50/50" : "bg-gray-50"
                  )}
                >
                  <span className="w-24 text-sm font-medium text-gray-900 shrink-0">
                    {locale === "ar" ? label.ar : label.fr}
                  </span>
                  {isClosed ? (
                    <span className="text-sm text-red-500 font-medium">
                      {locale === "ar" ? "مغلق" : "Ferme"}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      {slots.map((slot, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="time"
                            defaultValue={slot.open}
                            className="h-9 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary"
                          />
                          <span className="text-gray-400 text-sm">-</span>
                          <input
                            type="time"
                            defaultValue={slot.close}
                            className="h-9 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary"
                          />
                          {i < slots.length - 1 && (
                            <span className="text-gray-300 mx-1">|</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <Button>
              <Save className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
              {locale === "ar" ? "حفظ الاوقات" : "Enregistrer les horaires"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {locale === "ar" ? "اعدادات واتساب" : "Parametres WhatsApp"}
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                {locale === "ar"
                  ? "اعداد واتساب للأعمال والقوالب"
                  : "Configuration WhatsApp Business et modeles de messages"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label={locale === "ar" ? "رقم واتساب للأعمال" : "Numero WhatsApp Business"}
              defaultValue={clinic.whatsappNumber}
              fullWidth
            />
            <Input
              label={locale === "ar" ? "رمز API" : "Token API WhatsApp"}
              type="password"
              defaultValue="whsec_xxxxxxxxxxxxxxxxxxxxx"
              fullWidth
              helperText={
                locale === "ar"
                  ? "الرمز السري للاتصال بواجهة واتساب للأعمال"
                  : "Token secret pour l'API WhatsApp Business"
              }
            />

            {/* Message templates */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                {locale === "ar" ? "قوالب الرسائل" : "Modeles de messages"}
              </h4>
              <div className="space-y-3">
                {/* Booking confirmation template */}
                <div className="p-4 bg-green-50/50 border border-green-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                      {locale === "ar"
                        ? "تأكيد الحجز"
                        : "Confirmation de reservation"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {locale === "ar"
                      ? "مرحبا {{name}}، تم تأكيد موعدك يوم {{date}} الساعة {{time}}. نتطلع لاستقبالكم! - عيادة د. بن سالم"
                      : "Bonjour {{name}}, votre rendez-vous est confirme pour le {{date}} a {{time}}. Nous avons hate de vous recevoir ! - Cabinet Dr. Bensalem"}
                  </p>
                </div>

                {/* 24h reminder template */}
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      {locale === "ar"
                        ? "تذكير قبل 24 ساعة"
                        : "Rappel 24h avant"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {locale === "ar"
                      ? "تذكير: لديك موعد غدا {{date}} الساعة {{time}} في عيادة د. بن سالم. في حالة تغيير يرجى الاتصال بنا."
                      : "Rappel : Vous avez un rendez-vous demain {{date}} a {{time}} au cabinet Dr. Bensalem. En cas d'empechement, merci de nous contacter."}
                  </p>
                </div>

                {/* Review request template */}
                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                      {locale === "ar" ? "طلب تقييم" : "Demande d'avis"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {locale === "ar"
                      ? "مرحبا {{name}}، شكرا لزيارتكم عيادة د. بن سالم. نرجو ان تكونوا راضين عن الخدمة. هل يمكنكم ترك تقييم على Google؟ {{link}}"
                      : "Bonjour {{name}}, merci pour votre visite au cabinet Dr. Bensalem. Nous esperons que vous etes satisfait(e). Pourriez-vous laisser un avis sur Google ? {{link}}"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>
              <Save className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
              {locale === "ar" ? "حفظ" : "Enregistrer"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {locale === "ar"
                  ? "ادارة المستخدمين"
                  : "Gestion des utilisateurs"}
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                {locale === "ar"
                  ? "اعضاء الفريق وصلاحياتهم"
                  : "Membres de l'equipe et leurs permissions"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Current user */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                AB
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Dr. Amira Bensalem
                </p>
                <p className="text-xs text-gray-500">
                  contact@dr-bensalem.dz
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 text-xs font-medium">
                <Shield className="w-3 h-3" />
                {locale === "ar" ? "مالكة" : "Proprietaire"}
              </span>
            </div>
          </div>

          {/* Add staff placeholder */}
          <div className="mt-4 p-6 border-2 border-dashed border-gray-200 rounded-lg text-center">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">
              {locale === "ar"
                ? "اضف اعضاء فريق للوصول الى لوحة التحكم"
                : "Ajoutez des membres d'equipe pour acceder au tableau de bord"}
            </p>
            <Button variant="outline" size="sm">
              {locale === "ar" ? "اضافة مستخدم" : "Ajouter un utilisateur"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
