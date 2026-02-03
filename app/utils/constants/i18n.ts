export const LOCALE_STORAGE_KEY = 'app_locale';
export const SUPPORTED_LOCALES = ['en', 'ms'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
