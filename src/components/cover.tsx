import React from "react";
import { cn } from "~@/lib/utils";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { useCoverImage } from "~@/hooks/useCoverImage";
import { useMutation } from "convex/react";
import { api } from "~convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "~convex/_generated/dataModel";
import { toast } from "sonner";
import { useEdgeStore } from "~@/lib/edgestore";
import { Skeleton } from "~@/components/ui/skeleton";

type Props = {
  url?: string;
  preview?: boolean;
};

const Cover = ({ url, preview }: Props) => {
  const { edgestore } = useEdgeStore();
  const params = useParams<{ documentId: Id<"documents"> }>();
  const coverImage = useCoverImage();
  const remove = useMutation(api.documents.removeCoverImage);

  const onRemoveCoverImage = async () => {
    url &&
      (await edgestore.publicFiles.delete({
        url: url,
      }));
    const promise = remove({
      id: params.documentId,
    });
    toast.promise(promise, {
      loading: "Removing cover image",
      success: "Removed cover image",
      error: "Failed to remove cover image",
    });
  };
  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
            onClick={() => coverImage.onReplace(url)}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
            onClick={onRemoveCoverImage}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[150px]" />;
};
export default Cover;
