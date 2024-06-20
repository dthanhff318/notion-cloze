"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~@/components/ui/select";
import { Label } from "~@/components/ui/label";
import { locales } from "~@/i18n";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "~@/navigation";

const Language = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();

  const switchLanguage = (e: string) => {
    router.push(
      pathName,
      { locale: e, scroll: false, shallow: true },
      { shallow: true },
      { shallow: true }
    );
  };
  return (
    <div className="flex items-center justify-between">
      <Label className="flex flex-col gap-y-1 flex-1">
        <p className="text-sm font-medium">Language</p>
        <span className="text-[0.8rem] text-muted-foreground">
          Change the language used in the user interface.
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
