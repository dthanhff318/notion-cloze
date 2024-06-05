"use client";

import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "~@/lib/utils";
import { api } from "~convex/_generated/api";
import { Doc, Id } from "~convex/_generated/dataModel";
import Item from "./item";

interface Props {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

const DocumentList = ({ parentDocumentId, level, data }: Props) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (docId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  }) as Doc<"documents">[] | undefined;

  const onRedirect = (docId: string) => {
    router.push(`/documents/${docId}`);
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
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground",
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
          {expanded[doc._id] && (
            <DocumentList level={(level ?? 0) + 1} parentDocumentId={doc._id} />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
