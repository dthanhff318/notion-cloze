"use client";

import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "~@/lib/utils";
import { api } from "~convex/_generated/api";
import { Doc, Id } from "~convex/_generated/dataModel";
import Item from "./item";
import { replacePathParams } from "~@/utils/router";
import { APP_ROUTE } from "~@/constanst/router";

interface Props {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

const DocumentFavourite = ({ parentDocumentId, level, data }: Props) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (docId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const documents = useQuery(api.documents.getFavouriteDocs) as
    | Doc<"documents">[]
    | undefined;

  const onRedirect = (docId: string) => {
    router.push(replacePathParams(APP_ROUTE.DOCUMENTS_DETAIL, { id: docId }));
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: `12px` }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground py-1",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No page inside
      </p>
      {documents?.map((doc) => (
        <div key={doc._id}>
          <Item
            id={doc._id}
            label={doc.title}
            icon={FileIcon}
            documentIcon={doc.icon}
            active={params.documentId === doc._id}
            level={level}
            onClick={() => onRedirect(doc._id)}
            onExpand={() => onExpand(doc._id)}
            expanded={expanded[doc._id]}
          />
        </div>
      ))}
    </>
  );
};

export default DocumentFavourite;
