"use client";
import { ChevronsLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useNavigation } from "~@/hooks/useNavigation";
import { useNoti } from "~@/hooks/useNoti";
import { cn } from "~@/lib/utils";
import { translations } from "~messages/translation";

const DEFAULT_WIDTH = 300;

const NotiList = () => {
  const t = useTranslations();
  const isMobile = useMediaQuery("(max-width:768px)");
  const pathname = usePathname();
  const noti = useNoti();
  const navigation = useNavigation();
  const isResizingRef = useRef(false);
  const notiRef = useRef<ElementRef<"div">>(null);
  const [isReset, setIsReset] = useState(false);

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
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = e.clientX - navigation.navWidth;
    if (newWidth < DEFAULT_WIDTH) newWidth = DEFAULT_WIDTH;
    if (newWidth > 480) newWidth = 480;
    if (notiRef.current) {
      notiRef.current.style.width = `${newWidth}px`;
    }
  };

  const resetWidth = () => {
    if (notiRef.current) {
      noti.onOpen();
      // setIsReset(true);
      // notiRef.current.style.width = `${DEFAULT_WIDTH}px`;
      // setTimeout(() => setIsReset(false), 300);
    }
  };

  const collapsed = () => {
    if (notiRef.current) {
      // setIsReset(true);
      noti.onClose();
      // setTimeout(() => {
      // if (notiRef.current) {
      //   notiRef.current.style.width = `${0}px`;
      // }
      // setIsReset(false);
      // }, 300);
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
        `group/sidebar h-[100vh] bg-secondary overflow-y-hidden relative justify-between flex  flex-col z-[9999999]`,
        isReset && "transition-all ease-in-out duration-300",
        !noti.isOpen && "w-0 transition-all ease-in-out duration-300",
        noti.isOpen &&
          `w-[${navigation.notiWidth}px] transition-all ease-in-out duration-300`
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

      <p className="text-sm py-3 px-4 truncate">{t(translations.Noti.Title)}</p>

      <div
        className="opacity-30 hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-[3px] hover:w-1 bg-primary/10 right-0 top-0"
        onMouseDown={handleMouseDown}
        onClick={resetWidth}
      ></div>
    </div>
  );
};

export default NotiList;
