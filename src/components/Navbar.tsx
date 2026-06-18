"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Navbar({ locale = "en" }: { locale?: string }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href={`/${locale}`} className="flex items-center gap-2">
        <span className="text-xl font-bold text-blue-600">Craftisle</span>
        <span className="text-sm text-gray-400">Draw</span>
      </Link>

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
