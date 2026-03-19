import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['fr', 'ar'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
