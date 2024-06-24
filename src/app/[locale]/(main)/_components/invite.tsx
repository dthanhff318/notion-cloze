"use client";
import { useMutation } from "convex/react";
import { AppWindow, Check, Copy, Globe, Radio } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~@/components/ui/button";
import { useOrigin } from "~@/hooks/useOrigin";
import { api } from "~convex/_generated/api";
import { Doc } from "~convex/_generated/dataModel";
import { Switch } from "~@/components/ui/switch";
import { useTranslations } from "next-intl";
import { translations } from "~messages/translation";
import { Input } from "~@/components/ui/input";

type Props = {
  initialData: Doc<"documents">;
};

const Invite = ({ initialData }: Props) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);
  const t = useTranslations();
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: !initialData.isPublished,
    }).finally(() => setIsSubmitting(false));
    toast.promise(promise, {
      loading: initialData.isPublished ? "Unpublishing..." : "Publishing...",
      success: initialData.isPublished ? "Unpublished" : "Published!",
      error: "Something went wrong",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const toggleAllowEdit = async () => {
    await update({
      id: initialData._id,
      allowEdit: !initialData.allowEdit,
    }).then(() => {
      !initialData.allowEdit && toast.success("Allow editting this note.");
    });
  };

  return (
    <>
      <div className="flex gap-1">
        <Input
          placeholder="Email search"
          className="px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
        />
        <Button className="h-8">Invite</Button>
      </div>
      <p className="font-bold text-xs mt-4 ml-2">
        {t(translations.Coming_soon)}
      </p>
    </>
  );
};

export default Invite;
