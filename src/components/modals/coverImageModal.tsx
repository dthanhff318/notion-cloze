"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "~@/components/ui/dialog";
import { useCoverImage } from "~@/hooks/useCoverImage";
import { useEdgeStore } from "~@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "~convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "~convex/_generated/dataModel";
import { SingleImageDropzone } from "../singleImageDropzone";

const CoverImage = () => {
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isOpen, onClose, url } = useCoverImage();
  const { edgestore } = useEdgeStore();

  const { documentId } = useParams<{ documentId: Id<"documents"> }>();

  const update = useMutation(api.documents.update);

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: url,
        },
      });
      await update({
        id: documentId,
        coverImage: res.url,
      });
      onCloseModal();
    }
  };

  const onCloseModal = () => {
    setFile(undefined);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CoverImage;
