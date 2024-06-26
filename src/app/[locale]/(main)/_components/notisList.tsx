"use client";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { ChevronsLeft, InboxIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ElementRef, useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Spinner } from "~@/components/spinner";
import { Avatar, AvatarImage } from "~@/components/ui/avatar";
import { useNoti } from "~@/hooks/useNoti";
import { cn } from "~@/lib/utils";
import { api } from "~convex/_generated/api";
import { translations } from "~messages/translation";
import { Doc } from "~convex/_generated/dataModel";

const DEFAULT_WIDTH = 300;

const NotiList = () => {
  const t = useTranslations();
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width:768px)");
  const noti = useNoti();
  const notiRef = useRef<ElementRef<"div">>(null);
  const notis: Doc<"notis">[] | undefined = useQuery(api.notis.getNotis);

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
  console.log(notis);

  return (
    <div
      ref={notiRef}
      className={cn(
        `group/sidebar overflow-hidden transition-all ease-in-out duration-300 h-[100vh] bg-secondary overflow-y-hidden relative justify-between flex  flex-col z-[999999]`,
        !noti.isOpen && "w-0",
        noti.isOpen && `w-[${DEFAULT_WIDTH}px] `
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
            <p className="text-muted-foreground text-center text-xs truncate">
              {t.rich(translations.Noti.No_noti_desc, {
                br: () => <br />,
              })}
            </p>
          </div>
        )}
        {notis?.map((noti) => {
          return (
            <div key={noti._id} className="flex flex-col p-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#2383e2] rounded-[50%]"></span>
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={user?.imageUrl}
                      className="object-cover"
                    />
                  </Avatar>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold">{user?.lastName}</span> request
                    access to
                  </p>
                </div>
              </div>
              <div></div>
              <span></span>
              <div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotiList;
