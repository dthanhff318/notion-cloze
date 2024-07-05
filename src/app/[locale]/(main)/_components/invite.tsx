"use client";
import { useMutation, useQuery } from "convex/react";
import { AppWindow, Check, Copy, Globe, Radio } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~@/components/ui/button";
import { useOrigin } from "~@/hooks/useOrigin";
import { api } from "~convex/_generated/api";
import { Doc } from "~convex/_generated/dataModel";
import { Switch } from "~@/components/ui/switch";
import { useTranslations } from "next-intl";
import { translations } from "~messages/translation";
import { Input } from "~@/components/ui/input";
import { Avatar, AvatarImage } from "~@/components/ui/avatar";

type Props = {
  initialData: Doc<"documents">;
};

const Invite = ({ initialData }: Props) => {
  const t = useTranslations();
  const [search, setSearch] = useState<string>("");
  const searchUsers = useQuery(api.users.getUsers, {
    email: search,
  });
  console.log(searchUsers);
  return (
    <>
      <div className="space-y-2">
        <div className="flex gap-1">
          <Input
            placeholder="Email search"
            className="px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="h-8">{t(translations.Title.Search)}</Button>
        </div>
        <div className="flex flex-col">
          {searchUsers === undefined && !search && <></>}
          {searchUsers &&
            searchUsers.map((e) => {
              return (
                <div
                  className="py-1 px-2 flex gap-2 items-center rounded-md hover:bg-secondary hover:cursor-pointer"
                  key={e._id}
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={e?.imageUrl} className="object-cover" />
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold">{e.lastName}</p>
                    <p className="text-xs font-semi-bold text-muted-foreground">
                      {e.email}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <p className="font-bold text-xs mt-4 ml-2">
        {t(translations.Coming_soon)}
      </p>
    </>
  );
};

export default Invite;
