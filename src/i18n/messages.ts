/**
 * Static message imports for all 16 locales.
 *
 * WHY: Dynamic `import(\`../messages/${locale}.json\`)` fails in production
 * because Turbopack cannot resolve locale codes containing hyphens (e.g. zh-TW)
 * at build time. This static map eliminates all dynamic import paths.
 */
import en from "../../messages/en.json";
import zh from "../../messages/zh.json";
import zhTW from "../../messages/zh-TW.json";
import es from "../../messages/es.json";
import ja from "../../messages/ja.json";
import de from "../../messages/de.json";
import fr from "../../messages/fr.json";
import pt from "../../messages/pt.json";
import ru from "../../messages/ru.json";
import ko from "../../messages/ko.json";
import ar from "../../messages/ar.json";
import it from "../../messages/it.json";
import tr from "../../messages/tr.json";
import id from "../../messages/id.json";
import vi from "../../messages/vi.json";
import ro from "../../messages/ro.json";

const messagesMap: Record<string, unknown> = {
  en,
  zh,
  "zh-TW": zhTW,
  es,
  ja,
  de,
  fr,
  pt,
  ru,
  ko,
  ar,
  it,
  tr,
  id,
  vi,
  ro,
};

export function getMessages(locale: string): Record<string, any> {
  return (messagesMap[locale] || messagesMap["en"]) as Record<string, any>;
}
