"use client";
import { useMutation } from "convex/react";
import { useRouter } from "~@/navigation";
import React from "react";
import { toast } from "sonner";
import ConfirmModal from "~@/components/modals/confirmModal";
import { Button } from "~@/components/ui/button";
import { api } from "~convex/_generated/api";
import { Id } from "~convex/_generated/dataModel";
import { APP_ROUTE } from "~@/constanst/router";
import { useLocale } from "next-intl";

type Props = {
  documentId: Id<"documents">;
};

const Banner = ({ documentId }: Props) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);
  const locale = useLocale();

  const onRemove = () => {
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Delete note...",
      success: "Note deleted!",
      error: "Failed to delete.",
    });
    router.push(APP_ROUTE.DOCUMENTS, { locale });
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restore note...",
      success: "Note restored!",
      error: "Failed to restore.",
    });
  };
  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center justify-center gap-x-2">
      <p>This page is in the trash.</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;
