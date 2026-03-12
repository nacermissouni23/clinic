// Locale type
export type Locale = 'ar' | 'fr';

// Clinic
export interface Clinic {
  id: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  wilaya: string;
  commune: string;
  addressAr: string;
  addressFr: string;
  phonePrimary: string;
  whatsappNumber: string;
  googlePlaceId?: string;
  latitude: number;
  longitude: number;
  operatingHours: OperatingHours;
  timezone: string;
  themePrimaryColor: string;
  defaultLanguage: Locale;
  status: 'trial' | 'active' | 'suspended';
  email?: string;
  emergencyPhone?: string;
}

export interface OperatingHours {
  [key: string]: { open: string; close: string }[];
}

// Dentist
export interface Dentist {
  id: string;
  clinicId: string;
  nameAr: string;
  nameFr: string;
  title: string;
  bioShortAr: string;
  bioShortFr: string;
  bioFullAr: string;
  bioFullFr: string;
  photoUrl: string;
  qualifications: Qualification[];
  specialtiesAr: string[];
  specialtiesFr: string[];
  universityAr: string;
  universityFr: string;
  graduationYear: number;
  yearsExperience: number;
  isAcceptingPatients: boolean;
  displayOrder: number;
}

export interface Qualification {
  degree: string;
  institutionAr: string;
  institutionFr: string;
  year: number;
}

// Service
export interface Service {
  id: string;
  clinicId: string;
  nameAr: string;
  nameFr: string;
  slugAr: string;
  slugFr: string;
  descriptionShortAr: string;
  descriptionShortFr: string;
  descriptionFullAr: string;
  descriptionFullFr: string;
  category: 'general' | 'cosmetic' | 'orthodontics' | 'surgery' | 'paediatric' | 'emergency';
  priceFrom?: number;
  priceTo?: number;
  priceDisplayAr?: string;
  priceDisplayFr?: string;
  durationMinutes: number;
  isBookableOnline: boolean;
  isEmergency: boolean;
  displayOrder: number;
  isActive: boolean;
  icon: string;
}

// Review
export interface Review {
  id: string;
  clinicId: string;
  source: 'google' | 'facebook' | 'internal';
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  textAr?: string;
  textFr?: string;
  replyText?: string;
  publishedAt: string;
  isFeatured: boolean;
  isVisible: boolean;
}

// Patient
export interface Patient {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  phone: string;
  whatsappNumber?: string;
  preferredLanguage: Locale;
  email?: string;
  gender?: 'male' | 'female';
  commune?: string;
  referralSource?: string;
  whatsappOptIn: boolean;
  reviewOptIn: boolean;
  recallOptIn: boolean;
  notes?: string;
  createdAt: string;
  lastVisitAt?: string;
}

// Appointment
export interface Appointment {
  id: string;
  clinicId: string;
  patientId?: string;
  patient?: Patient;
  dentistId?: string;
  dentist?: Dentist;
  serviceId?: string;
  service?: Service;
  requestedAt: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  status: 'pending_clinic_confirmation' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  bookingChannel: 'website_form' | 'whatsapp' | 'phone' | 'walk_in';
  isEmergency: boolean;
  isFirstVisit: boolean;
  patientNotes?: string;
  patientName: string;
  patientPhone: string;
  createdAt: string;
}

// Gallery Item
export interface GalleryItem {
  id: string;
  clinicId: string;
  serviceId?: string;
  service?: Service;
  beforeImageUrl: string;
  afterImageUrl: string;
  titleAr: string;
  titleFr: string;
  descriptionAr?: string;
  descriptionFr?: string;
  category: string;
  jawPosition?: 'upper' | 'lower' | 'both';
  consentObtained: boolean;
  isVisible: boolean;
  displayOrder: number;
}

// Booking Request (form submission)
export interface BookingRequest {
  name: string;
  phone: string;
  serviceId?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  isEmergency?: boolean;
}

// Contact Form
export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  preferredLanguage: Locale;
  preferredDay?: string;
  preferredTime?: string;
  treatmentRequired?: string;
  message?: string;
}

// Analytics
export interface AnalyticsEvent {
  type: 'page_view' | 'whatsapp_click' | 'call_click' | 'booking_submit' | 'contact_submit';
  page?: string;
  metadata?: Record<string, string>;
}

// FAQ
export interface FAQ {
  id: string;
  questionAr: string;
  questionFr: string;
  answerAr: string;
  answerFr: string;
  displayOrder: number;
}
