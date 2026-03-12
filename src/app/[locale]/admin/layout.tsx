"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn, getLocalizedField } from "@/lib/utils";
import { clinic } from "@/data/clinic";
import type { Locale } from "@/types";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin" as const, icon: LayoutDashboard, labelKey: "dashboard.title" as const },
  { href: "/admin/appointments" as const, icon: Calendar, labelKey: "appointments.title" as const },
  { href: "/admin/patients" as const, icon: Users, labelKey: "patients.title" as const },
  { href: "/admin/content" as const, icon: FileText, labelKey: "content.title" as const },
  { href: "/admin/reviews" as const, icon: Star, labelKey: "reviews.title" as const },
  { href: "/admin/messages" as const, icon: MessageSquare, labelKey: "messages.title" as const },
  { href: "/admin/analytics" as const, icon: BarChart3, labelKey: "analytics.title" as const },
  { href: "/admin/settings" as const, icon: Settings, labelKey: "settings.title" as const },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const clinicName = getLocalizedField(clinic, "name", locale);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Clinic name */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-dental flex items-center justify-center text-white font-bold text-lg shrink-0">
            C
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {clinicName}
            </p>
            <p className="text-xs text-gray-500">Administration</p>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      {/* User avatar / name at bottom */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold shrink-0">
            AB
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              Dr. Amira Bensalem
            </p>
            <p className="text-xs text-gray-500 truncate">
              {locale === "ar" ? "مالكة" : "Proprietaire"}
            </p>
          </div>
          <button
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title={locale === "ar" ? "تسجيل الخروج" : "Deconnexion"}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar - hidden on mobile, shown on md+ */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col bg-white ltr:border-r rtl:border-l border-gray-200">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-opacity duration-300",
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
        {/* Slide-in sidebar */}
        <aside
          className={cn(
            "absolute inset-y-0 ltr:left-0 rtl:right-0 w-64 bg-white shadow-xl",
            "transition-transform duration-300 ease-in-out flex flex-col",
            sidebarOpen
              ? "translate-x-0"
              : "ltr:-translate-x-full rtl:translate-x-full"
          )}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 ltr:right-3 rtl:left-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-md z-10"
          >
            <X className="w-5 h-5" />
          </button>
          <SidebarContent />
        </aside>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar with hamburger */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-900 truncate">
            {clinicName}
          </span>
        </div>

        {/* Page content with padding and max-width */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
