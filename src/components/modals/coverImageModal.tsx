"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader } from "~@/components/ui/dialog";
import { useCoverImage } from "~@/hooks/useCoverImage";

const CoverImage = () => {
  const { isOpen, onClose } = useCoverImage();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <div>TODO: Upload image</div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverImage;
