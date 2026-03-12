import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn, getWhatsAppLink } from "@/lib/utils";
import { Phone, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import type { Locale } from "@/types";

const CLINIC_PHONE = "+213 555 123 456";
const CLINIC_WHATSAPP = "+213 555 123 456";
const CLINIC_NAME_FR = "Cabinet Dentaire Dr. Amira Bensalem";
const CLINIC_NAME_AR = "عيادة الدكتورة أميرة بن سالم لطب الأسنان";

const CLINIC_ADDRESS_FR = "Rue Didouche Mourad, Alger Centre, Alger";
const CLINIC_ADDRESS_AR = "شارع ديدوش مراد، وسط الجزائر، الجزائر";

const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/gallery", key: "gallery" },
  { href: "/reviews", key: "reviews" },
  { href: "/contact", key: "contact" },
] as const;

const HOURS_FR = [
  { day: "saturday", time: "09:00 - 17:00" },
  { day: "sunday", time: "09:00 - 17:00" },
  { day: "monday", time: "09:00 - 17:00" },
  { day: "tuesday", time: "09:00 - 17:00" },
  { day: "wednesday", time: "09:00 - 17:00" },
  { day: "thursday", time: "09:00 - 12:00" },
  { day: "friday", time: null },
];

export default function Footer() {
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");
  const tContact = useTranslations("contact");
  const locale = useLocale() as Locale;

  const isRTL = locale === "ar";
  const clinicName = isRTL ? CLINIC_NAME_AR : CLINIC_NAME_FR;
  const clinicAddress = isRTL ? CLINIC_ADDRESS_AR : CLINIC_ADDRESS_FR;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: Clinic Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
                C
              </div>
              <h3 className="text-lg font-bold text-white">
                {clinicName}
              </h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-secondary-300">
              {tFooter("description")}
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-secondary-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                <span>{clinicAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-300">
                <Phone className="h-4 w-4 shrink-0 text-primary-400" />
                <a
                  href={`tel:${CLINIC_PHONE.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
                  dir="ltr"
                >
                  {CLINIC_PHONE}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-300">
                <svg
                  className="h-4 w-4 shrink-0 text-green-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <a
                  href={getWhatsAppLink(CLINIC_WHATSAPP)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                  dir="ltr"
                >
                  {CLINIC_WHATSAPP}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-secondary-200">
                {tFooter("followUs")}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-800 text-secondary-300 transition-colors hover:bg-primary hover:text-white"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-800 text-secondary-300 transition-colors hover:bg-primary hover:text-white"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-bold text-white">
              {tFooter("quickLinks")}
            </h3>
            <nav className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="block text-sm text-secondary-300 transition-colors hover:text-primary-400"
                >
                  {tCommon(`nav.${link.key}`)}
                </Link>
              ))}
              <Link
                href="/book"
                className="block text-sm font-medium text-primary-400 transition-colors hover:text-primary-300"
              >
                {tCommon("nav.booking")}
              </Link>
            </nav>
          </div>

          {/* Column 3: Opening Hours */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
              <Clock className="h-4 w-4 text-primary-400" />
              {tContact("openingHours")}
            </h3>
            <table className="w-full text-sm">
              <tbody>
                {HOURS_FR.map((item) => (
                  <tr key={item.day} className="border-b border-secondary-800/50">
                    <td className="py-2 text-secondary-300">
                      {tContact(`days.${item.day}`)}
                    </td>
                    <td
                      className={cn(
                        "py-2 text-end",
                        item.time ? "text-secondary-200" : "text-red-400"
                      )}
                      dir="ltr"
                    >
                      {item.time || tContact("closed")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-start">
            <p className="text-xs text-secondary-400">
              {tFooter("copyright", {
                year: currentYear,
                clinicName: clinicName,
              })}
            </p>
            <div className="flex items-center gap-4 text-xs text-secondary-400">
              <Link
                href="/contact"
                className="transition-colors hover:text-secondary-200"
              >
                {tFooter("privacyPolicy")}
              </Link>
              <span className="text-secondary-700">|</span>
              <Link
                href="/contact"
                className="transition-colors hover:text-secondary-200"
              >
                {tFooter("legalNotice")}
              </Link>
              <span className="text-secondary-700">|</span>
              <Link
                href="/contact"
                className="transition-colors hover:text-secondary-200"
              >
                {tFooter("termsOfUse")}
              </Link>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-secondary-500">
            {tFooter("madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
