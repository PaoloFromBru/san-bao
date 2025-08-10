
export const locales = ["it","fr","en","nl","es"] as const;
export type Locale = typeof locales[number];

export type Dict = typeof import("./it").dictionary;

export async function getDictionary(locale: Locale) {
  switch (locale) {
    case "it": return (await import("./it")).dictionary;
    case "fr": return (await import("./fr")).dictionary;
    case "en": return (await import("./en")).dictionary;
    case "nl": return (await import("./nl")).dictionary;
    case "es": return (await import("./es")).dictionary;
    default:   return (await import("./it")).dictionary;
  }
}
