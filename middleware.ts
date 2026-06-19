import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./src/i18n/request";

export default createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
