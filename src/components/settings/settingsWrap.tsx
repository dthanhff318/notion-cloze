import { Label } from "@radix-ui/react-dropdown-menu";
import { CircleUserRound, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import { ModeToggle } from "../modeToggle";
import { cn } from "~@/lib/utils";
import { Avatar, AvatarImage } from "~@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import EditProfile from "./editProfile";

const SettingsWrap = () => {
  const { user } = useUser();
  type ListItemKeys = (typeof listItem)[number]["key"];
  const listItem = [
    {
      icon: CircleUserRound,
      title: "My account",
      key: "My account",
    },
    {
      icon: SlidersHorizontal,
      title: "My settings",
      key: "My settings",
    },
  ] as const;

  const selectTab = (key: ListItemKeys) => {
    setTab(key);
  };
  const [tab, setTab] = useState<ListItemKeys>("My account");

  return (
    <div className="flex h-full">
      <div className="flex flex-col shrink-0 w-[230px] gap-1 border-solid border-r-2 border-primary/10 px-1 h-full space-y-1 p">
        <div className="flex gap-2 items-center pl-1">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.imageUrl} />
          </Avatar>
          <div>
            <p className="font-medium text-sm">
              {user?.firstName + " " + user?.lastName}
            </p>
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
          {tab}
        </p>
        {tab === "My account" && <EditProfile />}
        {tab === "My settings" && (
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1 ">
              <Label className="text-sm font-medium">Appearance</Label>
              <span className="text-[0.8rem] text-muted-foreground">
                Customize how Notioz looks on your device
              </span>
            </div>
            <ModeToggle />
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsWrap;
