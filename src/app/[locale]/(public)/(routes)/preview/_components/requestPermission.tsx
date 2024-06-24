"use client";
import React from "react";
import Image from "next/image";
import { Button } from "~@/components/ui/button";
import { useTranslations } from "next-intl";
import { translations } from "~messages/translation";
import { useMutation } from "convex/react";
import { api } from "~convex/_generated/api";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

const RequestPermission = () => {
  const t = useTranslations();
  const { user } = useUser();
  const params = useParams<{ documentId: string }>();
  const request = useMutation(api.notis.createNotis);

  const onRequest = () => {
    const promise = request({
      documentId: params.documentId,
      fromUser: user?.id,
      type: "REQUEST_PERMISSION",
    });
    toast.promise(promise, {
      success: t(translations.Request_permission.Request_success),
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/error.png"
        alt="Error"
        height="300"
        width="300"
        className="dark:hidden"
      />
      <Image
        src="/error-dark.png"
        alt="Error"
        height="300"
        width="300"
        className="hidden dark:block"
      />
      <h2 className="text-xl font-medium">
        {t(translations.Request_permission.Title)}
      </h2>
      <Button onClick={onRequest}>
        {t(translations.Request_permission.Request)}
      </Button>
    </div>
  );
};

export default RequestPermission;
