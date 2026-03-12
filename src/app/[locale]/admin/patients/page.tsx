"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { getLocalizedField } from "@/lib/utils";
import type { Locale } from "@/types";
import { appointments, services } from "@/data/clinic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Search,
  Users,
  Phone,
  Calendar,
  User,
} from "lucide-react";

// Derive patients from appointments
interface DerivedPatient {
  name: string;
  phone: string;
  totalVisits: number;
  lastVisitDate: string | null;
  appointmentIds: string[];
  isFirstVisit: boolean;
  preferredLanguage: string;
}

function derivePatients(): DerivedPatient[] {
  const patientsMap = new Map<string, DerivedPatient>();

  for (const apt of appointments) {
    const key = apt.patientPhone;
    if (patientsMap.has(key)) {
      const existing = patientsMap.get(key)!;
      existing.totalVisits += 1;
      existing.appointmentIds.push(apt.id);
      // Update last visit to most recent completed appointment
      if (
        apt.status === "completed" &&
        apt.scheduledStart &&
        (!existing.lastVisitDate || apt.scheduledStart > existing.lastVisitDate)
      ) {
        existing.lastVisitDate = apt.scheduledStart;
      }
    } else {
      patientsMap.set(key, {
        name: apt.patientName,
        phone: apt.patientPhone,
        totalVisits: 1,
        lastVisitDate:
          apt.status === "completed" && apt.scheduledStart
            ? apt.scheduledStart
            : null,
        appointmentIds: [apt.id],
        isFirstVisit: apt.isFirstVisit,
        preferredLanguage: "fr",
      });
    }
  }

  return Array.from(patientsMap.values());
}

export default function PatientsPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const dateLocale = locale === "ar" ? undefined : fr;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<DerivedPatient | null>(
    null
  );

  const allPatients = useMemo(() => derivePatients(), []);

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return allPatients;
    const q = searchQuery.toLowerCase();
    return allPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [allPatients, searchQuery]);

  // Get patient appointment history
  const getPatientAppointments = (patient: DerivedPatient) => {
    return appointments
      .filter((a) => patient.appointmentIds.includes(a.id))
      .sort(
        (a, b) =>
          new Date(b.scheduledStart || b.createdAt).getTime() -
          new Date(a.scheduledStart || a.createdAt).getTime()
      );
  };

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

  const getStatusVariant = (
    status: string
  ): "default" | "success" | "warning" | "danger" | "outline" => {
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("patients.title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {allPatients.length}{" "}
            {locale === "ar" ? "مرضى مسجلين" : "patients enregistres"}
          </p>
        </div>
        <Button>
          <User className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
          {t("patients.addPatient")}
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={
            locale === "ar"
              ? "بحث عن مريض بالاسم او الهاتف..."
              : "Rechercher par nom ou telephone..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 ltr:pl-10 rtl:pr-10 ltr:pr-3 rtl:pl-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary"
        />
      </div>

      {/* Patients table */}
      <Card>
        <CardContent className="p-0">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? locale === "ar"
                    ? "لم يتم العثور على نتائج"
                    : "Aucun resultat trouve"
                  : t("patients.noPatients")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === "ar" ? "الاسم" : "Nom"}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      {locale === "ar" ? "الهاتف" : "Telephone"}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      {t("patients.lastVisit")}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      {t("patients.totalVisits")}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      {locale === "ar" ? "اللغة" : "Langue"}
                    </th>
                    <th className="text-start py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.phone}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold shrink-0">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {patient.name}
                            </p>
                            {patient.isFirstVisit && (
                              <span className="text-xs text-primary-600">
                                {locale === "ar"
                                  ? "مريض جديد"
                                  : "Nouveau patient"}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {patient.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-gray-600">
                        {patient.lastVisitDate
                          ? format(
                              parseISO(patient.lastVisitDate),
                              "d MMM yyyy",
                              { locale: dateLocale }
                            )
                          : "\u2014"}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-gray-900 font-medium">
                          {patient.totalVisits}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-gray-600">
                        {patient.preferredLanguage === "ar"
                          ? "العربية"
                          : "Francais"}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          {locale === "ar" ? "تفاصيل" : "Details"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient detail dialog */}
      <Dialog
        open={!!selectedPatient}
        onOpenChange={(open) => !open && setSelectedPatient(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedPatient?.name || ""}
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-5">
              {/* Contact info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {locale === "ar" ? "الهاتف" : "Telephone"}
                  </p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {selectedPatient.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {locale === "ar" ? "اللغة المفضلة" : "Langue preferee"}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedPatient.preferredLanguage === "ar"
                      ? "العربية"
                      : "Francais"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {t("patients.totalVisits")}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedPatient.totalVisits}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {t("patients.lastVisit")}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedPatient.lastVisitDate
                      ? format(
                          parseISO(selectedPatient.lastVisitDate),
                          "d MMM yyyy",
                          { locale: dateLocale }
                        )
                      : "\u2014"}
                  </p>
                </div>
              </div>

              {/* Appointment history */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {t("patients.patientHistory")}
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getPatientAppointments(selectedPatient).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-900">
                            {apt.scheduledStart
                              ? format(
                                  parseISO(apt.scheduledStart),
                                  "d MMM yyyy, HH:mm",
                                  { locale: dateLocale }
                                )
                              : "\u2014"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 ltr:ml-5.5 rtl:mr-5.5">
                          {getLocalizedField(
                            services.find((s) => s.id === apt.serviceId) || {
                              nameFr: "\u2014",
                              nameAr: "\u2014",
                            },
                            "name",
                            locale
                          )}
                        </p>
                        {apt.patientNotes && (
                          <p className="text-xs text-gray-400 mt-0.5 ltr:ml-5.5 rtl:mr-5.5 truncate">
                            {apt.patientNotes}
                          </p>
                        )}
                      </div>
                      <Badge variant={getStatusVariant(apt.status)}>
                        {getStatusLabel(apt.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
