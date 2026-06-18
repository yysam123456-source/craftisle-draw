import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./src/i18n";

export default createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: "always",
});

// Note: next-intl handles the matcher automatically
// No need for custom config export
