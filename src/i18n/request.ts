import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "zh", "zh-TW", "es", "ja", "de", "fr", "pt", "ru", "ko", "ar", "it", "tr", "id", "vi", "ro"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = (store.get('locale')?.value as Locale) || defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "UTC",
    now: new Date(),
  };
});
