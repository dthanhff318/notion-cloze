import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { api } from "~convex/_generated/api";
import { Id } from "~convex/_generated/dataModel";

type Props = {
  documentId: Id<"documents">;
};

const Banner = ({ documentId }: Props) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Delete note...",
      success: "Note deleted!",
      error: "Failed to delete.",
    });
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Delete note...",
      success: "Note deleted!",
      error: "Failed to delete.",
    });
  };
  return <div></div>;
};

export default Banner;
