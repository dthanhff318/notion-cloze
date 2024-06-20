import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = [
  {
    title: "English",
    key: "en",
  },
  {
    title: "Việt Nam",
    key: "vi",
  },
];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // if (!locales.includes(locale as any)) notFound();
  if (!locales.find((e) => e.key === locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
