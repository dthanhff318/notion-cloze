"use client";
import { CircleUserRound, Globe, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "../modeToggle";
import { cn } from "~@/lib/utils";
import { Avatar, AvatarImage } from "~@/components/ui/avatar";
import { Label } from "~@/components/ui/label";
import { useUser } from "@clerk/clerk-react";
import EditProfile from "./editProfile";
import Language from "./language";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { translations } from "~messages/translation";

const SettingsWrap = () => {
  const { user } = useUser();
  const t = useTranslations();
  const pathname = usePathname();
  type ListItemKeys = (typeof listItem)[number]["key"];
  const listItem = [
    {
      icon: CircleUserRound,
      title: "My account",
      key: "My account",
    },
    {
      icon: SlidersHorizontal,
      title: t(translations.Settings.My_setting.My_setting),
      key: "My settings",
    },
    {
      icon: Globe,
      title: t(translations.Settings.Language.Language_region),
      key: "Language & region",
    },
  ] as const;

  const selectTab = (key: ListItemKeys) => {
    setTab(key);
    localStorage.setItem("settingTab", JSON.stringify(key));
  };

  const [tab, setTab] = useState<ListItemKeys>("My account");

  useEffect(() => {
    const localTab = JSON.parse(
      localStorage.getItem("settingTab") ?? JSON.stringify("My account")
    );
    setTab(localTab as ListItemKeys);
  }, [pathname]);

  return (
    <div className="flex h-full pt-4">
      <div className="flex flex-col shrink-0 w-[230px] gap-1 border-solid border-r-2 border-primary/10 px-1 h-full space-y-1 p">
        <div className="flex gap-2 items-center pl-1">
          <Avatar className="h-7 w-7">
            <AvatarImage className="object-cover" src={user?.imageUrl} />
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user?.lastName}</p>
            <p className="text-muted-foreground text-xs">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          {listItem.map((e) => {
            const Icon = e.icon;
            return (
              <div
                key={e.key}
                role="button"
                className={cn(
                  "flex items-center text-muted-foreground text-sm hover:bg-primary/10 px-4 py-1 rounded-sm font-medium",
                  e.key === tab && "bg-primary/10 text-primary"
                )}
                onClick={() => selectTab(e.key)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {e.title}
              </div>
            );
          })}
        </div>
      </div>
      <div className="shrink-1 flex-1 px-8 md:px-6">
        <p className="font-medium text-base border-solid border-b-2 border-primary/10 pb-3 mb-4">
          {listItem.find((e) => e.key === tab)?.title}
        </p>
        {tab === "My account" && <EditProfile />}
        {tab === "My settings" && (
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1 ">
              <Label className="text-sm font-medium">
                {t(translations.Settings.My_setting.Appearance)}
              </Label>
              <span className="text-[0.8rem] text-muted-foreground">
                {t(translations.Settings.My_setting.Appearance_desc)}
              </span>
            </div>
            <ModeToggle />
          </div>
        )}
        {tab === "Language & region" && <Language />}
      </div>
    </div>
  );
};

export default SettingsWrap;
