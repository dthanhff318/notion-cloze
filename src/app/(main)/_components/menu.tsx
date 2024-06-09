import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { Archive, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
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
import { api } from "~convex/_generated/api";
import { Doc } from "~convex/_generated/dataModel";

type Props = {
  document: Doc<"documents">;
};

const Menu = ({ document }: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const archive = useMutation(api.documents.archive);
  const remove = useMutation(api.documents.remove);
  const onArchive = () => {
    const promise = archive({ id: document._id }).then(() => {
      router.push("/documents");
    });
    toast.promise(promise, {
      loading: "Moving to archive...",
      success: "Note moved to archive!",
      error: "Failed to achive note.",
    });
  };

  const onRemove = () => {
    const promise = remove({
      id: document._id,
    }).then(() => {
      router.push("/documents");
    });
    toast.promise(promise, {
      loading: "Removing note...",
      success: "Note have been removed!",
      error: "Failed to remove note.",
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
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
            Delete
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edit by: {user?.username}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};

export default Menu;
