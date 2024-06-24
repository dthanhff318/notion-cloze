import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const locale = useLocale();
  const origin =
    typeof window !== undefined && window.location.origin
      ? window.location.origin + `/${locale}`
      : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "";

  return origin;
};
