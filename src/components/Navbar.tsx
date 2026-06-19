"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { locales, type Locale } from "@/i18n/request";

const languageNames: Record<string, string> = {
  en: "English",
  zh: "中文",
  "zh-TW": "繁體中文",
  es: "Español",
  ja: "日本語",
  de: "Deutsch",
  fr: "Français",
  pt: "Português",
  ru: "Русский",
  ko: "한국어",
  ar: "العربية",
  it: "Italiano",
  tr: "Türkçe",
  id: "Bahasa Indonesia",
  vi: "Tiếng Việt",
  ro: "Română",
};

export default function Navbar({ locale = "en" }: { locale?: string }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();

  // Strip locale prefix from pathname to get the base path
  const basePath = pathname.replace(`/${locale}`, "") || "/";

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">Craftisle</span>
          <span className="text-sm text-gray-400">Draw</span>
        </Link>

        {/* Language Switcher */}
        <div className="relative ml-2">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition border border-gray-200"
            onBlur={() => setTimeout(() => setLangOpen(false), 150)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
            </svg>
            <span>{languageNames[locale || "en"] || "EN"}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {langOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-44 max-h-[320px] overflow-y-auto z-50">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}${basePath === "/" ? "" : basePath}`}
                  className={`block px-3 py-1.5 text-sm hover:bg-blue-50 transition ${
                    loc === locale ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"
                  }`}
                  onClick={() => setLangOpen(false)}
                >
                  {languageNames[loc]}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <Link href={`/${locale}`} className="text-sm text-gray-600 hover:text-gray-900">
              {t("boards")}
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm"
              >
                {(session.user.name?.[0] ?? session.user.email?.[0] ?? "U").toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    {session.user.email}
                  </div>
                  <a
                    href={`/${locale}/api/auth/signout`}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    onClick={async (e) => {
                      e.preventDefault();
                      await signOut({ callbackUrl: `/${locale}` });
                    }}
                  >
                    {t("signOut")}
                  </a>
                </div>
              )}
            </div>
          </>
        ) : (
          <a
            href={`/${locale}/api/auth/signin`}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t("signIn")}
          </a>
        )}
      </div>
    </nav>
  );
}
