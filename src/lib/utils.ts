import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Locale, OperatingHours } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedField(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  field: string,
  locale: Locale
): string {
  const key = `${field}${locale === 'ar' ? 'Ar' : 'Fr'}`;
  return (obj[key] as string) || '';
}

export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If starts with 0, replace with Algeria country code
  if (digits.startsWith('0')) {
    return '213' + digits.slice(1);
  }
  // If already has country code
  if (digits.startsWith('213')) {
    return digits;
  }
  return '213' + digits;
}

export function getWhatsAppLink(phone: string, message?: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const url = `https://wa.me/${formattedPhone}`;
  if (message) {
    return `${url}?text=${encodeURIComponent(message)}`;
  }
  return url;
}

export function isClinicOpen(operatingHours: OperatingHours, timezone: string = 'Africa/Algiers'): boolean {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const weekday = parts.find(p => p.type === 'weekday')?.value?.toLowerCase() || '';
  const hour = parts.find(p => p.type === 'hour')?.value || '00';
  const minute = parts.find(p => p.type === 'minute')?.value || '00';
  const currentTime = `${hour}:${minute}`;

  const dayMap: Record<string, string> = {
    saturday: 'sat', sunday: 'sun', monday: 'mon', tuesday: 'tue',
    wednesday: 'wed', thursday: 'thu', friday: 'fri'
  };
  const dayKey = dayMap[weekday] || weekday.slice(0, 3);
  const todayHours = operatingHours[dayKey];

  if (!todayHours || todayHours.length === 0) return false;

  return todayHours.some(slot => currentTime >= slot.open && currentTime <= slot.close);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' DA';
}

export function getServiceIcon(category: string): string {
  const icons: Record<string, string> = {
    general: 'Stethoscope',
    cosmetic: 'Sparkles',
    orthodontics: 'SmilePlus',
    surgery: 'Syringe',
    paediatric: 'Baby',
    emergency: 'AlertCircle',
  };
  return icons[category] || 'Stethoscope';
}
