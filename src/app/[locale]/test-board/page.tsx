"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

/** Inline locale→Excalidraw langCode mapping (avoids importing ExcalidrawEditor at module scope for SSR) */
function toExcLangCode(locale: string): string {
  const map: Record<string, string> = {
    en: "en", zh: "zh-CN", "zh-TW": "zh-TW", ja: "ja-JP",
    es: "es-ES", de: "de-DE", fr: "fr-FR", pt: "pt-BR",
    ru: "ru-RU", ko: "ko-KR", ar: "ar-SA", it: "it-IT",
    tr: "tr-TR", id: "id-ID", vi: "vi-VN", ro: "ro-RO",
  };
  return map[locale] || "en";
}

function WorkerLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const t = useTranslations("board");

  useEffect(() => {
    fetch("/api/excalidraw-worker")
      .then((res) => res.text())
      .then((code) => {
        const blob = new Blob([code], { type: "text/javascript" });
        (window as any).__EXCALIDRAW_WORKER_BLOB_URL__ = URL.createObjectURL(blob);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        {t("loadingEditor")}
      </div>
    );
  }
  return <>{children}</>;
}

const Editor = dynamic(() => import("@/components/ExcalidrawEditor"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
      }}
    >
      Loading editor...
    </div>
  ),
});

export default function TestBoardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <WorkerLoader>
      <Editor
        boardId="test"
        initialData={{ elements: [], appState: {} }}
        readOnly={false}
        langCode={toExcLangCode(locale)}
      />
    </WorkerLoader>
  );
}
