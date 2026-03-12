"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Send,
  Clock,
  Phone,
  FileText,
  ArrowRight,
} from "lucide-react";

// Mock messages
interface MockMessage {
  id: string;
  patientName: string;
  patientPhone: string;
  preview: string;
  fullMessage: string;
  time: string;
  isRead: boolean;
  channel: "whatsapp" | "website" | "sms";
}

const mockMessages: MockMessage[] = [
  {
    id: "msg-001",
    patientName: "Fatima Zahra Benmoussa",
    patientPhone: "+213 555 111 222",
    preview: "Bonjour, je voudrais savoir si...",
    fullMessage:
      "Bonjour, je voudrais savoir si je peux avancer mon rendez-vous de samedi a jeudi si possible ? J'ai un empechement ce week-end. Merci d'avance.",
    time: "10:30",
    isRead: false,
    channel: "whatsapp",
  },
  {
    id: "msg-002",
    patientName: "Karim Boudiaf",
    patientPhone: "+213 555 333 444",
    preview: "Est-ce que le cabinet est ouvert...",
    fullMessage:
      "Est-ce que le cabinet est ouvert ce jeudi apres-midi ? Je souhaite prendre un rendez-vous pour un detartrage. C'est ma premiere visite.",
    time: "09:15",
    isRead: false,
    channel: "whatsapp",
  },
  {
    id: "msg-003",
    patientName: "Leila Mebarki",
    patientPhone: "+213 555 999 000",
    preview: "Merci docteur pour les soins...",
    fullMessage:
      "Merci docteur pour les soins d'hier. La douleur a bien diminue. Je voulais savoir quand je dois revenir pour le controle ?",
    time: "Hier",
    isRead: true,
    channel: "whatsapp",
  },
  {
    id: "msg-004",
    patientName: "Ahmed Hadj Boudiaf",
    patientPhone: "+213 555 777 888",
    preview: "J'ai rempli le formulaire sur...",
    fullMessage:
      "J'ai rempli le formulaire sur votre site web pour un rendez-vous de detartrage. Pouvez-vous me confirmer la disponibilite pour la semaine prochaine ? Merci.",
    time: "Hier",
    isRead: true,
    channel: "website",
  },
];

// Message templates
interface MessageTemplate {
  id: string;
  nameFr: string;
  nameAr: string;
  contentFr: string;
  contentAr: string;
  type: "confirmation" | "reminder" | "review";
}

const messageTemplates: MessageTemplate[] = [
  {
    id: "tpl-001",
    nameFr: "Confirmation de rendez-vous",
    nameAr: "تأكيد الموعد",
    contentFr:
      "Bonjour {{name}}, votre rendez-vous du {{date}} a {{time}} est confirme. A bientot ! - Cabinet Dr. Bensalem",
    contentAr:
      "مرحبا {{name}}، تم تأكيد موعدك يوم {{date}} الساعة {{time}}. نراكم قريبا! - عيادة د. بن سالم",
    type: "confirmation",
  },
  {
    id: "tpl-002",
    nameFr: "Rappel 24h",
    nameAr: "تذكير قبل 24 ساعة",
    contentFr:
      "Rappel : Votre rendez-vous est demain a {{time}}. En cas d'empechement, contactez-nous. - Cabinet Dr. Bensalem",
    contentAr:
      "تذكير: موعدك غدا الساعة {{time}}. في حالة تغيير يرجى الاتصال بنا. - عيادة د. بن سالم",
    type: "reminder",
  },
  {
    id: "tpl-003",
    nameFr: "Demande d'avis",
    nameAr: "طلب تقييم",
    contentFr:
      "Bonjour {{name}}, merci pour votre visite ! Votre avis compte pour nous. Laissez-nous un avis Google : {{link}}",
    contentAr:
      "مرحبا {{name}}، شكرا لزيارتكم! رأيكم يهمنا. اتركوا لنا تقييما على Google: {{link}}",
    type: "review",
  },
];

export default function MessagesPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;

  const [selectedMessage, setSelectedMessage] = useState<MockMessage | null>(
    null
  );
  const [messages, setMessages] = useState(mockMessages);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  const selectMessage = (msg: MockMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      markAsRead(msg.id);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return <MessageSquare className="w-3.5 h-3.5 text-green-600" />;
      case "website":
        return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      case "sms":
        return <Phone className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5" />;
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type) {
      case "confirmation":
        return "border-green-200 bg-green-50/50";
      case "reminder":
        return "border-blue-200 bg-blue-50/50";
      case "review":
        return "border-amber-200 bg-amber-50/50";
      default:
        return "border-gray-200 bg-gray-50/50";
    }
  };

  const getTemplateIconColor = (type: string) => {
    switch (type) {
      case "confirmation":
        return "text-green-600";
      case "reminder":
        return "text-blue-600";
      case "review":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("messages.title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? locale === "ar"
                ? `${unreadCount} رسائل غير مقروءة`
                : `${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`
              : locale === "ar"
              ? "لا توجد رسائل جديدة"
              : "Aucun nouveau message"}
          </p>
        </div>
        <Button className="bg-[#25D366] hover:bg-[#1da851] text-white">
          <Send className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
          {locale === "ar" ? "ارسال عبر واتساب" : "Envoyer WhatsApp"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages list */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {t("messages.inbox")}
                </CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="warning">{unreadCount}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => selectMessage(msg)}
                    className={cn(
                      "w-full text-start p-4 transition-colors hover:bg-gray-50",
                      selectedMessage?.id === msg.id && "bg-primary-50/50",
                      !msg.isRead && "bg-blue-50/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                          !msg.isRead
                            ? "bg-primary-100 text-primary-700"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {msg.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm truncate",
                              !msg.isRead
                                ? "font-semibold text-gray-900"
                                : "font-medium text-gray-700"
                            )}
                          >
                            {msg.patientName}
                          </p>
                          <span className="text-xs text-gray-400 shrink-0">
                            {msg.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {getChannelIcon(msg.channel)}
                          <p className="text-xs text-gray-500 truncate">
                            {msg.preview}
                          </p>
                        </div>
                        {!msg.isRead && (
                          <div className="flex justify-end mt-1">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

                {messages.length === 0 && (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      {t("messages.noMessages")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message detail panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              {selectedMessage ? (
                <div>
                  {/* Message header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                        {selectedMessage.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedMessage.patientName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-gray-500">
                            {selectedMessage.patientPhone}
                          </p>
                          <span className="text-gray-300">|</span>
                          <div className="flex items-center gap-1">
                            {getChannelIcon(selectedMessage.channel)}
                            <span className="text-xs text-gray-500 capitalize">
                              {selectedMessage.channel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedMessage.time}
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedMessage.fullMessage}
                      </p>
                    </div>
                  </div>

                  {/* Reply actions */}
                  <div className="flex items-center gap-2">
                    <Button className="bg-[#25D366] hover:bg-[#1da851] text-white">
                      <Send className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
                      {locale === "ar"
                        ? "الرد عبر واتساب"
                        : "Repondre via WhatsApp"}
                    </Button>
                    <Button variant="outline">
                      <Phone className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
                      {locale === "ar" ? "اتصال" : "Appeler"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    {locale === "ar"
                      ? "اختر رسالة لعرض محتواها"
                      : "Selectionnez un message pour voir son contenu"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {locale === "ar"
                  ? "قوالب الرسائل المحفوظة"
                  : "Modeles de messages enregistres"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messageTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      getTemplateColor(tpl.type)
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText
                          className={cn(
                            "w-4 h-4",
                            getTemplateIconColor(tpl.type)
                          )}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {locale === "ar" ? tpl.nameAr : tpl.nameFr}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        {locale === "ar" ? "استخدام" : "Utiliser"}
                        <ArrowRight className="w-3 h-3 ltr:ml-1 rtl:mr-1" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {locale === "ar" ? tpl.contentAr : tpl.contentFr}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
