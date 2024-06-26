"use client";
import { useMutation } from "convex/react";
import {
  Archive,
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Star,
} from "lucide-react";
import moment from "moment";
import "moment/min/locales.min";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~@/components/ui/dropdown-menu";
import { Skeleton } from "~@/components/ui/skeleton";
import { APP_ROUTE } from "~@/constanst/router";
import { FORMAT_TIME_LOCALE } from "~@/constanst/time";
import { cn } from "~@/lib/utils";
import { useRouter } from "~@/navigation";
import { replacePathParams } from "~@/utils/router";
import { api } from "~convex/_generated/api";
import { Doc, Id } from "~convex/_generated/dataModel";
import { translations } from "~messages/translation";
interface Props {
  doc?: Omit<Doc<"documents">, "lastEdited"> & {
    lastEdited?: {
      time: number;
      user: any;
    };
  };
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  label: string;
  icon: LucideIcon;
  isFavourite?: boolean;
  itemFavourite?: boolean;
  onClick?: () => void;
  onExpand?: () => void;
}

const Item = ({
  id,
  doc,
  label,
  icon: Icon,
  documentIcon,
  active,
  expanded,
  isSearch,
  level,
  isFavourite,
  itemFavourite,
  onExpand,
  onClick,
}: Props) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const update = useMutation(api.documents.update);
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  // Set locale for moment
  moment.locale(locale);
  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand && onExpand();
  };
  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (docId) => {
        if (!expanded) {
          onExpand && onExpand();
        }
        router.push(
          replacePathParams(APP_ROUTE.DOCUMENTS_DETAIL, { id: docId }),
          { locale }
        );
      }
    );
    toast.promise(promise, {
      loading: t(translations.Create_note.Loading),
      success: t(translations.Create_note.Success),
      error: t(translations.Create_note.Error),
    });
  };

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id }).then(() => {
      router.push(APP_ROUTE.DOCUMENTS);
    });
    toast.promise(promise, {
      loading: t(translations.Archive_note.Loading),
      success: t(translations.Archive_note.Success),
      error: t(translations.Archive_note.Error),
    });
  };

  const addToFavourite = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;

    const promise = update({ id, isFavourite: !doc?.isFavourite }).then(() => {
      router.push(APP_ROUTE.DOCUMENTS);
    });
    toast.promise(promise, {
      loading: t(translations.Favourites.Loading),
      success: t(translations.Favourites.Success),
      error: t(translations.Favourites.Error),
    });
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${12 * level + 12}px` : "6px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium rounded-sm",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && !itemFavourite && (
        <div
          role="button"
          className="h-full rounded-sm hidden group-hover:flex hover:bg-neutral-300 dark:bg-neutral-600 mr-2 min-w-[26px]  justify-center"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
        </div>
      )}
      {documentIcon ? (
        <div
          className={cn(
            "shrink-0 mr-2 text-[18px] min-w-[26px]",
            !itemFavourite && "group-hover:hidden"
          )}
        >
          {documentIcon}
        </div>
      ) : (
        <Icon
          className={cn(
            "shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground  min-w-[26px]",
            !!id && !itemFavourite && "group-hover:hidden"
          )}
        />
      )}

      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">Ctr + K</span>
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem
                onClick={addToFavourite}
                className="flex items-center"
              >
                <Star className="h-4 w-4 mr-2" />
                <p>
                  {t(
                    translations.Favourites[
                      isFavourite ? "Unfavourite" : "Favourite"
                    ]
                  )}
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onArchive}
                className="flex items-center"
              >
                <Archive className="h-4 w-4 mr-2" />
                <p>{t(translations.Title.Archive)}</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2 flex flex-col items-start gap-2">
                <p>
                  {t(translations.Title.Last_edited_by, {
                    name: doc?.lastEdited?.user?.lastName,
                  })}
                </p>
                <p>
                  {moment(doc?.lastEdited?.time || doc?._creationTime).format(
                    FORMAT_TIME_LOCALE
                  )}
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {!itemFavourite && (
            <div
              className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              onClick={onCreate}
              role="button"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${12 * level + 25}px` : "12px" }}
      className="flex gap-x-2 py-1"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;
