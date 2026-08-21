"use client";

import { useTranslations } from "next-intl";

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("footer");
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Craftisle Draw</h3>
            <p className="text-sm text-gray-300">
              {t("description")}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href={`/${locale}`} className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href={`/${locale}/use-cases`} className="text-gray-300 hover:text-white">Use Cases</a></li>
              <li><a href={`/${locale}/board/new`} className="text-gray-300 hover:text-white">{t("newBoard")}</a></li>
              <li><a href="https://craftisle.com" className="text-gray-300 hover:text-white" rel="noopener noreferrer" target="_blank">Craftisle</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href={`/${locale}/privacy`} className="text-gray-300 hover:text-white">{t("privacy")}</a></li>
              <li><a href={`/${locale}/terms`} className="text-gray-300 hover:text-white">{t("terms")}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
