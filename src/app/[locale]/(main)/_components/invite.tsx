"use client";
import { useQuery } from "convex/react";
import { UserRoundSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Avatar, AvatarImage } from "~@/components/ui/avatar";
import { Button } from "~@/components/ui/button";
import { Input } from "~@/components/ui/input";
import useDebounce from "~@/hooks/useDebounce";
import { api } from "~convex/_generated/api";
import { Doc } from "~convex/_generated/dataModel";
import { translations } from "~messages/translation";
import { useUser } from "@clerk/clerk-react";

type Props = {
  initialData: Doc<"documents">;
};

const Invite = ({ initialData }: Props) => {
  const t = useTranslations();
  const { user } = useUser();
  const [search, setSearch] = useState<string>("");
  const debounceValue = useDebounce(search, search);
  const searchUsers = useQuery(api.users.getUsers, {
    email: debounceValue,
  })?.filter((e) => e.clerkId !== user?.id);
  console.log(debounceValue);

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
          <Button className="h-8">
            <UserRoundSearch />
          </Button>
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
