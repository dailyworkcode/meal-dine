import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'hi'] as const;

export const pathnames = {
  '/': '/',
  '/meals': '/meals',
  '/yoga': '/yoga',
  '/dashboard': '/dashboard',
};

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, pathnames });
