"use client";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { ChevronsLeft, FileIcon, InboxIcon } from "lucide-react";
import moment from "moment";
import { useLocale, useTranslations } from "next-intl";
import { ElementRef, useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Spinner } from "~@/components/spinner";
import { Avatar, AvatarImage } from "~@/components/ui/avatar";
import { Button } from "~@/components/ui/button";
import { APP_ROUTE } from "~@/constanst/router";
import { useNavigation } from "~@/hooks/useNavigation";
import { useNoti } from "~@/hooks/useNoti";
import { cn } from "~@/lib/utils";
import { useRouter } from "~@/navigation";
import { replacePathParams } from "~@/utils/router";
import { api } from "~convex/_generated/api";
import { Id } from "~convex/_generated/dataModel";
import { translations } from "~messages/translation";

const DEFAULT_WIDTH = 310;

enum ACTION_TYPE {
  ACCEPT = "accept",
  DENY = "deny",
}

const NotiList = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width:768px)");
  const noti = useNoti();
  const navigation = useNavigation();
  const notiRef = useRef<ElementRef<"div">>(null);
  const notis = useQuery(api.notis.getNotis);
  const router = useRouter();
  const actionNoti = useMutation(api.notis.handleRequestPermission);
  moment.locale(locale);

  const collapsed = () => {
    if (notiRef.current) {
      noti.onClose();
    }
  };

  const jumpToDoc = (id: string) => {
    router.push(
      replacePathParams(APP_ROUTE.DOCUMENTS_DETAIL, {
        id,
      }),
      { locale }
    );
  };

  const handleAction = async (
    typeNoti: string,
    notiId: Id<"notis">,
    action: ACTION_TYPE
  ) => {
    switch (typeNoti) {
      case "REQUEST_PERMISSION":
        await actionNoti({
          notiId,
          action,
        });
        break;
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
        `group/side-noti absolute top-0 left-[${navigation.navWidth}px] overflow-hidden transition-all ease-in-out w-[${DEFAULT_WIDTH}px] duration-300 h-[100vh] bg-secondary overflow-y-hidden justify-between flex flex-col z-[999999]`,
        !noti.isOpen && "translate-x-[-200%] z-[99999]",
        noti.isOpen && `translate-x-0 `
      )}
    >
      <div
        role="button"
        className={cn(
          "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/side-noti:opacity-100 transition",
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
            <div
              key={noti._id}
              className="hover:bg-muted-foreground/10 flex p-2 gap-2 items-start"
            >
              <div className="shrink-0 flex gap-2 items-center ">
                <span className="h-2 w-2 bg-[#2383e2] rounded-[50%]"></span>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.imageUrl} className="object-cover" />
                </Avatar>
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <div className="flex justify-between items-baseline w-full">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold">{user?.lastName}</span> request
                    access to
                  </p>
                  <span className="text-xs text-muted-foreground mr-2">
                    {moment(noti._creationTime).startOf("day").fromNow()}
                  </span>
                </div>
                <div
                  className="flex items-center"
                  role="button"
                  onClick={() => jumpToDoc(noti.documentId)}
                >
                  {noti.document?.icon ? (
                    <div className={cn("mr-1 text-[16px]")}>
                      {noti.document?.icon}
                    </div>
                  ) : (
                    <FileIcon className="h-[16px] w-[16px] mr-1 text-muted-foreground" />
                  )}

                  <p className="text-muted-foreground text-xs font-bold underline">
                    {noti.document?.title}
                  </p>
                </div>
                <div className="bg-warningback px-2 py-1 rounded-md">
                  <p className="text-xs text-warningtext">
                    Make sure you trust this external user before sharing any
                    content
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                      handleAction(noti.type, noti._id, ACTION_TYPE.ACCEPT)
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                      handleAction(noti.type, noti._id, ACTION_TYPE.DENY)
                    }
                  >
                    Deny
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotiList;
