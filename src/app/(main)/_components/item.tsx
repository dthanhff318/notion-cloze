"use client";
import {
  Archive,
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Star,
  StarOff,
  Trash,
} from "lucide-react";
import React from "react";
import { Skeleton } from "~@/components/ui/skeleton";
import { cn } from "~@/lib/utils";
import { Id } from "~convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "~convex/_generated/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { replacePathParams } from "~@/utils/router";
import { APP_ROUTE } from "~@/constanst/router";

interface Props {
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
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const update = useMutation(api.documents.update);
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
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
          replacePathParams(APP_ROUTE.DOCUMENTS_DETAIL, { id: docId })
        );
      }
    );
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id }).then(() => {
      router.push(APP_ROUTE.DOCUMENTS);
    });
    toast.promise(promise, {
      loading: "Moving to archive...",
      success: "Note moved to archive!",
      error: "Failed to achive note.",
    });
  };

  const addToFavourite = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;
    console.log(!isFavourite);

    const promise = update({ id, isFavourite: !isFavourite }).then(() => {
      router.push(APP_ROUTE.DOCUMENTS);
    });
    toast.promise(promise, {
      loading: "Adding to favorites...",
      success: "Added to favorites!",
      error: "Failed to action.",
    });
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${12 * level + 12}px` : "12px" }}
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
        <div className="shrink-0 mr-2 text-[18px] group-hover:hidden min-w-[26px]">
          {documentIcon}
        </div>
      ) : (
        <Icon
          className={cn(
            "shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground  min-w-[26px]",
            !!id && "group-hover:hidden"
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
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
              {!isFavourite && !itemFavourite && (
                <DropdownMenuItem
                  onClick={addToFavourite}
                  className="flex items-center"
                >
                  <Star className="h-4 w-4 mr-2" />
                  <p>Favourite</p>
                </DropdownMenuItem>
              )}
              {itemFavourite && (
                <DropdownMenuItem
                  onClick={addToFavourite}
                  className="flex items-center"
                >
                  <StarOff className="h-4 w-4 mr-2" />
                  <p>Unfavourite</p>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={onArchive}
                className="flex items-center"
              >
                <Archive className="h-4 w-4 mr-2" />
                <p>Delete</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.username}
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
