// S71g: Inline locale dictionary helper for the 4-language migration.
// Use when strings are hardcoded in components and moving each to messages/{locale}.json
// would create too much churn or the string is one-off (e.g. dev-time only, admin UI).
//
// Prefer next-intl `useTranslations()` for reusable strings.
// Prefer this helper for view-local inline strings that don't warrant a translation key.

import type { Locale } from '@/i18n/request';

export function L(
  locale: string,
  dict: Record<Locale, string>
): string {
  return (dict as Record<string, string>)[locale] ?? dict.en;
}
