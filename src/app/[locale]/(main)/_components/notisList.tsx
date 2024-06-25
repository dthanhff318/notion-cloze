"use client";
import { useQuery } from "convex/react";
import { ChevronsLeft, InboxIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Spinner } from "~@/components/spinner";
import { useNavigation } from "~@/hooks/useNavigation";
import { useNoti } from "~@/hooks/useNoti";
import { cn } from "~@/lib/utils";
import { api } from "~convex/_generated/api";
import { translations } from "~messages/translation";

const DEFAULT_WIDTH = 300;

const NotiList = () => {
  const t = useTranslations();
  const isMobile = useMediaQuery("(max-width:768px)");
  const noti = useNoti();
  const notiRef = useRef<ElementRef<"div">>(null);
  const notis = useQuery(api.notis.getNotis);

  const collapsed = () => {
    if (notiRef.current) {
      noti.onClose();
    }
  };

  useEffect(() => {
    if (isMobile) {
      collapsed();
    }
  }, [isMobile]);

  return (
    <div
      ref={notiRef}
      className={cn(
        `group/sidebar h-[100vh] bg-secondary overflow-y-hidden relative justify-between flex  flex-col z-[999999]`,
        !noti.isOpen && "w-0 transition-all ease-in-out duration-300",
        noti.isOpen &&
          `w-[${DEFAULT_WIDTH}px] transition-all ease-in-out duration-300`
      )}
    >
      <div
        role="button"
        className={cn(
          "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
          isMobile && "opacity-100"
        )}
        onClick={collapsed}
      >
        <ChevronsLeft className="h-6 w-6" />
      </div>

      <p className="text-sm py-3 px-4 truncate text-muted-foreground font-medium">
        {t(translations.Noti.Title)}
      </p>
      <div className={cn("flex-1", notis?.length === 0 && "flex")}>
        {notis === undefined && (
          <div className="h-full flex items-center justify-center p-4">
            <Spinner size="lg" />
          </div>
        )}
        {notis?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-3">
            <InboxIcon size={30} />
            <p className="text-muted-foreground font-medium text-sm truncate">
              {t(translations.Noti.No_noti_title)}
            </p>
            <p className="text-muted-foreground text-center text-xs line-clamp-2">
              {t(translations.Noti.No_noti_desc)}
            </p>
          </div>
        )}
        {notis?.map((noti) => {
          return <div></div>;
        })}
      </div>
    </div>
  );
};

export default NotiList;
