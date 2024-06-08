"use client";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~@/components/ui/button";
import { api } from "~convex/_generated/api";

const DocumentsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((docId) => {
      router.push(`/documents/${docId}`);
    });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/document.webp"
        height="300"
        width="300"
        alt="empty"
        className="dark:hidden"
      />
      <Image
        src="/document-dark.png"
        height="300"
        width="300"
        alt="empty"
        className="dark:block hidden"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.username}'s Notioz
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
