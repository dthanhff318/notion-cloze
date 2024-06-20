"use client";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Label } from "~@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~@/components/ui/select";
import { locales } from "~@/i18n";
import { usePathname, useRouter } from "~@/navigation";
import { translations } from "~messages/translation";

const Language = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (e: string) => {
    startTransition(() => {
      router.push(pathName, { locale: e, scroll: false });
    });
  };

  return (
    <div className="flex items-center justify-between">
      <Label className="flex flex-col gap-y-1 flex-1 pr-2">
        <p className="text-sm font-medium">
          {t(translations.Settings.Language.Language)}
        </p>
        <span className="text-[0.8rem] text-muted-foreground">
          {t(translations.Settings.Language.Lang_desc)}
        </span>
      </Label>
      <Select defaultValue={locale} onValueChange={switchLanguage}>
        <SelectTrigger className="w-[150px] border-none">
          <SelectValue className="border-none" />
        </SelectTrigger>
        <SelectContent>
          {locales.map((e) => (
            <SelectItem key={e.key} value={e.key}>
              {e.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Language;
