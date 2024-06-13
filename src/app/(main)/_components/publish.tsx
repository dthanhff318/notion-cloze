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
import Link from "next/link";

type Props = {
  initialData: Doc<"documents">;
};

const Publish = ({ initialData }: Props) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

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
      {initialData.isPublished ? (
        <div className="space-y-4">
          <div className="flex items-center gap-x-2">
            <Radio className="text-sky-500 w-4 h-4 animate-pulse" />
            <p className="text-xs font-medium text-sky-500">Live on the web.</p>
          </div>
          <div className="flex items-center">
            <input
              value={url}
              className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
              disabled
            />
            <Button
              onClick={onCopy}
              disabled={copied}
              className="h-8 rounded-l-none"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="mt-2">
            <div className="flex justify-between">
              <p className="text-xs">Allow editing</p>
              <Switch
                checked={initialData.allowEdit}
                onClick={toggleAllowEdit}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
            >
              Unpublish
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              variant="outline"
              className="w-full text-xs space-x-1"
              asChild
            >
              <a href={url} target="_blank">
                <Globe className="h-4 w-4 text-sky-500 mr-1" />
                View site
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <AppWindow className="text-muted-foreground w-8 h-8 mb-2" />
          <p className="text-sm font-medium mb-2">Publish to web</p>
          <span className="text-xs text-muted-foreground mb-4">
            Publish a static website of this page.
          </span>
          <Button
            disabled={isSubmitting}
            onClick={onPublish}
            className="w-full text-xs"
          >
            Publish
          </Button>
        </div>
      )}
    </>
  );
};

export default Publish;
