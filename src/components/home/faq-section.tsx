"use client";

import { useTranslations, useLocale } from "next-intl";
import { MessageCircle, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { faqs } from "@/data/clinic";
import { getLocalizedField } from "@/lib/utils";
import { clinic } from "@/data/clinic";
import { getWhatsAppLink } from "@/lib/utils";
import type { Locale } from "@/types";

export default function FAQSection() {
  const t = useTranslations("faq");
  const locale = useLocale() as Locale;

  const sortedFaqs = [...faqs].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="section-padding bg-gray-50" id="faq">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            FAQ
          </span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" className="space-y-3">
            {sortedFaqs.map((faq) => {
              const question = getLocalizedField(faq, "question", locale);
              const answer = getLocalizedField(faq, "answer", locale);

              return (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-white rounded-xl border border-gray-100 px-5 shadow-sm"
                >
                  <AccordionTrigger className="py-5 text-start">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-primary shrink-0 hidden sm:block" />
                      <span className="font-medium text-secondary-900 text-sm md:text-base">
                        {question}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 ps-0 sm:ps-8">
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Still have questions? */}
          <div className="mt-12 text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {t("stillHaveQuestions")}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              {t("contactUs")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={getWhatsAppLink(
                  clinic.whatsappNumber,
                  locale === "ar"
                    ? "مرحباً، لدي سؤال"
                    : "Bonjour, j'ai une question"
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" iconLeft={<MessageCircle className="h-4 w-4" />}>
                  WhatsApp
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="outline">
                  {locale === "ar" ? "صفحة الاتصال" : "Page de contact"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
