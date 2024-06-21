"use client";
import { useMutation } from "convex/react";
import { Archive, MoreHorizontal, Trash } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~@/components/ui/dropdown-menu";
import { Skeleton } from "~@/components/ui/skeleton";
import { APP_ROUTE } from "~@/constanst/router";
import { FORMAT_TIME_FULLY, FORMAT_TIME_LOCALE } from "~@/constanst/time";
import { api } from "~convex/_generated/api";
import { Doc } from "~convex/_generated/dataModel";
import { useLocale, useTranslations } from "next-intl";
import { translations } from "~messages/translation";

type Props = {
  document: Doc<"documents">;
};

const Menu = ({ document }: Props) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const archive = useMutation(api.documents.archive);
  const remove = useMutation(api.documents.remove);

  // Set locale for moment
  moment.locale(locale);

  const onArchive = () => {
    const promise = archive({ id: document._id }).then(() => {
      router.push(APP_ROUTE.DOCUMENTS);
    });
    toast.promise(promise, {
      loading: t(translations.Archive_note.Loading),
      success: t(translations.Archive_note.Success),
      error: t(translations.Archive_note.Error),
    });
  };

  const onRemove = () => {
    const promise = remove({
      id: document._id,
    }).then(() => {
      router.push(APP_ROUTE.DOCUMENTS);
    });
    toast.promise(promise, {
      loading: t(translations.Remove_note.Loading),
      success: t(translations.Remove_note.Success),
      error: t(translations.Remove_note.Error),
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        {document.isArchived ? (
          <DropdownMenuItem onClick={onRemove}>
            <Trash className="h-4 w-4 mr-2" />
            {t(translations.Title.Delete)}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="h-4 w-4 mr-2" />
            {t(translations.Title.Archive)}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          {t(translations.Title.Created_at, {
            time: moment(document._creationTime).format(FORMAT_TIME_LOCALE),
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};

export default Menu;
