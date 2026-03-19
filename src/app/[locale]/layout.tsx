import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Montserrat, Noto_Sans_Arabic } from "next/font/google";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types";
import type { Metadata } from "next";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppFAB from "@/components/layout/whatsapp-fab";
import MobileBottomBar from "@/components/layout/mobile-bottom-bar";

import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Better Smile Clinic - Dr. Kaddour S.",
  description:
    "Cabinet Dentaire Spécialisé — Chirurgie · Implantologie · Dentisterie esthétique à Sidi Yahia, Hydra, Alger, Algérie. Prenez rendez-vous sur WhatsApp. | عيادة أسنان متخصصة في الجراحة، زراعة الأسنان، وطب الأسنان التجميلي بسيدي يحيى، حيدرة.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  keywords: [
    "dentiste",
    "Alger",
    "Hydra",
    "Sidi Yahia",
    "cabinet dentaire",
    "chirurgie dentaire",
    "implant dentaire",
    "dentisterie esthétique",
    "طبيب أسنان",
    "الجزائر",
    "حيدرة",
    "سيدي يحيى",
    "عيادة أسنان",
    "زراعة الأسنان",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const messages = await getMessages();
  const isRTL = typedLocale === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  const fontClass = isRTL
    ? `${notoSansArabic.variable} font-arabic`
    : `${montserrat.variable} font-french`;

  return (
    <html lang={typedLocale} dir={dir} suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${notoSansArabic.variable} ${fontClass} antialiased bg-white text-secondary-900`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WhatsAppFAB />
          <MobileBottomBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
