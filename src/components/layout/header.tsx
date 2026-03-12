"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Menu, X, Calendar } from "lucide-react";
import type { Locale } from "@/types";

const CLINIC_NAME_FR = "Cabinet Dentaire Dr. Amira Bensalem";
const CLINIC_NAME_AR = "عيادة الدكتورة أميرة بن سالم لطب الأسنان";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/gallery", key: "gallery" },
  { href: "/reviews", key: "reviews" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isRTL = locale === "ar";
  const clinicName = isRTL ? CLINIC_NAME_AR : CLINIC_NAME_FR;
  const otherLocale: Locale = locale === "ar" ? "fr" : "ar";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLanguageToggle = () => {
    router.replace(pathname, { locale: otherLocale });
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md"
            : "bg-white"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-18">
            {/* Logo */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
                C
              </div>
              <span className="hidden text-base font-bold text-secondary-800 sm:inline lg:text-lg">
                {clinicName}
              </span>
              <span className="text-base font-bold text-secondary-800 sm:hidden">
                Clinique Connect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-secondary-600 hover:bg-gray-100 hover:text-secondary-900"
                    )}
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                );
              })}
            </nav>

            {/* Right side: Language toggle + CTA + Hamburger */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={handleLanguageToggle}
                className="flex h-9 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-secondary-700 transition-colors hover:bg-gray-100"
                aria-label={t("language.toggle")}
              >
                <span className={cn(locale === "ar" ? "text-primary-600" : "text-secondary-400")}>
                  عر
                </span>
                <span className="mx-1 text-gray-300">|</span>
                <span className={cn(locale === "fr" ? "text-primary-600" : "text-secondary-400")}>
                  FR
                </span>
              </button>

              {/* Desktop Book Appointment CTA */}
              <Link
                href="/book"
                className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md md:flex"
              >
                <Calendar className="h-4 w-4" />
                {t("nav.booking")}
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary-700 transition-colors hover:bg-gray-100 md:hidden"
                aria-label={mobileMenuOpen ? t("close") : "Menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Nav */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white transition-all duration-300 md:hidden",
          mobileMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        )}
        style={{ top: "64px" }}
      >
        <nav className="flex flex-col px-6 py-8">
          {NAV_LINKS.map((link, index) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "border-b border-gray-100 py-4 text-lg font-medium transition-all",
                  isActive
                    ? "text-primary-600"
                    : "text-secondary-700 hover:text-primary-600",
                  mobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                )}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                {t(`nav.${link.key}`)}
              </Link>
            );
          })}

          {/* Mobile Book Appointment CTA */}
          <Link
            href="/book"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-primary-700",
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            )}
            style={{
              transitionDelay: mobileMenuOpen
                ? `${NAV_LINKS.length * 50}ms`
                : "0ms",
            }}
          >
            <Calendar className="h-5 w-5" />
            {t("nav.booking")}
          </Link>
        </nav>
      </div>
    </>
  );
}
