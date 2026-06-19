import { getRequestConfig } from "next-intl/server";
import { getMessages } from "./i18n/messages";

export const locales = ["en", "zh", "zh-TW", "es", "ja", "de", "fr", "pt", "ru", "ko", "ar", "it", "tr", "id", "vi", "ro"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];

// Handle both string and object parameter types
export default getRequestConfig(async (params: any) => {
  const locale = typeof params === 'string' ? params : params?.locale || 'en';

  return {
    locale,
    messages: getMessages(locale),
    timeZone: "UTC",
    now: new Date(),
  };
});
