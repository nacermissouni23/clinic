"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn, getLocalizedField } from "@/lib/utils";
import type { Locale, Appointment } from "@/types";
import { appointments as allAppointments, services } from "@/data/clinic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  List,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Phone,
  Globe,
  MessageSquare,
  MapPin,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";

function getServiceName(serviceId: string | undefined, locale: Locale): string {
  if (!serviceId) return "\u2014";
  const service = services.find((s) => s.id === serviceId);
  if (!service) return "\u2014";
  return getLocalizedField(service, "name", locale);
}

function getStatusVariant(
  status: string
): "default" | "success" | "warning" | "danger" | "outline" {
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

function getChannelBadge(channel: string, locale: Locale) {
  const labels: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    website_form: {
      label: locale === "ar" ? "الموقع" : "Site web",
      icon: <Globe className="w-3 h-3" />,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    whatsapp: {
      label: "WhatsApp",
      icon: <MessageSquare className="w-3 h-3" />,
      className: "bg-green-50 text-green-700 border-green-200",
    },
    phone: {
      label: locale === "ar" ? "هاتف" : "Telephone",
      icon: <Phone className="w-3 h-3" />,
      className: "bg-purple-50 text-purple-700 border-purple-200",
    },
    walk_in: {
      label: locale === "ar" ? "بدون موعد" : "Sans RDV",
      icon: <MapPin className="w-3 h-3" />,
      className: "bg-gray-50 text-gray-700 border-gray-200",
    },
  };
  const info = labels[channel] || labels.phone;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border",
        info.className
      )}
    >
      {info.icon}
      {info.label}
    </span>
  );
}

export default function AppointmentsPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const dateLocale = locale === "ar" ? undefined : fr;

  // State
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([...allAppointments]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let result = [...appointmentsList];

    // Date filter
    const now = new Date();
    if (dateFilter === "today") {
      result = result.filter(
        (a) => a.scheduledStart && isToday(parseISO(a.scheduledStart))
      );
    } else if (dateFilter === "week") {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() + 7);
      result = result.filter((a) => {
        if (!a.scheduledStart) return false;
        const d = parseISO(a.scheduledStart);
        return d >= now && d <= weekEnd;
      });
    } else if (dateFilter === "month") {
      const monthEnd = new Date(now);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      result = result.filter((a) => {
        if (!a.scheduledStart) return false;
        const d = parseISO(a.scheduledStart);
        return d >= now && d <= monthEnd;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) =>
        a.patientName.toLowerCase().includes(q)
      );
    }

    // Sort by date
    result.sort(
      (a, b) =>
        new Date(a.scheduledStart || a.createdAt).getTime() -
        new Date(b.scheduledStart || b.createdAt).getTime()
    );

    return result;
  }, [appointmentsList, dateFilter, statusFilter, searchQuery]);

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

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return locale === "ar" ? "اليوم" : "Aujourd'hui";
    if (isTomorrow(date)) return locale === "ar" ? "غدا" : "Demain";
    return format(date, "EEE d MMM", { locale: dateLocale });
  };

  // Status change handlers
  const updateStatus = (id: string, newStatus: Appointment["status"]) => {
    setAppointmentsList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // Status filter options
  const statusOptions = [
    { value: "all", label: locale === "ar" ? "جميع الحالات" : "Tous les statuts" },
    { value: "pending_clinic_confirmation", label: t("appointments.status.pending") },
    { value: "confirmed", label: t("appointments.status.confirmed") },
    { value: "completed", label: t("appointments.status.completed") },
    { value: "cancelled", label: t("appointments.status.cancelled") },
    { value: "no_show", label: t("appointments.status.noShow") },
  ];

  const dateOptions = [
    { value: "all", label: locale === "ar" ? "جميع التواريخ" : "Toutes les dates" },
    { value: "today", label: locale === "ar" ? "اليوم" : "Aujourd'hui" },
    { value: "week", label: locale === "ar" ? "هذا الاسبوع" : "Cette semaine" },
    { value: "month", label: locale === "ar" ? "هذا الشهر" : "Ce mois" },
  ];

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: getLocalizedField(s, "name", locale),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("appointments.title")}
        </h1>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <List className="w-4 h-4" />
              {locale === "ar" ? "قائمة" : "Liste"}
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "calendar"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Calendar className="w-4 h-4" />
              {locale === "ar" ? "تقويم" : "Calendrier"}
            </button>
          </div>
          <Button onClick={() => setShowNewDialog(true)}>
            <Plus className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
            {locale === "ar" ? "موعد جديد" : "Nouveau RDV"}
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={
                  locale === "ar"
                    ? "بحث عن مريض..."
                    : "Rechercher un patient..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary"
              />
            </div>

            {/* Date filter */}
            <Select
              options={dateOptions}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-44"
            />

            {/* Status filter */}
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointments table */}
      <Card>
        <CardContent className="p-0">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {t("appointments.noAppointments")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === "ar" ? "التاريخ/الوقت" : "Date/Heure"}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === "ar" ? "المريض" : "Patient"}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      {locale === "ar" ? "الخدمة" : "Service"}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      {locale === "ar" ? "القناة" : "Canal"}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === "ar" ? "الحالة" : "Statut"}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAppointments.map((apt) => (
                    <>
                      <tr
                        key={apt.id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() =>
                          setExpandedId(
                            expandedId === apt.id ? null : apt.id
                          )
                        }
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400">
                              {apt.scheduledStart
                                ? formatDate(apt.scheduledStart)
                                : "\u2014"}
                            </span>
                            <span className="font-medium text-gray-900">
                              {apt.scheduledStart
                                ? format(
                                    parseISO(apt.scheduledStart),
                                    "HH:mm"
                                  )
                                : "\u2014"}
                              {apt.scheduledEnd && (
                                <span className="text-gray-400">
                                  {" - "}
                                  {format(
                                    parseISO(apt.scheduledEnd),
                                    "HH:mm"
                                  )}
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {apt.patientName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {apt.patientPhone}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-gray-600">
                          <div className="flex items-center gap-1.5">
                            {apt.isEmergency && (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            )}
                            {getServiceName(apt.serviceId, locale)}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          {getChannelBadge(apt.bookingChannel, locale)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusVariant(apt.status)}>
                            {getStatusLabel(apt.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {apt.status === "pending_clinic_confirmation" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatus(apt.id, "confirmed");
                                  }}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                  title={t("appointments.confirmAppointment")}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatus(apt.id, "cancelled");
                                  }}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  title={t("appointments.cancelAppointment")}
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {apt.status === "confirmed" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatus(apt.id, "completed");
                                  }}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                  title={
                                    locale === "ar" ? "مكتمل" : "Terminer"
                                  }
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatus(apt.id, "cancelled");
                                  }}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  title={t("appointments.cancelAppointment")}
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateStatus(apt.id, "no_show");
                                  }}
                                  className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                                  title={t("appointments.status.noShow")}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(
                                  expandedId === apt.id ? null : apt.id
                                );
                              }}
                              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              {expandedId === apt.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Expanded details row */}
                      {expandedId === apt.id && (
                        <tr key={`${apt.id}-details`}>
                          <td
                            colSpan={6}
                            className="px-4 py-3 bg-gray-50/80"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-400 mb-1">
                                  {locale === "ar" ? "الهاتف" : "Telephone"}
                                </p>
                                <p className="text-gray-900">
                                  {apt.patientPhone}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-1">
                                  {locale === "ar" ? "القناة" : "Canal de reservation"}
                                </p>
                                <p>{getChannelBadge(apt.bookingChannel, locale)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-1">
                                  {locale === "ar" ? "تاريخ الطلب" : "Date de demande"}
                                </p>
                                <p className="text-gray-900">
                                  {format(
                                    parseISO(apt.createdAt),
                                    "d MMM yyyy, HH:mm",
                                    { locale: dateLocale }
                                  )}
                                </p>
                              </div>
                              {apt.patientNotes && (
                                <div className="sm:col-span-3">
                                  <p className="text-xs text-gray-400 mb-1">
                                    Notes
                                  </p>
                                  <p className="text-gray-700">
                                    {apt.patientNotes}
                                  </p>
                                </div>
                              )}
                              <div className="sm:col-span-3 flex gap-2">
                                {apt.isFirstVisit && (
                                  <Badge variant="default">
                                    {locale === "ar"
                                      ? "زيارة اولى"
                                      : "1ere visite"}
                                  </Badge>
                                )}
                                {apt.isEmergency && (
                                  <Badge variant="danger">
                                    {locale === "ar" ? "حالة طارئة" : "Urgence"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Appointment Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {locale === "ar" ? "موعد جديد" : "Nouveau rendez-vous"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              label={locale === "ar" ? "اسم المريض" : "Nom du patient"}
              placeholder={
                locale === "ar"
                  ? "ادخل اسم المريض"
                  : "Entrez le nom du patient"
              }
              fullWidth
            />
            <Input
              label={locale === "ar" ? "رقم الهاتف" : "Numero de telephone"}
              placeholder="+213 5XX XXX XXX"
              phonePrefix
              fullWidth
            />
            <Select
              label={locale === "ar" ? "الخدمة" : "Service"}
              options={serviceOptions}
              placeholder={
                locale === "ar" ? "اختر الخدمة" : "Selectionnez un service"
              }
              fullWidth
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={locale === "ar" ? "التاريخ" : "Date"}
                type="date"
                fullWidth
              />
              <Input
                label={locale === "ar" ? "الوقت" : "Heure"}
                type="time"
                fullWidth
              />
            </div>
            <Input
              label="Notes"
              placeholder={
                locale === "ar"
                  ? "ملاحظات اضافية..."
                  : "Notes supplementaires..."
              }
              fullWidth
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewDialog(false)}
            >
              {locale === "ar" ? "الغاء" : "Annuler"}
            </Button>
            <Button onClick={() => setShowNewDialog(false)}>
              {locale === "ar" ? "حفظ الموعد" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
