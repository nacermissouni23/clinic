"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn, getLocalizedField } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/types";
import { appointments, services } from "@/data/clinic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Users,
  Plus,
  MessageSquare,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
  BarChart3,
} from "lucide-react";

// Helper to get service name by ID
function getServiceName(serviceId: string | undefined, locale: Locale): string {
  if (!serviceId) return "\u2014";
  const service = services.find((s) => s.id === serviceId);
  if (!service) return "\u2014";
  return getLocalizedField(service, "name", locale);
}

// Status badge variant mapping
function getStatusVariant(status: string): "default" | "success" | "warning" | "danger" | "outline" {
  switch (status) {
    case "pending_clinic_confirmation":
      return "warning";
    case "confirmed":
      return "success";
    case "completed":
      return "default";
    case "cancelled":
      return "danger";
    case "no_show":
      return "outline";
    default:
      return "outline";
  }
}

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const dateLocale = locale === "ar" ? undefined : fr;

  const now = new Date();

  // Calculate stats
  const todayAppts = appointments.filter((a) => {
    if (!a.scheduledStart) return false;
    return isToday(parseISO(a.scheduledStart));
  });

  const pendingAppts = appointments.filter(
    (a) => a.status === "pending_clinic_confirmation"
  );

  // This week: all appointments within 7 days
  const weekFromNow = new Date(now);
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const thisWeekAppts = appointments.filter((a) => {
    if (!a.scheduledStart) return false;
    const d = parseISO(a.scheduledStart);
    return d >= now && d <= weekFromNow;
  });

  const uniquePatients = new Set(appointments.map((a) => a.patientName));

  // Upcoming appointments (sorted by date, non-cancelled)
  const upcomingAppts = [...appointments]
    .filter(
      (a) =>
        a.scheduledStart &&
        a.status !== "cancelled"
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledStart!).getTime() -
        new Date(b.scheduledStart!).getTime()
    );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_clinic_confirmation":
        return t("appointments.status.pending");
      case "confirmed":
        return t("appointments.status.confirmed");
      case "completed":
        return t("appointments.status.completed");
      case "cancelled":
        return t("appointments.status.cancelled");
      case "no_show":
        return t("appointments.status.noShow");
      default:
        return status;
    }
  };

  const formatAppointmentDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) {
      return locale === "ar" ? "اليوم" : "Aujourd'hui";
    }
    if (isTomorrow(date)) {
      return locale === "ar" ? "غدا" : "Demain";
    }
    return format(date, "EEE d MMM", { locale: dateLocale });
  };

  // Stat cards data
  const statCards = [
    {
      label: t("dashboard.todayAppointments"),
      value: todayAppts.length,
      icon: Calendar,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: t("dashboard.pendingAppointments"),
      value: pendingAppts.length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: locale === "ar" ? "هذا الاسبوع" : "Cette semaine",
      value: thisWeekAppts.length,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: t("dashboard.totalPatients"),
      value: uniquePatients.size,
      icon: Users,
      color: "text-accent-600",
      bg: "bg-accent-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome message with today's date */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === "ar" ? "مرحبا د. بن سالم" : "Bonjour Dr. Bensalem"}
        </h1>
        <p className="text-gray-500 mt-1">
          {format(now, "EEEE d MMMM yyyy", { locale: dateLocale })}
        </p>
      </div>

      {/* Stats cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      stat.bg
                    )}
                  >
                    <Icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's appointments list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {t("dashboard.todayAppointments")}
            </CardTitle>
            <Link href="/admin/appointments">
              <Button variant="ghost" size="sm">
                {tc("seeMore")}
                <ArrowRight className="w-4 h-4 ltr:ml-1 rtl:mr-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingAppts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {t("appointments.noAppointments")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-start py-2.5 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === "ar" ? "الوقت" : "Heure"}
                    </th>
                    <th className="text-start py-2.5 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === "ar" ? "المريض" : "Patient"}
                    </th>
                    <th className="text-start py-2.5 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      {locale === "ar" ? "الخدمة" : "Service"}
                    </th>
                    <th className="text-start py-2.5 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === "ar" ? "الحالة" : "Statut"}
                    </th>
                    <th className="text-start py-2.5 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {upcomingAppts.slice(0, 6).map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400">
                            {formatAppointmentDate(apt.scheduledStart!)}
                          </span>
                          <span className="font-medium text-gray-900">
                            {format(parseISO(apt.scheduledStart!), "HH:mm")}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {apt.patientName}
                          </span>
                          {apt.isFirstVisit && (
                            <span className="text-xs text-primary-600">
                              {locale === "ar"
                                ? "زيارة اولى"
                                : "1ere visite"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 hidden sm:table-cell text-gray-600">
                        {getServiceName(apt.serviceId, locale)}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={getStatusVariant(apt.status)}>
                          {getStatusLabel(apt.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          {apt.status === "pending_clinic_confirmation" && (
                            <>
                              <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {apt.status === "confirmed" && (
                            <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent booking requests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {locale === "ar"
                ? "طلبات الحجز الاخيرة"
                : "Demandes de reservation recentes"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingAppts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                {locale === "ar"
                  ? "لا توجد طلبات في الانتظار"
                  : "Aucune demande en attente"}
              </p>
            ) : (
              <div className="space-y-3">
                {pendingAppts.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-amber-50/50 border border-amber-100 rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {apt.patientName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {getServiceName(apt.serviceId, locale)} &middot;{" "}
                        {apt.scheduledStart
                          ? format(parseISO(apt.scheduledStart), "d MMM, HH:mm", {
                              locale: dateLocale,
                            })
                          : "\u2014"}
                      </p>
                      {apt.patientNotes && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {apt.patientNotes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ltr:ml-3 rtl:mr-3">
                      <Button size="sm" className="h-8 px-3 text-xs">
                        {t("appointments.confirmAppointment")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                      >
                        {t("appointments.cancelAppointment")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {t("dashboard.quickActions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/admin/appointments">
                <Button
                  variant="outline"
                  fullWidth
                  className="justify-start gap-3 h-14"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">
                    {locale === "ar" ? "موعد جديد" : "Nouveau rendez-vous"}
                  </span>
                </Button>
              </Link>

              <Link href="/admin/messages">
                <Button
                  variant="outline"
                  fullWidth
                  className="justify-start gap-3 h-14"
                >
                  <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">
                    {locale === "ar" ? "ارسال رسالة" : "Envoyer un message"}
                  </span>
                </Button>
              </Link>

              <Link href="/admin/patients">
                <Button
                  variant="outline"
                  fullWidth
                  className="justify-start gap-3 h-14"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">
                    {locale === "ar" ? "عرض المرضى" : "Voir les patients"}
                  </span>
                </Button>
              </Link>

              <Link href="/admin/analytics">
                <Button
                  variant="outline"
                  fullWidth
                  className="justify-start gap-3 h-14"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">
                    {locale === "ar" ? "الاحصائيات" : "Statistiques"}
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
