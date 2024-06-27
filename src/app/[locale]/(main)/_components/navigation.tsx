"use client";
import { useMutation } from "convex/react";
import {
  BellIcon,
  ChevronsLeft,
  InboxIcon,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "~@/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import Navbar from "~@/app/[locale]/(main)/_components/navbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~@/components/ui/popover";
import { APP_ROUTE } from "~@/constanst/router";
import { useSearch } from "~@/hooks/useSearch";
import { useSettings } from "~@/hooks/useSettings";
import { cn } from "~@/lib/utils";
import { replacePathParams } from "~@/utils/router";
import { api } from "~convex/_generated/api";
import DocumentGroup from "./documentGroup";
import Item from "./item";
import TrashBox from "./trashBox";
import UserItem from "./userItem";
import { useLocale, useTranslations } from "next-intl";
import { translations } from "~messages/translation";
import NotiList from "./notisList";
import { useNoti } from "~@/hooks/useNoti";
import { useNavigation } from "~@/hooks/useNavigation";

const DEFAULT_WIDTH = 300;
const Navigation = () => {
  const t = useTranslations();
  const isMobile = useMediaQuery("(max-width:768px)");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const search = useSearch();
  const settings = useSettings();
  const navigation = useNavigation();
  const noti = useNoti();
  const locale = useLocale();
  const create = useMutation(api.documents.create);
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isReset, setIsReset] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = (e: MouseEvent) => {
    isResizingRef.current = false;
    const navbarWidth = Number(sidebarRef.current?.style.width.slice(0, -2));
    navigation.setNavWidth(navbarWidth);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = e.clientX;
    if (newWidth < DEFAULT_WIDTH) newWidth = DEFAULT_WIDTH;
    if (newWidth > 480) newWidth = 480;
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsReset(true);
      sidebarRef.current.style.width = isMobile ? "100%" : `${DEFAULT_WIDTH}px`;
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : `calc(100% - ${DEFAULT_WIDTH}px)`
      );
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : `${DEFAULT_WIDTH}px`
      );
      setTimeout(() => setIsReset(false), 300);
    }
  };

  const collapsed = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsReset(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
    }
  };

  const handleCreate = () => {
    const promise = create({ title: "Untitled" }).then((docId) => {
      router.push(
        replacePathParams(APP_ROUTE.DOCUMENTS_DETAIL, { id: docId }),
        { locale }
      );
    });
    toast.promise(promise, {
      loading: t(translations.Create_note.Loading),
      success: t(translations.Create_note.Success),
      error: t(translations.Create_note.Error),
    });
  };

  useEffect(() => {
    if (isMobile) {
      collapsed();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapsed();
    }
  }, [isMobile, pathname]);
  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `group/sidebar h-[100vh] bg-secondary overflow-y-hidden relative justify-between flex w-[${DEFAULT_WIDTH}px] flex-col z-[999999]`,
          isReset && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
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
        <div className="px-2 space-y-[0.5]">
          <UserItem />
          <Item
            onClick={search.onOpen}
            label={t(translations.Title.Search)}
            icon={Search}
            isSearch
          />
          <Item
            onClick={settings.onOpen}
            label={t(translations.Title.Settings)}
            icon={Settings}
          />

          <Item
            onClick={noti.toggle}
            label={t(translations.Noti.Title)}
            icon={InboxIcon}
          />

          <Item
            onClick={handleCreate}
            label={t(translations.Title.New_note)}
            icon={PlusCircle}
          />
        </div>
        <div className="mt-4 overflow-y-auto px-2 flex-1">
          <DocumentGroup />
          {/* <Item onClick={handleCreate} icon={Plus} label="New note" /> */}
        </div>

        <Popover>
          <PopoverTrigger className="w-full py-2 h-fit border-[1px] border-solid border-text-muted-foreground">
            <Item label={t(translations.Title.Trash)} icon={Trash} />
          </PopoverTrigger>
          <PopoverContent
            side={isMobile ? "bottom" : "right"}
            className="p-0 w-72"
          >
            <TrashBox />
          </PopoverContent>
        </Popover>

        <div
          className="opacity-30 hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-[3px] hover:w-1 bg-primary/10 right-0 top-0"
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
        ></div>
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          `absolute top-0 z-[99999] left-60 w-[calc(100%-${DEFAULT_WIDTH}px)]`,
          isReset && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
      <div>
        <NotiList />
      </div>
    </>
  );
};

export default Navigation;
