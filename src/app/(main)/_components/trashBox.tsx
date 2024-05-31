"use client";
import { useQuery, useMutation } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "~@/components/spinner";
import { Input } from "~@/components/ui/input";
import { api } from "~convex/_generated/api";
import { Id } from "~convex/_generated/dataModel";
import ConfirmModal from "~@/components/modals/confirmModal";

const Trashbox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState<string>("");

  const filteredDocuments = documents?.filter((doc) => {
    return doc.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (docId: string) => {
    router.push(`/documents/${docId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    docId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: docId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  const onRemove = (docId: Id<"documents">) => {
    const promise = remove({ id: docId });
    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });

    if (params.documentId === docId) {
    //   router.push("/documents");
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-start gap-x-1 p-2">
        <Search />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found
        </p>
        {filteredDocuments?.map((doc) => (
          <div
            key={doc._id}
            role="button"
            onClick={() => onClick(doc._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{doc.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, doc._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(doc._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trashbox;
