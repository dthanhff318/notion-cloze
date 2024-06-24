"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import Cover from "~@/components/cover";
import Toolbar from "~@/components/toolbar";
import { Button } from "~@/components/ui/button";
import { Skeleton } from "~@/components/ui/skeleton";
import { APP_ROUTE } from "~@/constanst/router";
import { Link } from "~@/navigation";
import { api } from "~convex/_generated/api";
import { Id } from "~convex/_generated/dataModel";
import Image from "next/image";

type Props = {
  params: {
    documentId: Id<"documents">;
  };
};

const DocumentIdPage = ({ params }: Props) => {
  const Editor = useMemo(
    () => dynamic(() => import("~@/components/editor"), { ssr: false }),
    []
  );
  const document = useQuery(api.documents.getPreviewById, {
    id: params.documentId,
  });

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };
  
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }
  if (document === null) {
    return <div>Not found</div>;
  }

  if ((document as any).status === 403) {
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
        <h2 className="text-xl font-medium">Something went wrong</h2>
        <Button asChild>
          <Link href={APP_ROUTE.DOCUMENTS}>Go back</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="pb-40">
      <Cover preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar allowEdit={document.allowEdit} initialData={document} />
        <Editor
          editable={document.allowEdit}
          onChange={onChange}
          initialContent={document.content ?? ""}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
