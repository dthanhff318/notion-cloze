"use client";
import React, { useEffect, useState } from "react";

import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "~@/navigation";
import { api } from "~convex/_generated/api";
import { useSearch } from "~@/hooks/useSearch";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~@/components/ui/command";
import { replacePathParams } from "~@/utils/router";
import { APP_ROUTE } from "~@/constanst/router";
import { useLocale } from "next-intl";

const SearchCommand = () => {
  const router = useRouter();
  const locale = useLocale();
  const documents = useQuery(api.documents.getSearch);
  const [isMounted, setIsMouted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  const onSelect = (id: string) => {
    router.push(replacePathParams(APP_ROUTE.DOCUMENTS_DETAIL, { id }), {
      locale,
    });
    onClose();
  };

  useEffect(() => {
    setIsMouted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [toggle]);

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((doc) => (
            <CommandItem
              key={doc._id}
              value={`${doc._id}-${doc?.title}`}
              title={doc?.title}
              onSelect={() => onSelect(doc._id)}
            >
              {doc.icon ? (
                <p className="mr-2 text-[18px]">{doc.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
