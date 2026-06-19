import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "@/i18n/messages";

export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Use static import map (dynamic import() breaks for hyphenated locales like zh-TW)
  const messages = getMessages(locale);
  
  return {
    title: messages.seo.title,
    description: messages.seo.description,
    metadataBase: new URL(`https://draw.craftisle.com`),
    alternates: {
      languages: {
        en: "https://draw.craftisle.com/en",
        zh: "https://draw.craftisle.com/zh",
        "zh-TW": "https://draw.craftisle.com/zh-TW",
        es: "https://draw.craftisle.com/es",
        ja: "https://draw.craftisle.com/ja",
        de: "https://draw.craftisle.com/de",
        fr: "https://draw.craftisle.com/fr",
        pt: "https://draw.craftisle.com/pt",
        ru: "https://draw.craftisle.com/ru",
        ko: "https://draw.craftisle.com/ko",
        ar: "https://draw.craftisle.com/ar",
        it: "https://draw.craftisle.com/it",
        tr: "https://draw.craftisle.com/tr",
        id: "https://draw.craftisle.com/id",
        vi: "https://draw.craftisle.com/vi",
        ro: "https://draw.craftisle.com/ro",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = getMessages(locale);
  
  return (
    <NextIntlClientProvider messages={messages}>
      <SessionProvider>
        <Navbar locale={locale} />
        <main id="main-content" className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Footer locale={locale} />
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
