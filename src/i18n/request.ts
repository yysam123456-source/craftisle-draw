import { getRequestConfig } from "next-intl/server";
import { getMessages } from "./messages";

export const locales = ["en", "zh", "zh-TW", "es", "ja", "de", "fr", "pt", "ru", "ko", "ar", "it", "tr", "id", "vi", "ro"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = (locale && locales.includes(locale as Locale)) ? locale : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: getMessages(resolvedLocale),
    timeZone: "UTC",
    now: new Date(),
  };
});
